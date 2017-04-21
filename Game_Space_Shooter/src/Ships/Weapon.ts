class Weapon {
    private cooldown: number;
    private fireTimer: number;
    private projectilePool: ProjectilePool;
    private targets: Array<Ship>;
    public vectorPosition: Vector2;
    private fireAngle: number;

    constructor(_cooldown: number, _projectilePool: ProjectilePool, _targets: Array<Ship>) {
        this.cooldown = _cooldown * Phaser.Timer.SECOND;
        this.projectilePool = _projectilePool;
        this.fireTimer = _cooldown;
        this.targets = _targets;
    }

    public update() {
        this.fireTimer -= game.time.elapsedMS;
        // Fire a projectile when the fire timer lands at 0
        if (this.fireTimer <= 0) {
            this.fireTimer = this.cooldown;
            let newProj = this.projectilePool.getProjectile();
            newProj.setTarget(this.targets);
            newProj.fire(this.vectorPosition, this.fireAngle);
        }
    }

    // Set the angle the projectiles will fire from
    public setAngle(_angle: number) {
        this.fireAngle = _angle;
    }
}