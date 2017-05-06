class EnemyManager {

    private enemies: Array<Enemy>;
    private patterns: MovementPatterns;
    private projectilePools: ProjectilePool[];
    private player: Player;
    private enemiesMade: number;
    private timer: number;
    private waves: EnemyUnit[][];
    private currentWave: number;
    private nextUnit: number;
    private spawning: boolean;
    constructor(_projectilePools: ProjectilePool[])
    {
        this.patterns = new MovementPatterns();
        this.enemies = new Array<Enemy>();
        this.projectilePools = _projectilePools;
        this.enemiesMade = 0;
        this.timer = 0;
        this.currentWave = 0;
        this.nextUnit = 0;
        this.setWaves();
        this.spawning = true;
        
    }
    private setWaves() {
        this.waves = [];
        let waveOne = new Array<EnemyUnit>();
        this.waves.push(waveOne);
        let unitOne = new EnemyUnit(5000);
        waveOne.push(unitOne);
        let enemyOne = this.createEnemy(EnemyType.FIGHTER, 20, 2, this.patterns.pattern01);
        let enemyTwo = this.createEnemy(EnemyType.FIGHTER, 20, 2, this.patterns.pattern01);
        unitOne.addEnemy(enemyOne);
        unitOne.addEnemy(enemyTwo);
        this.waves[0][0].spawn();

    }
    public createEnemy(type: EnemyType, healthMod: number, speedMod: number, pattern: Vector2[]): Enemy {
        let newEnemy = new Enemy(type, healthMod, speedMod, pattern, 70, this.killEnemy.bind(this), this.enemiesMade);
        this.enemiesMade++;
        this.enemies.push(newEnemy);
        return newEnemy;
    }

    public update() {
        
       

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