class EnemyManager {

    enemys: Enemy[];
    patterns: MovementPatterns;
    pool: ProjectilePool;
    constructor(pool: ProjectilePool) {
        this.patterns = new MovementPatterns();
        this.enemys = new Array<Enemy>();
        this.pool = pool;
    }

    public createEnemy(type: EnemyType, healthMod: number, speedMod: number) {
        let newEnemy = new Enemy(game, type, healthMod, speedMod, this.patterns.pattern01);
        let newWeapon: Weapon = new Weapon(200, this.pool);
        newEnemy.addWeapon(newWeapon);
        this.enemys.push(newEnemy);
    }
    public update() {
        for (let i = 0; i < this.enemys.length; i++){
            this.enemys[i].update();
        }
    }
}