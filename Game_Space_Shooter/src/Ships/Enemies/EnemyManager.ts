class EnemyManager {

    private enemies: Array<Enemy>;
    private patterns: MovementPatterns;
    private projectilePools: ProjectilePool[];
    private player: Player;
    private enemiesMade: number;
    private timer: number;
    constructor(_projectilePools: ProjectilePool[])
    {
        this.patterns = new MovementPatterns();
        this.enemies = new Array<Enemy>();
        this.projectilePools = _projectilePools;
        this.enemiesMade = 0
        this.timer = 2 * Phaser.Timer.SECOND;
    }

    public createEnemy(type: EnemyType, healthMod: number, speedMod: number, pattern: Vector2[]) {
        let newEnemy = new Enemy(type, healthMod, speedMod, pattern, 70, this.killEnemy.bind(this), this.enemiesMade);
        this.enemiesMade++;
        newEnemy.addWeapon(0.5, this.projectilePools[0], [this.player]);
        this.enemies.push(newEnemy);
    }

    public update() {
        this.timer -= game.time.elapsedMS;
        if (this.timer < 0) {
            this.timer = 2 * Phaser.Timer.SECOND;
            switch (this.enemiesMade) {
                case 0: this.createEnemy(EnemyType.FIGHTER, 1, .5, this.patterns.pattern01);
                    break;
                case 1: this.createEnemy(EnemyType.FIGHTER, 1, .5, this.patterns.pattern02);
                    break;
                case 2: this.createEnemy(EnemyType.FIGHTER, 1, .5, this.patterns.pattern03);
                    break;
                case 3: this.createEnemy(EnemyType.FIGHTER, 1, .5, this.patterns.pattern04);
                    break;
                case 4: this.createEnemy(EnemyType.FIGHTER, 1, .5, this.patterns.pattern05);
                    break;
            }
        }
    }

    public setPlayer(_player: Player) {
        this.player = _player;
    }

    private killEnemy(_enemy: Enemy) {
        let index = this.enemies.indexOf(_enemy, _enemy.id);
        this.enemies.splice(index, 1);
        _enemy.destroy();
    }

    public getEnemies(): Array<Enemy> {
        return this.enemies;
    }
}