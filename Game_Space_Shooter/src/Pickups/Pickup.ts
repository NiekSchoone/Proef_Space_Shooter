class Pickup {

    public position: Vector2;
    public velocity: Vector2;

    public player: Player;

    constructor(_x: number, _y: number) {
        this.position = new Vector2(_x, _y);
    }

    public onPickup() {

    }

}