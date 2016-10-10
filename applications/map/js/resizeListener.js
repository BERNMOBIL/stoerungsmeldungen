$(window).resize(function () {
    onMapResize()
});

var lastResize = new Date();
function onMapResize() {
    // the map should only be reloaded every second and not more often
    var currentTime = new Date();
    var reloadInterval = 1000;
    var difference = currentTime - lastResize;
    if (difference > reloadInterval) {
        drawMap();
        lastResize = currentTime;
    }
}