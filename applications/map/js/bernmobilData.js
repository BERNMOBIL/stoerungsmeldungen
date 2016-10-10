function loadBernmobilData(callback){
    d3.json('data/data.json', function (data) {

        var events = _.map(data, function (element) {
            return new BernmobilEvent(element);
        });

        callback(events);
    });
}

function filterDataByMonths(unfilteredData, months){
    return _.filter(unfilteredData, function (evt) {
        return months.indexOf(evt.month()) > -1;
    });
}

function filterDataByCategories(unfilteredData, categories){
    return _.filter(unfilteredData, function(evt){
        return categories.indexOf(evt.incident) > -1;
    })
}

function prepareDataByCourse(originalData) {
    var data = d3.nest()
        .key(function (evt) {
            return evt.course;
        })
        .rollup(function (events){
            var count = events.length;
            var totalDuration = _.reduce(events, function(runningSum, event){
                return runningSum + event.durationInMinutes();
            }, 0);
            var averageDuration = Math.ceil(totalDuration / count);
            return {count: count, totalDuration: totalDuration, averageDuration: averageDuration};
        })
        .entries(originalData);
    return _.map(data, function(dataElement){
        var values = dataElement.values;
        return {course: dataElement.key, count: values.count, totalDuration: values.totalDuration, averageDuration: values.averageDuration};
    });
}
