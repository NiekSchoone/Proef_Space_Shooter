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
        this.waves[0] = [];
        let e1 = this.createEnemy(EnemyType.FIGHTER, 10, .5, this.patterns.pattern01);
        let e2 = this.createEnemy(EnemyType.FIGHTER, 10, .5, this.patterns.pattern02);
        let u1 = new EnemyUnit(100, [e1, e2]);
        this.waves[0][0] = u1;
        let e3 = this.createEnemy(EnemyType.FIGHTER, 10, .5, this.patterns.pattern01);
        let e4 = this.createEnemy(EnemyType.FIGHTER, 10, .5, this.patterns.pattern02);
        let u2 = new EnemyUnit(500, [e3, e4]);
        this.waves[0][1] = u2;
        let e5 = this.createEnemy(EnemyType.FIGHTER, 10, .5, this.patterns.pattern01);
        let e6 = this.createEnemy(EnemyType.FIGHTER, 10, .5, this.patterns.pattern02);
        let u3 = new EnemyUnit(1000, [e3, e4]);
        this.waves[1] = [];
        this.waves[1][0] = u3;

    }
    public createEnemy(type: EnemyType, healthMod: number, speedMod: number, pattern: Vector2[]): Enemy {
        let newEnemy = new Enemy(type, healthMod, speedMod, pattern, 20, this.killEnemy.bind(this), this.enemiesMade);
        this.enemiesMade++;
        this.enemies.push(newEnemy);
        return newEnemy;
    }

    public update() {
        if (this.spawning) {
            this.timer += game.time.elapsedMS;
            if (this.timer <= this.waves[this.currentWave][this.nextUnit].time)
            {
                console.log("spawning" + this.currentWave+":"+ this.nextUnit)
                this.waves[this.currentWave][this.nextUnit].spawn();
                this.nextUnit++;

                if (this.nextUnit == this.waves[this.currentWave].length)
                {
                    this.currentWave++;
                    this.timer = 0;
                    this.nextUnit = 0;
                    if (this.currentWave == this.waves.length)
                    {
                        this.spawning = false;
                    }
                }
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