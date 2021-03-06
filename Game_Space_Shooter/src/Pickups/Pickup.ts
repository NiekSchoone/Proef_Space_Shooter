﻿/**
 * @description Sprite containing functionality of a pickup
 */
class Pickup extends Phaser.Sprite {

    private pickupType: PickupType;
    private vectorPosition: Vector2;
    private velocity: Vector2;
    private player: Player;
    private speed: number;

    constructor(_player: Player, _position: Vector2, _type: PickupType) {
        super(game, _position.X, _position.Y);
        this.player = _player;
        this.vectorPosition = _position;
        this.velocity = new Vector2(0, 1);
        this.speed = 0;
        this.pickupType = _type;
        this.anchor.set(0.5);
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
    /**
     * @description Executes every frame
     */
    public update() {
        if (this.speed < 5) {
            this.speed += 0.04;
        }
        this.vectorPosition.add(new Vector2(this.velocity.X * this.speed, this.velocity.Y * this.speed));
        this.position.setTo(this.vectorPosition.X, this.vectorPosition.Y);

        this.checkCollision();
        this.checkBounds();
    }
    /**
     * @description Executes when collision is made with the player
     */
    private onHit() {
        this.player.handlePickup(this.pickupType);
        this.destroy();
    }
    /**
     * @description Checks if the position of this pickup is outside of the level's bounds
     */
    private checkBounds() {
        if (this.vectorPosition.Y < -20 || this.vectorPosition.Y > game.height + 20 || this.vectorPosition.X > game.width + 20 || this.vectorPosition.X < -20) {
            this.destroy();
        }
    }
    /**
     * @description Check if the pickup collides with the player's bounds
     */
    private checkCollision() {
        let distance = Vector2.distance(this.vectorPosition, this.player.vectorPosition);

        if (distance < this.player.collisionRadius) {
            this.onHit();
        }
    }
}
/**
 * @description All possible types of pickup
 */
enum PickupType {
    REPAIR,
    UPGRADEMISSILE,
    UPGRADEPLASMA
}