/**
 * @description Holds a position and rotation value
 */
class EnemyPosition {
    public point: Vector2;
    public rotation: number;
    constructor(_point: Vector2, _rotiation: number) {
        this.point = _point;
        this.rotation = _rotiation;
    }
}
/**
 * @description Contains all possible movement patterns an enemy can get
 */
class EnemyMovements {
    /**
     * @description Returns a pattern of movements by a given index
     * @param _index
     */
    public returnMovement(_index: number): Array<EnemyPosition> {
        switch (_index) {
            case 1:
                return this.setOne();
            case 2:
                return this.setTwo();
            case 3:
                return this.setThree();
            case 4:
                return this.setFour();
            case 5:
                return this.setFive();
            case 6:
                return this.setSix();
            case 7:
                return this.setSeven();
            case 8:
                return this.setEight();
            case 9:
                return this.setNine();
            case 10:
                return this.setTen();
        }

    }
    /**
     * @description Returns a movement pattern
     */
    private setOne(): Array<EnemyPosition> {
        let movement: Array<EnemyPosition> = new Array<EnemyPosition>();
        movement[0] = new EnemyPosition(new Vector2(382, 10), 0);
        movement[1] = new EnemyPosition(new Vector2(64, 454), 0);
        movement[2] = new EnemyPosition(new Vector2(448, 682), 0);
        movement[3] = new EnemyPosition(new Vector2(-52, 1000), 0);
        return movement;
    }
    /**
     * @description Returns a movement pattern
     */
    private setTwo(): Array<EnemyPosition> {
        let movement: Array<EnemyPosition> = new Array<EnemyPosition>();
        movement[0] = new EnemyPosition(new Vector2(128, 10), 0);
        movement[1] = new EnemyPosition(new Vector2(448, 454), 0);
        movement[2] = new EnemyPosition(new Vector2(64, 682), 0);
        movement[3] = new EnemyPosition(new Vector2(500, 1000), 0);
        return movement;
    }
    /**
     * @description Returns a movement pattern
     */
    private setThree(): Array<EnemyPosition> {
        let movement: Array<EnemyPosition> = new Array<EnemyPosition>();
        movement[0] = new EnemyPosition(new Vector2(448, 10), 0);
        movement[1] = new EnemyPosition(new Vector2(64, 303), 0);
        movement[2] = new EnemyPosition(new Vector2(448, 606), 0);
        movement[3] = new EnemyPosition(new Vector2(0, 1000), 0);
        return movement;
    }
    /**
     * @description Returns a movement pattern
     */
    private setFour(): Array<EnemyPosition> {
        let movement: Array<EnemyPosition> = new Array<EnemyPosition>();
        movement[0] = new EnemyPosition(new Vector2(-68, 626), 270);
        movement[1] = new EnemyPosition(new Vector2(572, 626), 270);
        return movement;
    }
    /**
     * @description Returns a movement pattern
     */
    private setFive(): Array<EnemyPosition> {
        let movement: Array<EnemyPosition> = new Array<EnemyPosition>();
        movement[0] = new EnemyPosition(new Vector2(572, 160), 90);
        movement[1] = new EnemyPosition(new Vector2(-68, 160), 90);
        return movement;
    }
    /**
     * @description Returns a movement pattern
     */
    private setSix(): Array<EnemyPosition> {
        let movement: Array<EnemyPosition> = new Array<EnemyPosition>();
        movement[0] = new EnemyPosition(new Vector2(192, 0), 0);
        movement[1] = new EnemyPosition(new Vector2(192, 450), 0);
        movement[2] = new EnemyPosition(new Vector2(64, 160), 0);
        movement[3] = new EnemyPosition(new Vector2(64, 1000), 0);
        return movement;
    }
    /**
     * @description Returns a movement pattern
     */
    private setSeven(): Array<EnemyPosition> {
        let movement: Array<EnemyPosition> = new Array<EnemyPosition>();
        movement[0] = new EnemyPosition(new Vector2(320, 0), 0);
        movement[1] = new EnemyPosition(new Vector2(320, 450), 0);
        movement[2] = new EnemyPosition(new Vector2(448, 160), 0);
        movement[3] = new EnemyPosition(new Vector2(448, 1000), 0);
        return movement;
    }
    /**
     * @description Returns a movement pattern
     */
    private setEight(): Array<EnemyPosition> {
        let movement: Array<EnemyPosition> = new Array<EnemyPosition>();
        movement[0] = new EnemyPosition(new Vector2(-68, 160), 270);
        movement[1] = new EnemyPosition(new Vector2(572, 160), 270);
        return movement;
    }
    /**
     * @description Returns a movement pattern
     */
    private setNine(): Array<EnemyPosition> {
        let movement: Array<EnemyPosition> = new Array<EnemyPosition>();
        movement[0] = new EnemyPosition(new Vector2(64, -64), 0);
        movement[1] = new EnemyPosition(new Vector2(448, 1000), 0);
        return movement;
    }
    /**
     * @description Returns a movement pattern
     */
    private setTen(): Array<EnemyPosition> {
        let movement: Array<EnemyPosition> = new Array<EnemyPosition>();
        movement[0] = new EnemyPosition(new Vector2(448, -64), 0);
        movement[1] = new EnemyPosition(new Vector2(64, 1000), 0);
        return movement;
    }
}