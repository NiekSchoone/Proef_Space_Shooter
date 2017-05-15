class Projectile extends Phaser.Sprite {

    public projectileType: ProjectileType;
    public vectorPosition: Vector2;
    public projectileIndex: number;
    public active: boolean;
    public damageAmount: number;

    protected velocity: Vector2;
    protected targets: Array<Ship>;
    protected speed: number;
    protected returnToPool: Function; //Callback function to return this to the projectile pool it belongs to

    protected hitAnimation: Phaser.Sprite;

    constructor(_tex: string, _toPool: Function, _hitAnim?: string) {
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
            game.add.existing(this.hitAnimation);
        }
    }

    public update() {
        if (this.active) {
            this.vectorPosition.add(this.velocity);
            this.position.setTo(this.vectorPosition.X, this.vectorPosition.Y);
            this.checkCollision();
            this.checkBounds();
        }
    }

    // Fires a bullet from a given position and angle
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

    // Set targets this projectile can hit
    public setTarget(_targets: Array<Ship>) {
        this.targets = _targets;
    }

    // Checks each posible hit target
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

    // Check if the position of this projectile is out of the bounds of the level
    protected checkBounds() {
        if (this.vectorPosition.Y <= -20 || this.vectorPosition.Y >= game.height + 20 || this.vectorPosition.X >= game.width + 20 || this.vectorPosition.X <= -20) {
            this.returnToPool(this);
        }
    }

    // On hitting a target the projectile will return to the pool and apply damage on the target
    protected onHit(_target: Ship) {
        if (this.hitAnimation != null) {
            this.hitAnimation.position.setTo(this.vectorPosition.X, this.vectorPosition.Y);
            this.hitAnimation.angle = Math.floor(Math.random() * (359) + 1);
            this.hitAnimation.play("onHit", 24, false);
        }
        _target.onHit(this.damageAmount);
        this.returnToPool(this);
    }

    // Reset the values of this projectile to their default values
    public resetValues() {
        this.active = false;
        this.visible = false;
        this.targets = new Array<Ship>();
        this.vectorPosition = new Vector2(-100, -100);
        this.velocity = new Vector2(0, 0);
        this.animations.stop();
        this.animations.frame = 0;
    }
}

enum ProjectileType {
    PLASMABULLET,
    MISSILE
}