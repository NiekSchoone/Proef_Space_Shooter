class EnemyMovements {
    public pattern01: Vector2[];
    public pattern02: Vector2[];
    public pattern03: Vector2[];
    public pattern04: Vector2[];
    public pattern05: Vector2[];

    constructor() {
        this.pattern01 = new Array<Vector2>();
        let point0: Vector2 = new Vector2(200, 200);
        this.pattern01.push(point0);
        let point1: Vector2 = new Vector2(1000, 1000);
        this.pattern01.push(point1);

        this.pattern02 = new Array<Vector2>();
        let point2: Vector2 = new Vector2(400, -20);
        this.pattern02.push(point2);
        let point3: Vector2 = new Vector2(400, 1000);
        this.pattern02.push(point3);

        this.pattern03 = new Array<Vector2>();
        let point4: Vector2 = new Vector2(200, -20);
        this.pattern03.push(point4);
        let point5: Vector2 = new Vector2(300, 1000);
        this.pattern03.push(point5);

        this.pattern04 = new Array<Vector2>();
        let point6: Vector2 = new Vector2(300, -20);
        this.pattern04.push(point6);
        let point7: Vector2 = new Vector2(300, 1000);
        this.pattern04.push(point7);

        this.pattern05 = new Array<Vector2>();
        let point8: Vector2 = new Vector2(200, -20);
        this.pattern05.push(point8);
        let point9: Vector2 = new Vector2(250, 1000);
        this.pattern05.push(point9);
    }
    getMovements(index: number): Array<Vector2> {

        return new Array<Vector2>();
    }
}