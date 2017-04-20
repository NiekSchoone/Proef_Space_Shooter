class Projectile extends Phaser.Sprite {

    public projectileType: ProjectileType;
    public vectorPosition: Vector2;
    public targets: Ship[];
    public projectileIndex: number;
    public active: boolean;

    public velocity: Vector2;
    public speed: number;

    private returnToPool: Function;

    constructor(_pos: Vector2, _tex: string, _toPool: Function) {
        super(game, _pos.X, _pos.Y);
        this.vectorPosition = _pos;
        this.loadTexture(_tex);
        this.returnToPool = _toPool;
    }

    public update() {
        if (this.active) {
            this.vectorPosition.add(this.velocity);
        }
        this.position.setTo(this.vectorPosition.X, this.vectorPosition.Y);
        this.checkCollision();
        this.checkBounds();
    }

    public fire(_pos: Vector2, _rotation: number) {
        let angleVelocity = game.physics.arcade.velocityFromAngle(this.angle - 90, this.speed);
        this.velocity = new Vector2(angleVelocity.x, angleVelocity.y);
        this.vectorPosition = _pos;
        this.angle = _rotation;
        this.active = true;
    }

    public setTarget(_targets: Ship[]) {
        for (let i = 0; i < _targets.length; i++) {
            this.targets.push(_targets[i]);
        }
    }

    private checkCollision() {
        if (this.targets != null) {
            for (let i = 0; i < this.targets.length; i++) {
                let distance = Vector2.distance(this.vectorPosition, this.targets[i].vectorPosition);

                if (distance < this.targets[i].collisionRadius) {
                    this.onHit(this.targets[i]);
                }
            }
        }
    }

    private checkBounds() {
        if (this.vectorPosition.Y < -20 || this.vectorPosition.Y > game.height + 20 || this.vectorPosition.X > game.width + 20 || this.vectorPosition.X < -20) {
            this.returnToPool(this);
        }
    }

    private onHit(_target: Ship) {
        _target.onHit(this.projectileType);
        this.returnToPool(this);
    }

    public resetValues() {
        this.active = false;
        this.vectorPosition = new Vector2(0, 0);
        this.velocity = new Vector2(0, 0);
        this.visible = false;
    }
}

enum ProjectileType {
    PLASMABULLET,
    MISSILE
}