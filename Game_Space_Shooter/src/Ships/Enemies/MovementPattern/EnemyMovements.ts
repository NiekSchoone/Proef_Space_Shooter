class EnemyMovements {
    returnMovement(_index: number): Array<Vector2> {
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

    private setOne(): Array<Vector2> {
        let movement: Array<Vector2> = new Array<Vector2>();
        movement[0] = new Vector2(64,400);
        movement[1] = new Vector2(448,1000);
        return movement;
    }
    private setTwo(): Array<Vector2> {
        let movement: Array<Vector2> = new Array<Vector2>();
        movement[0] = new Vector2(448, 400);
        movement[1] = new Vector2(64, 1000);
        return movement;
    }
    private setThree(): Array<Vector2> {
        let movement: Array<Vector2> = new Array<Vector2>();
        movement[0] = new Vector2(256, 400);
        movement[1] = new Vector2(64, 100);
        movement[2] = new Vector2(64, 1000);
        return movement;
    }
    private setFour(): Array<Vector2> {
        let movement: Array<Vector2> = new Array<Vector2>();
        movement[0] = new Vector2(256, 400);
        movement[1] = new Vector2(448, 100);
        movement[2] = new Vector2(448, 1000);
        return movement;
    }
}