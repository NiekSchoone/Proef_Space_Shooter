﻿/**
 * @description Sprite that has the functionality of a projectile
 */
class Projectile extends Phaser.Sprite {

    public projectileType: ProjectileType;
    public vectorPosition: Vector2;
    public active: boolean;
    public damageAmount: number;

    protected velocity: Vector2;
    protected targets: Array<Ship>;
    protected speed: number;
    protected returnToPool: Function; //Callback function to return this to the projectile pool it belongs to
    
    protected hitAnimation: Phaser.Sprite;
    protected randomHitRotation: boolean;

    constructor(_toPool: Function, _tex?: string, _hitAnim?: string, _randomHitRotation?: boolean) {
        super(game, -100, -100);
        this.vectorPosition = new Vector2(-100, -100);
        this.loadTexture(_tex);
        this.returnToPool = _toPool;
        this.anchor.set(0.5);
        this.targets = new Array<Ship>();

        if (_hitAnim != null) {
            this.hitAnimation = new Phaser.Sprite(game, -100, -100, _hitAnim);
            this.hitAnimation.animations.add("onHit");
            this.hitAnimation.anchor.set(0.5);
            this.randomHitRotation = _randomHitRotation;
            game.add.existing(this.hitAnimation);
        }
    }
    /**
     * @description Executes every frame
     */
    public update() {
        if (this.active) {
            this.vectorPosition.add(this.velocity);
            this.position.setTo(this.vectorPosition.X, this.vectorPosition.Y);
            this.checkCollision();
            this.checkBounds();
        }
    }
    /**
     * @description Fires a projectile from a given position and angle
     * @param _pos
     * @param _rotation
     */
    public fire(_pos: Vector2, _rotation: number) {
        this.angle = _rotation;
        let angleVelocity = game.physics.arcade.velocityFromAngle(this.angle - 90, this.speed);
        this.velocity = new Vector2(angleVelocity.x, angleVelocity.y);
        this.vectorPosition = _pos;
        this.active = true;

        if (this.animations != null) {
            this.animations.play(this.key as string);
        }
    }
    /**
     * @description Set the targets that this projectile can hit
     * @param _targets
     */
    public setTarget(_targets: Array<Ship>) {
        this.targets = _targets;
    }
    /**
     * @description Check if collision is made with any targets
     */
    protected checkCollision() {
        if (this.targets != null) {
            for (let i = 0; i < this.targets.length; i++) {
                let distance = Vector2.distance(this.vectorPosition, this.targets[i].vectorPosition);

                if (distance <= this.targets[i].collisionRadius) {
                    this.onHit(this.targets[i]);
                }
            }
        }
    }
    /**
     * @description Check if the position of a projectile is outside of the level's bounds
     */
    protected checkBounds() {
        if (this.vectorPosition.Y <= -20 || this.vectorPosition.Y >= game.height + 20 || this.vectorPosition.X >= game.width + 20 || this.vectorPosition.X <= -20) {
            this.returnToPool(this);
        }
    }
    /**
     * @description Handles what happens when a projectile hits a given target
     * @param _target
     */
    protected onHit(_target: Ship) {
        if (this.hitAnimation != null) {
            if (this.randomHitRotation) {
                this.hitAnimation.angle = Math.floor(Math.random() * (359) + 1);
            } else {
                this.hitAnimation.angle = this.angle;
            }
            this.hitAnimation.position.setTo(this.vectorPosition.X, this.vectorPosition.Y);
            this.hitAnimation.play("onHit", 24, false);
        }
        _target.onHit(this.damageAmount);
        this.returnToPool(this);
    }
    /**
     * @description Reset the values of a projectile to its default values
     */
    public resetValues() {
        this.active = false;
        this.visible = false;
        this.vectorPosition = new Vector2(-100, -100);
        this.velocity = new Vector2(0, 0);
        this.animations.stop();
        this.animations.frame = 0;
    }
}
/**
 * @description All possible types of projectiles
 */
enum ProjectileType {
    PLASMABULLET,
    MISSILE
}