class Pickup extends Phaser.Sprite {

    public pickupType: PickupType;
    public vectorPosition: Vector2;
    public velocity: Vector2;

    public player: Player;

    constructor(_player: Player, _x: number, _y: number, _type: PickupType) {
        super(game, _x, _y);
        this.player = _player;
        this.vectorPosition = new Vector2(_x, _y);
        this.velocity = new Vector2(0, 1);
    }

    public update() {
        this.vectorPosition.add(this.velocity);
        this.position.setTo(this.vectorPosition.X, this.vectorPosition.Y);

        this.checkCollision();
        this.checkBounds();
    }

    private onHit() {
        this.player.handlePickup(this.pickupType);
        this.destroy();
    }

    private checkBounds() {
        if (this.vectorPosition.Y < -20 || this.vectorPosition.Y > game.height + 20 || this.vectorPosition.X > game.width + 20 || this.vectorPosition.X < -20) {
            this.destroy();
        }
    }

    private checkCollision() {
        let distance = Vector2.distance(this.vectorPosition, this.player.vectorPosition);

        if (distance < this.player.collisionRadius) {
            this.onHit();
        }
    }
}

enum PickupType {
    REPAIR,
    UPGRADEMISSILE,
    UPGRADEPLASMA
}