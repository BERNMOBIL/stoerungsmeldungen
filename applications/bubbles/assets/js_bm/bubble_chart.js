d3.csv('assets/data/bm_bubbles.csv', display); // Daten laden
setupButtons(); // Button Setup

//* ------------------------------------------------------------------
//
// Teil 1 - Allgemeiner Code
//
// Initialisierungs-Code und Helfer-Funktionen um eine neue Bubble-Chart-Instanz zu 
// erstellen, um die Daten zu laden und um die Daten darzustellen
//
// -----------------------------------------------------------------*/

var myBubbleChart = bubbleChart();

/* Funktion display ruft die Bubble-Chart Funktion auf und stellt sie im #vis div dar. Wird nach dem laden der Daten aus dem CSV gecallt. */
function display(error, data) {
  if (error) {
    console.log(error);
  }
  myBubbleChart('#vis', data);
}

/* Setup der Layout Buttons damit zwischen den Ansichten getogglet werden kann */
function setupButtons() {
  d3.select('#toolbar')
    .selectAll('.button')
    .on('click', function () {
      d3.selectAll('.button').classed('active', false); // Remove active class from all buttons 
      var button = d3.select(this); // Find the button just clicked
      button.classed('active', true); // Set it as the active button
      var buttonId = button.attr('id'); // Get the id of the button
      myBubbleChart.toggleDisplay(buttonId); // Toggle the bubble chart based on the currently clicked button.
    });
}

/* Helper-Funktion zum konvertieren von Zahlen in einen String mit Kommas für schönere Darstellung */
function addCommas(nStr) {
  nStr += '';
  var x = nStr.split('.');
  var x1 = x[0];
  var x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }
  return x1 + x2;
}

//* ------------------------------------------------------------------
//
// Teil 2 - Funktion für die Erstellung der Bubble Chart
//
// -----------------------------------------------------------------*/

/* Funktion für die Erstellung der Bubble Chart. Returned eine Funktion, welche eine neue Bubble Chart erstellt, gegeben ein DOM-Element zur Darstellung und gegeben ein Datenset zur Visualisierung. */

function bubbleChart() {
  var width = 1030; // Konstanten für die Grösse
  var height = 600; // Konstanten für die Grösse
  var center = { x: width / 2, y: height / 2 };  // Locations to move bubbles towards, depending on which view mode is selected.

//* ------------------------------------------------------------------
//
// Teil 3 - Beschriftungen
//
// -----------------------------------------------------------------*/

// Störungen nach Linien
    
  var lineCenters = { // Center locations of the bubbles. 
    3: { x: 215, y: height / 2 },
    6: { x: 270, y: height / 2 },
    7: { x: 325, y: height / 2 },
    8: { x: 380, y: height / 2 },
    9: { x: 435, y: height / 2 },
    10: { x: 490, y: height / 2 },
    11: { x: 545, y: height / 2 },
    12: { x: 600, y: height / 2 },
    17: { x: 660, y: height / 2 },
    19: { x: 720, y: height / 2 },
    20: { x: 775, y: height / 2 },
    160: { x: 830, y: height / 2 }
  };

  var linesTitleX = {  // X locations of the year titles.
    '3': 48,
    '6': 130,
    '7': 227,
    '8': 313,
    '9': 400,
    '10': 500,
    '11': 583,
    '12': 658,
    '17': 732,
    '19': 802,
    '20': 898,
    '160': 988
  };
 
// Störungen nach Jahren
    
var yearCenters = { // Center locations of the bubbles.
    2014: { x: width / 3, y: height / 2 },
    2015: { x: width / 2, y: height / 2 },
    2016: { x: 2 * width / 3, y: height / 2 }
  };

  var yearsTitleX = { // X locations of the year titles.
    2014: 190,
    2015: width / 2,
    2016: width - 200,
  };

  var yearsTitleY = { // X locations of the year titles.
    2014: 65,
    2015: 65,
    2016: 65,
  };
    
// Störungen nach Störungsdauer/Bubble-Grösse

var durationCenters = { // Center locations of the bubbles.
    'verylow': { x: 250, y: height / 2 },
    'low': { x: 400, y: height / 2 },
    'medium': { x: 600, y: height / 2 },
    'high': { x: 750, y: height / 2 }
  };

  var durationTitleX = { // X locations of the year titles.
    'Kürzer als 30 Minuten': 100,
    '30 Minuten - 2 Stunden': 340,
    '2 Stunden - 12 Stunden': 620,
    'Länger als 12 Stunden': 870
  };
    
// Störungen nach Störungsart
    
  var typeCenters = { // Center locations of the bubbles. 
    Sonstige_Stoerungen: { x: 200, y: 325 },
    Verkehrsueberlastung: { x: 200, y: 275 },
    Fahrzeugpanne: { x: 300, y: 325 },
    Schneefall_Eis: { x: 300, y: 275 },
    Verkehrsunfall: { x: 400, y: 325 },
    Betriebsstoerung: { x: 400, y: 275 },
    Kundgebung_oder_Veranstaltung: { x: 500, y: 300 },
    Polizei_Feuerwehr_Sanitaet: { x: 600, y: 325 },
    Verspaetungen_Allgemein: { x: 600, y: 275 },
    Ersatzfahrten_und_Kursausfaelle: { x: 700, y: 325 },
    Verkehrsbehinderung: { x: 700, y: 275 },
    Bauarbeiten: { x: 800, y: 325 },
    Unregelmaessiger_Betrieb_und_Umleitungen: { x: 800, y: 275 },
  };

  var typeTitleX = {  // X locations of the year titles.
    'Sonstige Meldungen': 70,
    'Verkehrsüberlastung': 70,
    'Fahrzeugpanne':  220,
    'Schneefall': 220,
    'Verkehrsunfall': 340,
    'Betriebsstörung': 340,
    'Kundgebung oder Veranstaltung': 520,
    'Polizei oder Rettung': 710,
    'Verspätungen Allgemein': 740,
    'Ersatzfahrten und Kursausfälle': 810,
    'Bauarbeiten': 910,
    'Unregelmässiger Betrieb': 920,
    'Verkehrsbehinderung': 810
  };
 
  var typeTitleY = {  // Y locations of the year titles.
    'Sonstige Meldungen': 525,
    'Verkehrsüberlastung': 75,
    'Fahrzeugpanne':  525,
    'Schneefall': 75,
    'Verkehrsunfall': 525,
    'Betriebsstörung': 75,
    'Kundgebung oder Veranstaltung': 75,
    'Polizei oder Rettung': 525,
    'Verspätungen Allgemein': 75,
    'Ersatzfahrten und Kursausfälle': 490,
    'Bauarbeiten': 525,
    'Unregelmässiger Betrieb': 75,
    'Verkehrsbehinderung': 115
  };

// Störungen nach Wochentag
    
  var weekdayCenters = { // Center locations of the bubbles. 
    'Montag': { x: 200, y: height / 2 },
    'Dienstag': { x: 300, y: height / 2 },
    'Mittwoch': { x: 400, y: height / 2 },
    'Donnerstag': { x: 500, y: height / 2 },
    'Freitag': { x: 600, y: height / 2 },
    'Samstag': { x: 700, y: height / 2 },
    'Sonntag': { x: 800, y: height / 2 },
  };

  var weekdayTitleX = {  // X locations of the year titles.
    'Montag': 75,
    'Dienstag': 220,
    'Mittwoch': 340,
    'Donnerstag': 470,
    'Freitag': 600,
    'Samstag': 750,
    'Sonntag': 930,
  };
    
//* ------------------------------------------------------------------
//
// Teil 4 - Datenmanipulation (csv into JS)
//
// -----------------------------------------------------------------*/
    
// Used when setting up force and moving around nodes
  var damper = 0.102;

// These will be set in create_nodes and create_vis
  var svg = null;
  var bubbles = null;
  var nodes = [];

/* Charge function that is called for each node. Charge is proportional to the diameter of the circle (which is stored in the radius attribute of the circle's associated data. This is done to allow for accurate collision detection with nodes of different sizes. Charge is negative because we want nodes to repel. Dividing by 8 scales down the charge to be appropriate for the visualization dimensions. */
    
  function charge(d) {
    return -Math.pow(d.radius, 2.0) / 6;
  }

/* Here we create a force layout and configure it to use the charge function from above. This also sets some contants to specify how the force layout should behave. More configuration is done below. */
    
  var force = d3.layout.force()
    .size([width, height])
    .charge(charge)
    .gravity(-0.01)
    .friction(0.9);


  // Sizes bubbles based on their area instead of raw radius
  var radiusScale = d3.scale.pow()
    .exponent(0.5)
    .range([2, 75]);

/* This data manipulation function takes the raw data from the CSV file and converts it into an array of node objects. Each node will store data and visualization values to visualize a bubble. rawData is expected to be an array of data objects, read in from one of d3's loading functions like d3.csv. This function returns the new node array, with a node in that array for each element in the rawData input. */
    
  function createNodes(rawData) {
 
/* Use map() to convert raw data into node data. Checkout http://learnjsdata.com/ for more on working with data. */
      
    var myNodes = rawData.map(function (d) {
      return {
        id: d.id,
        radius: radiusScale(+d.dauer), // Berechnung Radius für bubbles
        value: d.dauer, // Ansicht nach Dauer
        group: d.kategorie, // Darstellung
        duration: d.kategorie, // Ansicht nach Störungsdauer
        line: d.linie,
        year: d.jahr,
        type: d.vorfall,
        datum: d.datum,  
        weekday: d.wochentag,
        meldung: d.meldung, 
        linienbez: d.linienbezeichnung,  
        vorfalltext: d. vorfall_text,
        x: Math.random() * 900,
        y: Math.random() * 800
      };
    });

    // sort them to prevent occlusion of smaller nodes.
    myNodes.sort(function (a, b) { return b.value - a.value; });

    return myNodes;
  }

/* Main entry point to the bubble chart. This function is returned by the parent closure. It prepares the rawData for visualization and adds an svg element to the provided selector and starts the visualization creation process. selector is expected to be a DOM element or CSS selector that points to the parent element of the bubble chart. Inside this element, the code will add the SVG continer for the visualization. rawData is expected to be an array of data objects as provided by a d3 loading function like d3.csv. */
    
  var chart = function chart(selector, rawData) {
    
/* Use the max duration in the data as the max in the scale's domain. note we have to ensure the duration is a number by converting it with `+`. */

    var maxAmount = d3.max(rawData, function (d) { return +d.dauer; });
    radiusScale.domain([0, maxAmount*50]);

    nodes = createNodes(rawData);
    // Set the force's nodes to our newly created nodes array.
    force.nodes(nodes);

/* Create a SVG element inside the provided selector with desired size. */
      
    svg = d3.select(selector)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Bind nodes data to what will become DOM elements to represent them.
    bubbles = svg.selectAll('.bubble')
      .data(nodes, function (d) { return d.id; });

    // Create new circle elements each with class `bubble`.
    // There will be one circle.bubble for each object in the nodes array.
    // Initially, their radius (r attribute) will be 0.
    bubbles.enter().append('circle')
      .classed('bubble', true)
      .attr('r', 0)
      .attr('fill', function (d) { return fillColor(d.type); })
      .attr('stroke', function (d) { return d3.rgb(fillColor(d.type)).darker(); })
      .attr('stroke-width', 2)
      .on('mouseover', showDetail)
      .on('mouseout', hideDetail);

    // Fancy transition to make bubbles appear, ending with the
    // correct radius
    bubbles.transition()
      .duration(2000)
      .attr('r', function (d) { return d.radius; });

    // initiales layout = single group.
    groupBubbles();
  };

//* ------------------------------------------------------------------
//
// Teil 5 - Initiale Ansicht, alle Störungen: "Single group mode"
//
// -----------------------------------------------------------------*/

/* Sets visualization in "single group mode". The other labels are hidden and the force layout tick function is set to move all nodes to the center of the visualization. */
    
  function groupBubbles() {
    hideLines();
    hideYears();
    hideDuration();
    hideType();
    hideWeekday();

    force.on('tick', function (e) {
      bubbles.each(moveToCenter(e.alpha))
        .attr('cx', function (d) { return d.x; })
        .attr('cy', function (d) { return d.y; });
    });

    force.start();
  }

/* Helfer-Funktion für den "single group mode". Returned eine Funktion, welche die Daten nimmt für einen Node und die Positionsdaten des Nodes so anpasst, dass er in die Mitte der Visualisierung geht.  

Die Positionierung basiert auf dem alpha Parameter des force layouts und wird kleiner, je länger das force layout läuft. Damit wird die bewegung der nodes verringert, je näher sie ihrem Ziel sind und erlaubt so anderen kräften wie der anziehungskraft der nodes auch die finale Positionen zu bestimmen. */
    
  function moveToCenter(alpha) {
    return function (d) {
      d.x = d.x + (center.x - d.x) * damper * alpha;
      d.y = d.y + (center.y - d.y) * damper * alpha;
    };
  }

//* ------------------------------------------------------------------
//
// Teil 6 - Störungen nach Linien
//
// -----------------------------------------------------------------*/
    
  function splitBubblesintoLines() {
    showLines();
    hideYears();
    hideDuration();
    hideType();
    hideWeekday();

    force.on('tick', function (e) {
      bubbles.each(moveToLines(e.alpha))
        .attr('cx', function (d) { return d.x; })
        .attr('cy', function (d) { return d.y; });
    });

    force.start();
  } 
    
  function moveToLines(alpha) {
    return function (d) {
      var target = lineCenters[d.line];
      d.x = d.x + (target.x - d.x) * damper * alpha * 1.1;
      d.y = d.y + (target.y - d.y) * damper * alpha * 1.1;
    };
  }
    
  function hideLines() {
    svg.selectAll('.line').remove();
  }

  function showLines() {
      
    var linesData = d3.keys(linesTitleX);
    var lines = svg.selectAll('.line')
      .data(linesData);

    lines.enter().append('text')
      .attr('class', 'line')
      .attr('x', function (d) { return linesTitleX[d]; })
      .attr('y', 65)
      .attr('text-anchor', 'middle')
      .text(function (d) { return d; });
  }

//* ------------------------------------------------------------------
//
// Teil 7 - Störungen nach Jahren
//
// -----------------------------------------------------------------*/
 
  function splitBubblesintoYears() {
    showYears();
    hideLines();
    hideDuration();
    hideType();
    hideWeekday();

    force.on('tick', function (e) {
      bubbles.each(moveToYears(e.alpha))
        .attr('cx', function (d) { return d.x; })
        .attr('cy', function (d) { return d.y; });
    });

    force.start();
  }
    
  function moveToYears(alpha) {
    return function (d) {
      var target = yearCenters[d.year];
      d.x = d.x + (target.x - d.x) * damper * alpha * 1.1;
      d.y = d.y + (target.y - d.y) * damper * alpha * 1.1;
    };
  }

  function hideYears() {
    svg.selectAll('.year').remove();
  }

  function showYears() {

    var yearsData = d3.keys(yearsTitleX);
    var years = svg.selectAll('.year')
      .data(yearsData);

    years.enter().append('text')
      .attr('class', 'year')
      .attr('x', function (d) { return yearsTitleX[d]; })
       .attr('y', function (d) { return yearsTitleY[d]; })
      .attr('text-anchor', 'middle')
      .text(function (d) { return d; });
  }

//* ------------------------------------------------------------------
//
// Teil 8 - Störungen nach Störungsdauer
//
// -----------------------------------------------------------------*/
 
  function splitBubblesintoDuration() {
    showDuration();
    hideYears();
    hideLines();
    hideType();
    hideWeekday();

    force.on('tick', function (e) {
      bubbles.each(moveToDuration(e.alpha))
        .attr('cx', function (d) { return d.x; })
        .attr('cy', function (d) { return d.y; });
    });

    force.start();
  }
    
  function moveToDuration(alpha) {
    return function (d) {
      var target = durationCenters[d.duration];
      d.x = d.x + (target.x - d.x) * damper * alpha * 1.1;
      d.y = d.y + (target.y - d.y) * damper * alpha * 1.1;
    };
  }

  function hideDuration() {
    svg.selectAll('.duration').remove();
  }

  function showDuration() {

    var durationData = d3.keys(durationTitleX);
    var duration = svg.selectAll('.duration')
      .data(durationData);

    duration.enter().append('text')
      .attr('class', 'duration')
      .attr('x', function (d) { return durationTitleX[d]; })
      .attr('y', 65)
      .attr('text-anchor', 'middle')
      .text(function (d) { return d; });
    }
  
//* ------------------------------------------------------------------
//
// Teil 9 - Störungen nach Störungsart
//
// -----------------------------------------------------------------*/
    
  function splitBubblesintoType() {
    showType();
    hideYears();
    hideLines();
    hideDuration();
    hideWeekday();

    force.on('tick', function (e) {
      bubbles.each(moveToType(e.alpha))
        .attr('cx', function (d) { return d.x; })
        .attr('cy', function (d) { return d.y; });
    });

    force.start();
  }
    
  function moveToType(alpha) {
    return function (d) {
      var target = typeCenters[d.type];
      d.x = d.x + (target.x - d.x) * damper * alpha * 1.1;
      d.y = d.y + (target.y - d.y) * damper * alpha * 1.1;
    };
  }

  function hideType() {
    svg.selectAll('.type').remove();
  }

  function showType() {
 
    var typeData = d3.keys(typeTitleX);
    var type = svg.selectAll('.type')
      .data(typeData);

    type.enter().append('text')
      .attr('class', 'type')
      .attr('x', function (d) { return typeTitleX[d]; })
      .attr('y', function (d) { return typeTitleY[d]; })
      .attr('text-anchor', 'middle')
      .text(function (d) { return d; });
    }

//* ------------------------------------------------------------------
//
// Teil 10 - Störungen nach Wochentag
//
// -----------------------------------------------------------------*/
    
  function splitBubblesintoWeekday() {
    showWeekday();
    hideType();
    hideYears();
    hideLines();
    hideDuration();

    force.on('tick', function (e) {
      bubbles.each(moveToWeekday(e.alpha))
        .attr('cx', function (d) { return d.x; })
        .attr('cy', function (d) { return d.y; });
    });

    force.start();
  }

  function moveToWeekday(alpha) {
    return function (d) {
      var target = weekdayCenters[d.weekday];
      d.x = d.x + (target.x - d.x) * damper * alpha * 1.1;
      d.y = d.y + (target.y - d.y) * damper * alpha * 1.1;
    };
  }

  function hideWeekday() {
    svg.selectAll('.weekday').remove();
  }

  function showWeekday() {

    var weekdayData = d3.keys(weekdayTitleX);
    var type = svg.selectAll('.weekday')
      .data(weekdayData);

    type.enter().append('text')
      .attr('class', 'weekday')
      .attr('x', function (d) { return weekdayTitleX[d]; })
      .attr('y', 65)
      .attr('text-anchor', 'middle')
      .text(function (d) { return d; });
    }

//* ------------------------------------------------------------------
//
// Teil 11 - Wechseln zwischen den Ansichten
//
// -----------------------------------------------------------------*/
    
  /* Externally accessible function (this is attached to the returned chart function). Allows the visualization to toggle between "single group" and "split by ..." modes. */

  chart.toggleDisplay = function (displayName) {
    if (displayName === 'line') {
      splitBubblesintoLines();
    } else if (displayName === 'year') {
      splitBubblesintoYears();
    } else if (displayName === 'duration') {
      splitBubblesintoDuration();
    } else if (displayName === 'type') {
      splitBubblesintoType();
    } else if (displayName === 'weekday') {
      splitBubblesintoWeekday();
    } else {
      groupBubbles();
    }
  };

  chart.toggleDisplay2 = function (displayName2) {
    if (displayName === 'line') {
      splitBubblesintoLines();
    } else {
      groupBubbles();
    }
  };
    
  return chart;
}

// Ende der Funktion

//* ------------------------------------------------------------------
//
// Teil 12 - Tooltip
//
// -----------------------------------------------------------------*/

  // Tooltip für Mousover
  var tooltip2 = floatingtooltip2('gates_tooltip2', 240);

  var fillColor = d3.scale.ordinal()
    .domain(['Sonstige_Stoerungen', 'Verkehrsueberlastung', 'Fahrzeugpanne', 'Schneefall_Eis', 'Verkehrsunfall', 'Betriebsstoerung', 'Kundgebung_oder_Veranstaltung', 'Polizei_Feuerwehr_Sanitaet:', 'Verspaetungen_Allgemein','Ersatzfahrten_und_Kursausfaelle', 'Verkehrsbehinderung', 'Bauarbeiten', 'Unregelmaessiger_Betrieb_und_Umleitungen'])
    .range(['#03A9F4', '#FF5722', '#727272', '#4CAF50', '#FFEB3B', '#303F9F', '#CD003C', '#8BC34A', '#795548', '#FFC107', '#87925d', '#42325d', '#CDDC39', '#9C27B0']);

  /* Tooltip-Funktion*/
  function showDetail(d) {

    d3.select(this).attr('stroke', 'black');

    var content = '<span class="name">Störungsart: </span><span class="value">' +
                  d.vorfalltext +
                  '</span><br/>' +
                  '<span class="name">Datum: </span><span class="value">' +
                  d.datum +
                  '</span><br/>' +
                  '<span class="name">Linie: </span><span class="value">' +
                  d.line +
                  '</span><br/>' +
                  '<span class="name">Linienbezeichnung: </span><span class="value">' +
                  d.linienbez +
                  '</span><br/>' +
                  '<span class="name">Jahr: </span><span class="value">' +
                  d.year +
                  '</span><br/>' +
                  '<span class="name">Dauer: </span><span class="value">' +
                  d.value +' Minuten' +
                  '</span><br/>' +
                  '<span class="name">Meldung: </span><span class="value">' +
                  d.meldung +
                  '</span>';
    tooltip2.showtooltip2(content, d3.event);
  }

  function hideDetail(d) { // tooltip verstecken

    d3.select(this)
      .attr('stroke', d3.rgb(fillColor(d.type)).darker());

    tooltip2.hidetooltip2();
  }

//* ------------------------------------------------------------------
//
// The End
//
// -----------------------------------------------------------------*/