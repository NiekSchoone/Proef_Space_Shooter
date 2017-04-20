class MovementPatterns
{
    public pattern01: Vector2[];
    constructor() {
        this.pattern01 = new Array<Vector2>();
        let point0: Vector2 = new Vector2(200, -20);
        this.pattern01.push(point0);
        let point1: Vector2 = new Vector2(200, 0);
        this.pattern01.push(point1);
        let point2: Vector2 = new Vector2(200, 200);
        this.pattern01.push(point2);
        let point3: Vector2 = new Vector2(200, 400);
        this.pattern01.push(point3);
        let point4: Vector2 = new Vector2(200, 600);
        this.pattern01.push(point4);
        let point5: Vector2 = new Vector2(200, 1000);
        this.pattern01.push(point5);
    }
}