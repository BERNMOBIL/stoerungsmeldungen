
//loads raw data from server and sends it to transformLoadedRawData()
function transformRawData(callback) {
    $.getJSON('../data/rawData.json', '', function (data) {
        transformLoadedRawData(callback, data);
    })
}

/*
    For each raw data element, creates an empty BernmobilEvent and fills it with
    data from raw data element. All BernmobilEvents are collected in the transformedData array.
    After transformation, transformedData is converted to a JSON string and sent to saveFile.php
    via POST-request. The callback function receives a success message (if POST was successful).
 */
function transformLoadedRawData(callback, data) {
    var transformedData = _.map(data, function (element) {
        var newEvent = new BernmobilEvent();

        newEvent.startDate = parseDate(element["Start Ereigniszeitpunkt"]);
        newEvent.endDate = parseDate(element["Ende Ereigniszeitpunkt"]);
        newEvent.course = element["Linien"];
        newEvent.stop = element["Haltestelle"];
        newEvent.longText = element["Lange Meldung"];
        newEvent.shortText = element["Kurze Meldung"];
        newEvent.planned = wasPlanned(newEvent.shortText);
        newEvent.incident = getIncidentFromShortText(newEvent.shortText);

        return newEvent;
    });

    //perform a POST-request to pass transformed data on to saveFile.php
    $.post('saveFile.php', {data: JSON.stringify(transformedData)}, function(){
        callback("Daten erfolgreich exportiert.");
    });
}

/*
    Parses dateString into machine-readable date format. If dataString doesn't match
    d[d].m[m].y[y][y][y] h[h]:m[m], will return current system date and time. Months are
    0-based, numbers are not padded.
*/

function parseDate(dateString) {
    var result = new Date();
    var parts = dateString.split(' '); //split into day and time

    if (parts.length != 2) {
        return result;
    }

    var day = parts[0];
    var time = parts[1];

    var dayParts = day.split('.');
    var timeParts = time.split(':');

    if (dayParts.length != 3 || timeParts.length != 2) {
        return result;
    }

    // months are 0-based
    result = new Date(dayParts[2], dayParts[1] - 1, dayParts[0], timeParts[0], timeParts[1]).getTime();
    return result;
}

function wasPlanned(shortText){
    var firstChar = shortText.charAt(0);
    return !isNaN(parseInt(firstChar));
}

function getIncidentFromShortText(shortText){
    var mappings = getIncidentKeyWordMappings();
    var mappingKeys = _.keys(mappings);

    for(var i = 0; i < mappingKeys.length; i++){
        var key = mappingKeys[i];

        if(shortText.toLowerCase().indexOf(key.toLowerCase()) > -1){
            return mappings[key];
        }
    }
    return 'Sonstige Störungen';
}

function getIncidentKeyWordMappings() {
    var categories = getEventCategories();

    var keyWords = {
        'schnee': categories[0], 'vereist': categories[0], 'glatteis': categories[0],
        'Panne': categories[1],
        'Unfall': categories[2],
        'überlastung': categories[3],
        'Betriebsstörung': categories[4],
        'Bauarbeiten': categories[5], 'belags': categories[5], 'Baustelle': categories[5],
        'Feuerwehr': categories[6], 'Rettung': categories[6],
        'veranst': categories[7], 'Fasnacht': categories[7],
        'Museumsnacht': categories[7], 'kundg': categories[7], 'Lichtshow': categories[7],
        'Grand Prix': categories[7], 'Zibelemärit': categories[7], 'Frauenlauf': categories[7],
        'Tour de Suisse': categories[7],
        'Verspätung': categories[8],
        'behinderung': categories[9], 'Sperrung': categories[9], 'parkiert': categories[9],
        'unregelmässig': categories[10], 'umgel': categories[10],
        'Busersatz': categories[11], 'Tramersatz': categories[11], 'Kursausf': categories[11],
        'nicht bedient': categories[11]
    };

    return keyWords;
}