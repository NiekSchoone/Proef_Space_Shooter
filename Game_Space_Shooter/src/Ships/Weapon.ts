class Weapon {
    private cooldown: number;
    private fireTimer: number;
    private projectilePool: ProjectilePool;
    public position: Vector2;
    public angle: number;
    private targets: Ship[];

    constructor( _cooldown: number, _projectilePool: ProjectilePool, targets : Ship[]) {
        this.cooldown = _cooldown * Phaser.Timer.SECOND;
        this.projectilePool = _projectilePool;
        this.fireTimer = _cooldown;
        this.targets = targets;
    }

    public update() {
        this.fireTimer -= game.time.elapsedMS;
        if (this.fireTimer < 0)
        {
            this.fireTimer = this.cooldown;
            let newProj = this.projectilePool.getProjectile();
            newProj.setTarget(this.targets);
            newProj.fire(this.position, this.angle);
        }
    } 
}