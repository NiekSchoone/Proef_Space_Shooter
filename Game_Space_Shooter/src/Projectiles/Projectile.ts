class Projectile {

    public projectileType: ProjectileType;
    public texture: Phaser.Sprite;
    public position: Vector2;
    public velocity: Vector2;
    public targets: Ship[];

    constructor(_pos: Vector2, _vel: Vector2) {
        this.position = _pos;
        this.velocity = _vel;
    }

    public update() {
        this.checkCollision();
    }

    public checkCollision() {
        /*if (this.targets != null) {
            for (let i = 0; i < this.targets.length; i++) {
                let distance = Vector2.distance(this.position, this.targets[i].position);

                if (distance < this.targets[i].collisionRadius) {
                    this.onHit(this.targets[i]);
                }
            }
        }*/
    }

    public onHit(_target: Ship) {
        _target.onHit(this.projectileType);
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