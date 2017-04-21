var MovementPatterns = (function () {
    function MovementPatterns() {
        this.pattern01 = new Array();
        var point0 = new Vector2(200, -20);
        this.pattern01.push(point0);
        var point1 = new Vector2(200, 1000);
        this.pattern01.push(point1);
    }
    return MovementPatterns;
}());
