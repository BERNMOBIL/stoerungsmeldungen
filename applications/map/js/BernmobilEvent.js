
//returns a new Bernmobil event from given objectFromJson
function BernmobilEvent(objectFromJson){

    //if passed JSON is undefined, create a default one.
    //otherwise, merge passed JSON's contents into this object
    //note: objectFromJson is a single object from data.json
    if(objectFromJson == undefined){
        this.incident = "";
        this.planned = false;
        this.startDate = 0;
        this.endDate = 0;
        this.course = "";
        this.stop = "";
        this.longText = "";

        this.shortText = "";
    }else{
        $.extend(this, objectFromJson);
    }

    //returns a well-formatted date-string for given time
    this.formatDate = function (time){
        var date = new Date(time);

        var year = date.getFullYear();
        // months are 0-indexed
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minutes = date.getMinutes();

        return day + "." + month + "." + year + ", " + leftPad(hour, 2) + ":" + leftPad(minutes, 2);
    };

    //calculated and returns event duration from start- and end-date
    this.durationInMinutes = function () {return Math.floor(Math.abs(this.endDate - this.startDate) / 60000)};

    //well-formtated start-date-string
    this.startDateFormatted = function () {
        return this.formatDate(this.startDate);
    };

    //well-formatted end-date-string
    this.endDateFormatted = function (){
        return this.formatDate(this.endDate);
    };


    //translates this event's 0-indexed weekday-number to corresponding weekday-name
    this.weekday = function() {
        var days = ["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"];
        var date = new Date(this.startDate);

        return days[date.getDay()];
    };

    this.month = function() {
        var months = getAllMonths();
        var date = new Date(this.startDate);

        return months[date.getMonth()];
    };

    /*
      General note: properties are set and functions added to this object using the "this" keyword, because everthing
      is happening inside a function. Inside a function, "this" refers to the "owner" of that function
      (in this case, this instance of BernmobilEvent). Without "this", added functions and properties would only be visible
      within the containing function BernmobilEvent().
     */

}