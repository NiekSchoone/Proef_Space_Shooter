class Pickup extends Phaser.Sprite {

    private pickupType: PickupType;
    private vectorPosition: Vector2;
    private velocity: Vector2;
    private player: Player;

    constructor(_player: Player, _position: Vector2, _type: PickupType) {
        super(game, _position.X, _position.Y);
        this.player = _player;
        this.vectorPosition = _position;
        this.velocity = new Vector2(0, 0);
        this.pickupType = _type;
        switch (_type) {
            case PickupType.REPAIR:
                this.loadTexture("pickup_repair");
                break;
            case PickupType.UPGRADEPLASMA:
                this.loadTexture("pickup_plasma");
                break;
            case PickupType.UPGRADEMISSILE:
                this.loadTexture("pickup_missile");
                break;
        }
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