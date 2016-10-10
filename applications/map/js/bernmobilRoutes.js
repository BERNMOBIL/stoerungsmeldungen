function loadBernmobilFeatures(callback) {
    d3.json("data/bernmobil_routes.geojson", function (json) {
        callback(json);
    });
}

/* Filters the bernmobil features so only routes remain (no stops) */
function getRoutes(features) {
    return _.filter(features, function (feature) {
       return !roleOfFeaturesIs(feature, 'stop');
    });
}

/* Filters the bernmobil features so only stops remain */
function getStops(features){
    return _.filter(features, function (feature) {
        return roleOfFeaturesIs(feature, 'stop');
    });
}

function roleOfFeaturesIs(feature, role){
    var actualRole = feature.properties['@relations'][0]['role'];
    return role == actualRole;
}

function getCourseOfFeature(feature){
    var course = feature.properties['@relations'][0]['reltags']['ref'];
    if(course == undefined){
        return undefined;
    }else if(course.indexOf("/") > -1){
        return course.substr(0, 1);
    }else{
        return course;
    }
}

function attachBernmobilDataToRoutes(dataByCourse, routes){
    _.each(routes, function (feature) {
        feature.course = getCourseOfFeature(feature);
        if(feature.course == undefined){
            feature.course = "";
            feature.incidentCount = 0;
            feature.totalDuration = 0;
            feature.averageDuration = 0;
            return;
        }
        var incidentData = _.findWhere(dataByCourse, {course: feature.course});
        if (incidentData == undefined) {
            feature.incidentCount = 0;
            feature.totalDuration = 0;
            feature.averageDuration = 0;
        } else {
            feature.incidentCount = incidentData.count;
            feature.totalDuration = incidentData.totalDuration;
            feature.averageDuration = incidentData.averageDuration;
        }
    });

    // normalize incident count
    var max = _.max(routes, function (route) {
        return route.incidentCount
    });
    max = max.incidentCount;
    var min = _.min(routes, function (route) {
        return route.incidentCount
    });
    min = min.incidentCount;
    _.each(routes, function (feature) {
        if(min == max){
            feature.incidentCountNormalized = 0;
        }else{
            feature.incidentCountNormalized = (feature.incidentCount - min) / (max - min);
        }
    });
}
