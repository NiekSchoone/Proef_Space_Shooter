class EnemyManager {

    private enemies: Array<Enemy>;
    private patterns: MovementPatterns;
    private projectilePools: ProjectilePool[];
    private player: Player;
    private enemiesMade: number;
    private timer: number;
    private spawning: boolean;
    private waves: Array<Phaser.Tilemap>;
    private wave: number;
    private level: number;
    private activeLevel: boolean;
    
    constructor(_projectilePools: ProjectilePool[]) {
        this.patterns = new MovementPatterns();
        this.enemies = new Array<Enemy>();
        this.projectilePools = _projectilePools;
        this.enemiesMade = 0;
        this.timer = 3000;
        this.activeLevel = false;
        this.spawning = true;
        this.waves = new Array<Phaser.Tilemap>();
        this.wave = 0;
        this.level = 0;

        this.waves.push(game.add.tilemap("wave01"));
        this.waves.push(game.add.tilemap("wave02"));
        this.waves.push(game.add.tilemap("wave03"));
        this.waves.push(game.add.tilemap("wave04"));
        this.waves.push(game.add.tilemap("wave05"));
    }

    public createEnemy(_type: EnemyType, _health: number, _speed: number, _start: Vector2): Enemy {
        let newEnemy = new Enemy(_type, _health, _speed, _start, 50, this.killEnemy.bind(this), this.enemiesMade);
        this.enemiesMade++;
        this.enemies.push(newEnemy);
        return newEnemy;
    }

    public update() {
        if (this.activeLevel == false) {
            this.timer -= game.time.elapsedMS;
            if (this.timer <= 0) {
                this.timer = 1000;
                this.activeLevel = true;
            }
        }
        else {
            let enemiesInScreen: boolean = true;
            for (let e: number = 0; e < this.enemies.length; e++) {
                enemiesInScreen = (enemiesInScreen == true && this.enemies[e].shooting == true)
            }
            if (enemiesInScreen == true || this.enemies.length == 0) {
                this.timer -= game.time.elapsedMS;
                if (this.timer <= 0) {
                    this.wave++;
                    this.timer = 1000;
                    this.spawnWave();
                    if (this.wave == 5) {
                        this.wave = 0;
                        this.timer = 3000;
                        this.activeLevel = false;
                        this.level++;
                    }
                }
                
            }
        }
    }

    private spawnWave() {
        let waveToSpawn: number = Math.floor(Math.random() * 4);

        for (let i = 0; i < this.waves[waveToSpawn].objects["Ships"].length; i++) {
            switch (this.waves[waveToSpawn].objects["Ships"][i].type){
                case "fighter":
                    let EnemyF = this.createEnemy(EnemyType.FIGHTER, 50, 2, new Vector2(this.waves[waveToSpawn].objects["Ships"][i].x - 192, -this.waves[waveToSpawn].objects["Ships"][i].y));
                    EnemyF.addWeapon(0.2, this.projectilePools[0], 180, [this.player], new Vector2());
                    break;
                case "bomber":
                    let EnemyB = this.createEnemy(EnemyType.BOMBER, 50, 2, new Vector2(this.waves[waveToSpawn].objects["Ships"][i].x - 192, -this.waves[waveToSpawn].objects["Ships"][i].y));
                    EnemyB.addWeapon(0.2, this.projectilePools[0],180, [this.player], new Vector2());
                    EnemyB.addWeapon(1, this.projectilePools[1], 180, [this.player], new Vector2(-30, 0));
                    EnemyB.addWeapon(1, this.projectilePools[1], 180, [this.player], new Vector2(30, 0));
                    break;
            }
        }
    }
    public setPlayer(_player: Player) {
        this.player = _player;
    }

    private killEnemy(_enemy: Enemy) {
        ArrayMethods.removeObject(this.enemies, _enemy);
        _enemy.destroy();
    }

    public getEnemies(): Array<Enemy> {
        return this.enemies;
    }
}