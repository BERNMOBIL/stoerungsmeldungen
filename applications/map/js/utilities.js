//performs a left-hand-side padding with zeroes on given number to extend it to
//given trargetLength. i.e. leftPad(42, 5) --> 00042
function leftPad(number, targetLength) {
    var output = number + '';
    while (output.length < targetLength) {
        output = '0' + output;
    }
    return output;
}

function getEventCategories(){
    return ['Schneefall, Eis', 'Fahrzeugpanne', 'Verkehrsunfall',
        'Verkehrsüberlastung', 'Betriebsstörung', 'Bauarbeiten',
        'Polizei, Feuerwehr, Sanität',
        'Kundgebung, Veranstaltung',
        'Verspätungen Allgemein',
        'Verkehrsbehinderungen',
        'Unregelmässiger Betrieb und Umleitungen',
        'Ersatzfahrten und Kursausfälle'];
}

function getAllMonths(){
    return ["Januar", "Februar", "März", "April", "Mai",
        "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
}