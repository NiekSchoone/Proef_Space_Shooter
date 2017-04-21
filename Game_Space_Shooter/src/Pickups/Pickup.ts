class Pickup extends Phaser.Sprite {

    public pickupType: PickupType;
    public vectorPosition: Vector2;
    public velocity: Vector2;

    public player: Player;

    constructor(_x: number, _y: number, _type: PickupType) {
        super(game, _x, _y);
        this.vectorPosition = new Vector2(_x, _y);
    }

    public onPickup() {

    }

    public update() {

    }
}

enum PickupType {
    REPAIR,
    UPGRADEMISSILE,
    UPGRADEPLASMA
}