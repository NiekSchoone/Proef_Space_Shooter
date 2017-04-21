class Weapon {
    private cooldown: number;
    private fireTimer: number;
    private projectilePool: ProjectilePool;
    public position: Vector2;
    public angle: number;

    constructor( _cooldown: number, _projectilePool: ProjectilePool) {
        this.cooldown = _cooldown * Phaser.Timer.SECOND;
        this.projectilePool = _projectilePool;
        this.fireTimer = _cooldown;
    }

    public update() {
        this.fireTimer -= game.time.elapsedMS;
        if (this.fireTimer < 0)
        {
            this.fireTimer = this.cooldown;
            this.projectilePool.getProjectile().fire(this.position, this.angle);
        }
    }
}