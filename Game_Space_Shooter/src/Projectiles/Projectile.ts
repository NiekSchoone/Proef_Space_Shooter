class Projectile {

    public projectileType: ProjectileType;
    public texture: Phaser.Sprite;
    public position: Vector2;
    public velocity: Vector2;
    public targets: Ship[];

    private returnToPool: Function;

    public projectileIndex: number;

    constructor(_pos: Vector2, _vel: Vector2, _toPool: Function) {
        this.position = _pos;
        this.velocity = _vel;
        this.returnToPool = _toPool;
    }

    public update() {
        this.checkCollision();
    }

    public checkCollision() {
        if (this.targets != null) {
            for (let i = 0; i < this.targets.length; i++) {
                let distance = Vector2.distance(this.position, this.targets[i].pos);

                if (distance < this.targets[i].collisionRadius) {
                    this.onHit(this.targets[i]);
                }
            }
        }
    }

    public onHit(_target: Ship) {
        _target.onHit(this.projectileType);
        this.returnToPool(this);
    }

    public setTarget(_targets: Ship[]) {
        for (let i = 0; i < _targets.length; i++) {
            this.targets.push(_targets[i]);
        }
    }
}

enum ProjectileType {
    PLASMABULLET,
    MISSILE
}