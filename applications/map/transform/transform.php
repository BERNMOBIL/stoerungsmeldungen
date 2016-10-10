<!DOCTYPE html>
<html lang="en">
<head>
    <script src="//code.jquery.com/jquery-1.12.0.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script>
    <script src="transformRawData.js"></script>
    <script src="/applications/map/js/BernmobilEvent.js"></script>
    <script src="/applications/map/js/utilities.js"></script>
    <meta charset="UTF-8">
    <title>Transformed data</title>
</head>
<body>
<div id="dataElement"></div>
<script>
    //start transformation using transformRawData.js. pass callback function to display messages here.
    transformRawData(function(message) {$("#dataElement").html(message)});
</script>
</body>
</html>