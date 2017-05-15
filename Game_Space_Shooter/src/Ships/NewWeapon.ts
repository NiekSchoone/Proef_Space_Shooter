class NewWeapon {
    private cooldown: number;
    private timer: number;
    private projectilePool: ProjectilePool;
    private targets: Array<Ship>;
    private vectorPosition: Vector2;
    private shipPosition: Vector2;
    private relativePosition: Vector2;
    private fireAngle: number;
    private behaviour: Function;

    public id: number;

    constructor(_position: Vector2, _shipPosition: Vector2, _cooldown: number, _angle: number, _projectilePool: ProjectilePool, _targets: Array<Ship>, _behaviour?: Function) {
        this.relativePosition = _position;
        this.shipPosition = _shipPosition;
        this.cooldown = _cooldown * Phaser.Timer.SECOND;
        this.fireAngle = _angle;
        this.projectilePool = _projectilePool;
        this.targets = _targets;
        this.behaviour = _behaviour;

        this.timer = _cooldown;
    }

    public update() {
        this.timer -= game.time.elapsedMS;
        this.vectorPosition = Vector2.copy(this.shipPosition).add(this.relativePosition);
        if (this.timer <= 0) {
            this.timer = this.cooldown;
            let newProj = this.projectilePool.getProjectile();
            newProj.setTarget(this.targets);
            newProj.fire(this.vectorPosition, this.fireAngle);
        }
        if (this.behaviour != null) {
            this.behaviour();
        }
    }

    // Set the angle the projectiles will fire towards
    public setAngle(_angle: number) {
        this.fireAngle = _angle;
    }

    public setPosition(_relativePosition: Vector2) {
        this.relativePosition = _relativePosition;
    }
}