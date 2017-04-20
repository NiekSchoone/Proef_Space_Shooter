class MovementPatterns
{
    public pattern01: Vector2[];
    constructor() {
        this.pattern01 = new Array<Vector2>();
        let point0: Vector2 = new Vector2(200, -20);
        this.pattern01.push(point0);
        let point1: Vector2 = new Vector2(200, 1000);
        this.pattern01.push(point1);
    }
}