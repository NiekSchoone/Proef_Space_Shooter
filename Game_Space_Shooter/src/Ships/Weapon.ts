class Weapon {
    private cooldown: number;
    private fireTimer: number;
    private projectilePool: ProjectilePool;
    private targets: Array<Ship>;
    private vectorPosition: Vector2;
    private ShipPosition: Vector2;
    private relativePosition: Vector2;
    private fireAngle: number;
    public id: number
    private removeWeapon: Function;
    public fixedPosition: boolean;
    constructor(_cooldown: number, _projectilePool: ProjectilePool, _targets: Array<Ship>, _ShipPosition: Vector2, _relativePosition: Vector2, _id: number, _removeWeapon: Function, _fixedPosition: boolean = false) {
        this.cooldown = _cooldown * Phaser.Timer.SECOND;
        this.projectilePool = _projectilePool;
        this.fireTimer = _cooldown;
        this.ShipPosition = _ShipPosition;
        this.relativePosition = _relativePosition;
        this.targets = _targets;
        this.id = _id;
        this.removeWeapon = _removeWeapon;
        this.fixedPosition = _fixedPosition;
    }
    public setPosition(_relativePosition: Vector2) {
        this.relativePosition = _relativePosition;
    }
    public update() {
        this.fireTimer -= game.time.elapsedMS;
        this.vectorPosition = Vector2.copy(this.ShipPosition).add(this.relativePosition);
        if (this.fireTimer <= 0) {
            this.fireTimer = this.cooldown;
            let newProj = this.projectilePool.getProjectile();
            newProj.setTarget(this.targets);
            newProj.fire(this.vectorPosition, this.fireAngle);
        }
    }
    public destroyWeapon() {
        this.removeWeapon(this);
    }
    // Set the angle the projectiles will fire from
    public setAngle(_angle: number) {
        this.fireAngle = _angle;
    }
}