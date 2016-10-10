var routeFeatures = {};
var routes = [];
var stops = [];
var bernmobilOriginalData = {};
var bernmobilDataByCourse = {};
loadBernmobilData(function (originalData) {
    bernmobilOriginalData = originalData;
    bernmobilDataByCourse = prepareDataByCourse(originalData);

    loadBernmobilFeatures(function (json) {
        routeFeatures = json.features;
        routes = getRoutes(routeFeatures);
        stops = getStops(routeFeatures);

        attachBernmobilDataToRoutes(bernmobilDataByCourse, routes);
        drawMap();
    });
});


function drawMap() {
    var lon_bern = 7.43886373;
    var lat_bern = 46.94914575;
    var min_zoom = (1 << 20) + (1 << 19);
    var max_zoom = (1 << 24) + (1 << 19);

    var p = 2,
        drawBuildings = true;

    var courseTitle = d3.select("#courseTitle");
    var numberIncidentsTitle = d3.select("#numberIncidentsTitle");
    var totalDurationTitle = d3.select("#totalDurationTitle");
    var averageDurationTitle = d3.select("#averageDurationTitle");

// empty old map content for (in case of resize)
    var outerMapDiv = $("#map");
    outerMapDiv.empty();

    var width = outerMapDiv.width();
    var height = width / 3 * 2;
    var prefix = prefixMatch(["webkit", "ms", "Moz", "O"]);

    var tile = d3.geo.tile()
        .size([width, height]);

    var projection = d3.geo.mercator()
        .scale((1 << 22) / p / Math.PI)
        .translate([-width / 2, -height / 2]); // just temporary

    var tileProjection = d3.geo.mercator();

    var tilePath = d3.geo.path()
        .projection(tileProjection);

//focus onto Bern, limit zoom (and later panning)
    var zoom = d3.behavior.zoom()
        .scale(projection.scale() * p * Math.PI)
        .scaleExtent([min_zoom, max_zoom]) /* limit zoom, first array element is "out-zoom", second is "in-zoom", i.e. min and max zoom (and << is bitshift) */


        .translate(projection([lon_bern, lat_bern]).map(function (x) { /* focus onto Bern */
            return -x;
        }))
        .on("zoom", zoomed);


    var map = d3.select("#map").append("div")
        .attr("class", "map")
        .style("width", width + "px")
        .style("height", height + "px")
        .call(zoom)
        .on("mousemove", mousemoved);

    var layerWater = map.append("div")
        .attr("class", "layerWater");

    var layerRoads = map.append("div")
        .attr("class", "layerRoads");

    var layerBuildings = map.append("div")
        .attr("class", "layerBuildings");

    var layerStops = map.append("div")
        .attr("class", "layerStops");

    var stopsSvg = layerStops.append("svg")
        .attr("width", width)
        .attr("height", height);

    var layerRoutes = map.append("div")
        .attr("class", "layerRoutes");
    var routesSvg = layerRoutes.append("svg")
        .attr("width", width)
        .attr("height", height);

    var info = map.append("div")
        .attr("class", "info");

    var routesPath = d3.geo.path().projection(projection);
    var routesColorScale = d3.scale.linear().domain([0, 1]).range(["yellow", "red"]);
    var col = routesColorScale(1);

    zoomed();

    function zoomed() {
        var tiles = tile
            .scale(zoom.scale())
            .translate(zoom.translate())
            ();

        projection
            .scale(zoom.scale() / p / Math.PI)
            .translate(zoom.translate());

        var imageWater = layerWater
            .style(prefix + "transform", matrix3d(tiles.scale, tiles.translate))
            .selectAll(".tileWater")
            .data(tiles, function (d) {
                return d;
            });

        imageWater.exit()
            .each(function (d) {
                this._xhr.abort();
            })
            .remove();

        imageWater.enter().append("svg")
            .attr("class", "tileWater")
            .style("left", function (d) {
                return d[0] * 256 + "px";
            })
            .style("top", function (d) {
                return d[1] * 256 + "px";
            })
            .each(function (d) {
                var svg = d3.select(this),
                    openStreetMapType = 'vectiles-water-areas', //'vectiles-land-usages', //'vectiles-buildings', //'vectiles-highroad'
                //                        url = "http://" + ["a", "b", "c"][(d[0] * 31 + d[1]) % 3] + ".tile.openstreetmap.us/vectiles-highroad/" + d[2] + "/" + d[0] + "/" + d[1] + ".json";
                //    url = "http://" + ["a", "b", "c"][(d[0] * 31 + d[1]) % 3] + ".tile.openstreetmap.us/" + openStreetMapType + "/" + d[2] + "/" + d[0] + "/" + d[1] + ".json";

                     url = "https://foxclub.org/tools/tiles.php?tserv=" + ["a", "b", "c"][(d[0] * 31 + d[1]) % 3] + "&type=" + openStreetMapType + "&first=" + d[2] + "&second=" + d[0] + "&third=" + d[1];
                
                this._xhr = d3.json(url, function (error, json) {
                    var k = Math.pow(2, d[2]) * 256; // size of the world in pixels

                    tilePath.projection()
                        .translate([k / 2 - d[0] * 256, k / 2 - d[1] * 256]) // [0°,0°] in pixels
                        .scale(k / 2 / Math.PI);

                    svg.selectAll("path")
                        .data(json.features.sort(function (a, b) {
                            return a.properties.sort_key - b.properties.sort_key;
                        }))
                        .enter().append("path")
                        .attr("class", function (d) {
                            return d.properties.kind;
                        })
                        .attr("d", tilePath);
                });
            });


        var imageRoads = layerRoads
            .style(prefix + "transform", matrix3d(tiles.scale, tiles.translate))
            .selectAll(".tileRoad")
            .data(tiles, function (d) {
                return d;
            });

        imageRoads.exit()
            .each(function (d) {
                this._xhr.abort();
            })
            .remove();

        imageRoads.enter().append("svg")
            .attr("class", "tileRoad")
            .style("left", function (d) {
                return d[0] * 256 + "px";
            })
            .style("top", function (d) {
                return d[1] * 256 + "px";
            })
            .each(function (d) {
                var svg = d3.select(this),
                    openStreetMapType = 'vectiles-highroad',
                //                        url = "http://" + ["a", "b", "c"][(d[0] * 31 + d[1]) % 3] + ".tile.openstreetmap.us/vectiles-highroad/" + d[2] + "/" + d[0] + "/" + d[1] + ".json";
                //    url = "http://" + ["a", "b", "c"][(d[0] * 31 + d[1]) % 3] + ".tile.openstreetmap.us/" + openStreetMapType + "/" + d[2] + "/" + d[0] + "/" + d[1] + ".json";
                  
                 url = "https://foxclub.org/tools/tiles.php?tserv=" + ["a", "b", "c"][(d[0] * 31 + d[1]) % 3] + "&type=" + openStreetMapType + "&first=" + d[2] + "&second=" + d[0] + "&third=" + d[1];
                
                this._xhr = d3.json(url, function (error, json) {
                    var k = Math.pow(2, d[2]) * 256; // size of the world in pixels

                    tilePath.projection()
                        .translate([k / 2 - d[0] * 256, k / 2 - d[1] * 256]) // [0°,0°] in pixels
                        .scale(k / 2 / Math.PI);

                    svg.selectAll("path")
                        .data(json.features.sort(function (a, b) {
                            return a.properties.sort_key - b.properties.sort_key;
                        }))
                        .enter().append("path")
                        .attr("class", function (d) {
                            return d.properties.kind;
                        })
                        .attr("d", tilePath);
                });
            });

        if (drawBuildings) {
            var imageBuildings = layerBuildings
                .style(prefix + "transform", matrix3d(tiles.scale, tiles.translate))
                .selectAll(".tileBuilding")
                .data(tiles, function (d) {
                    return d;
                });

            imageBuildings.exit()
                .each(function (d) {
                    this._xhr.abort();
                })
                .remove();

            imageBuildings.enter().append("svg")
                .attr("class", "tileBuilding")
                .style("left", function (d) {
                    return d[0] * 256 + "px";
                })
                .style("top", function (d) {
                    return d[1] * 256 + "px";
                })
                .each(function (d) {
                    var svg = d3.select(this),
                        openStreetMapType = 'vectiles-buildings',
                    //                        url = "http://" + ["a", "b", "c"][(d[0] * 31 + d[1]) % 3] + ".tile.openstreetmap.us/vectiles-highroad/" + d[2] + "/" + d[0] + "/" + d[1] + ".json";
                    //    url = "http://" + ["a", "b", "c"][(d[0] * 31 + d[1]) % 3] + ".tile.openstreetmap.us/" + openStreetMapType + "/" + d[2] + "/" + d[0] + "/" + d[1] + ".json";
                      
                    url = "https://foxclub.org/tools/tiles.php?tserv=" + ["a", "b", "c"][(d[0] * 31 + d[1]) % 3] + "&type=" + openStreetMapType + "&first=" + d[2] + "&second=" + d[0] + "&third=" + d[1];
                      
                    this._xhr = d3.json(url, function (error, json) {
                        var k = Math.pow(2, d[2]) * 256; // size of the world in pixels

                        tilePath.projection()
                            .translate([k / 2 - d[0] * 256, k / 2 - d[1] * 256]) // [0°,0°] in pixels
                            .scale(k / 2 / Math.PI);

                        svg.selectAll("path")
                            .data(json.features.sort(function (a, b) {
                                return a.properties.sort_key - b.properties.sort_key;
                            }))
                            .enter().append("path")
                            .attr("class", function (d) {
                                return d.properties.kind;
                            })
                            .attr("d", tilePath);
                    });
                });
        }
        var routePaths = routesSvg.selectAll("path")
            .data(routes);
        var stopPaths = stopsSvg.selectAll("path")
            .data(stops);

        //enter route paths with respective width and colour
        routePaths.enter()
            .append("path")
            .attr("class", "bernmobilRoute")
            .attr("stroke-width", function (feature) {
                var strokeMax = 4;
                var strokeMin = 1;
                return feature.incidentCountNormalized * (strokeMax - strokeMin) + strokeMin + "px"; //get (normalized) stroke width
            })
            .attr("stroke", function (feature) {
                return routesColorScale(feature.incidentCountNormalized);
            })
            .on("mouseover", function (element) {
                courseTitle.text("Linie " + element.course);
                numberIncidentsTitle.text(element.incidentCount);
                totalDurationTitle.text((element.totalDuration / (60 * 24)).toFixed(2) + " Tage");
                averageDurationTitle.text((element.averageDuration / 60).toFixed(2) + " Stunden");
            });

        stopPaths.enter()
            .append("path")
            .attr("class", "bernmobilStop");

        routePaths.attr("d", routesPath);
        stopPaths.attr("d", routesPath);
    }

    function mousemoved() {
        info.text(formatLocation(projection.invert(d3.mouse(this)), zoom.scale()));
    }

    function matrix3d(scale, translate) {
        var k = scale / 256,
            r = scale % 1 ? Number : Math.round;
        return "matrix3d(" + [k, 0, 0, 0, 0, k, 0, 0, 0, 0, k, 0, r(translate[0] * scale), r(translate[1] * scale), 0, 1] + ")";
    }

    function prefixMatch(p) {
        var i = -1,
            n = p.length,
            s = document.body.style;
        while (++i < n)
            if (p[i] + "Transform" in s) return "-" + p[i].toLowerCase() + "-";
        return "";
    }

    function formatLocation(p, k) {
        var format = d3.format("." + Math.floor(Math.log(k) / 2 - 2) + "f");
        return (p[1] < 0 ? format(-p[1]) + "°S" : format(p[1]) + "°N") + " " + (p[0] < 0 ? format(-p[0]) + "°W" : format(p[0]) + "°E");
    }

}
