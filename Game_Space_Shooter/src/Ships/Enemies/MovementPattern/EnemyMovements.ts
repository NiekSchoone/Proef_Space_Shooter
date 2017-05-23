class EnemyPosition {
    public point: Vector2;
    public rotation: number;
    constructor(_point: Vector2, _rotiation: number) {
        this.point = _point;
        this.rotation = _rotiation;
    }
}
class EnemyMovements {
    returnMovement(_index: number): Array<EnemyPosition> {
        switch (_index) {
            case 1:
                return this.setOne();
            case 2:
                return this.setTwo();
            case 3:
                return this.setThree();
            case 4:
                return this.setFour();
        }

    }

    private setOne(): Array<EnemyPosition> {
        let movement: Array<EnemyPosition> = new Array<EnemyPosition>();
        movement[0] = new EnemyPosition(new Vector2( 64, 400),180);
        movement[1] = new EnemyPosition(new Vector2(448,1000),180);
        return movement;
    }
    private setTwo(): Array<EnemyPosition> {
        let movement: Array<EnemyPosition> = new Array<EnemyPosition>();
        movement[0] = new EnemyPosition(new Vector2(448, 400),180);
        movement[1] = new EnemyPosition(new Vector2(64, 1000),180);
        return movement;
    }
    private setThree(): Array<EnemyPosition> {
        let movement: Array<EnemyPosition> = new Array<EnemyPosition>();
        movement[0] = new EnemyPosition(new Vector2(256, 400),180);
        movement[1] = new EnemyPosition(new Vector2(64, 100),180);
        movement[2] = new EnemyPosition(new Vector2(64, 1000),180);
        return movement;
    }
    private setFour(): Array<EnemyPosition> {
        let movement: Array<EnemyPosition> = new Array<EnemyPosition>();
        movement[0] = new EnemyPosition(new Vector2(256, 400),180);
        movement[1] = new EnemyPosition(new Vector2(448, 100),180);
        movement[2] = new EnemyPosition(new Vector2(448, 1000),180);
        return movement;
    }
}