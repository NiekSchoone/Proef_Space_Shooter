class EnemyManager {

    private enemies: Array<Enemy>;
    private movenments: EnemyMovements;
    private weapons: EnemyWeapons;
    private patterns: EnemyMovements;
    private projectilePools: ProjectilePool[];
    private player: Player;
    private timer: number;
    private spawning: boolean;
    private waves: Array<Phaser.Tilemap>;
    private wave: number;
    private level: number;
    private activeLevel: boolean;
    private spriteGroup: Phaser.Group;
    public scoreCounter: ScoreIndicator;

    constructor(_projectilePools: ProjectilePool[], _group: Phaser.Group) {
        this.movenments = new EnemyMovements();
        
        this.enemies = new Array<Enemy>();
        this.projectilePools = _projectilePools;
        
        this.timer = 1000;
        this.activeLevel = false;
        this.spawning = true;
        this.waves = new Array<Phaser.Tilemap>();
        this.wave = 0;
        this.level = 0;

        this.spriteGroup = _group;

        this.waves.push(game.add.tilemap("wave01"));
        this.waves.push(game.add.tilemap("wave02"));
        this.waves.push(game.add.tilemap("wave03"));
        this.waves.push(game.add.tilemap("wave04"));
        this.waves.push(game.add.tilemap("wave05"));
        this.waves.push(game.add.tilemap("wave06"));
        this.waves.push(game.add.tilemap("wave07"));
    }

    public update() {
        if (this.activeLevel == false) {
            this.timer -= game.time.physicsElapsedMS;
            if (this.timer <= 0) {
                this.activeLevel = true;
            }
        }
        else {
            let enemiesInScreen: boolean = true;
            for (let e: number = 0; e < this.enemies.length; e++) {
                enemiesInScreen = (enemiesInScreen == true && this.enemies[e].inBounds == true)
            }
            if (enemiesInScreen == true || this.enemies.length == 0) {
                this.timer -= game.time.physicsElapsedMS;
                if (this.timer <= 0) {
                    this.wave++;
                    this.timer = 1500;
                    this.spawnWave();
                    if (this.wave == 5) {
                        this.wave = 0;
                        this.timer = 7000;
                        this.activeLevel = false;
                        this.level++;
                    }
                }
            }
        }
    }

    private spawnWave() {
        let waveToSpawn: number = Math.floor(Math.random() * 6);
        let enemytoPickup = Math.floor(Math.random() * this.waves[waveToSpawn].objects["Ships"].length);;

        for (let i = 0; i < this.waves[waveToSpawn].objects["Ships"].length; i++) {
            let newEnemy;
            let movement: Array<EnemyPosition> = null;
            let moveIndex = this.waves[waveToSpawn].objects["Ships"][i].properties.movement;
            if (moveIndex != 0) {
                movement = this.movenments.returnMovement(moveIndex);
            }
            switch (this.waves[waveToSpawn].objects["Ships"][i].type) {
                case "fighter":
                    newEnemy = new Enemy(EnemyType.FIGHTER, this.waves[waveToSpawn].objects["Ships"][i].properties.color, 30 + (2 * this.level), 2, new Vector2(this.waves[waveToSpawn].objects["Ships"][i].x - 192, -this.waves[waveToSpawn].objects["Ships"][i].y + 910), 50, this.killEnemy.bind(this), movement);
                    newEnemy.setDeathSound("enemy_death_big");
                    break;
                case "bomber":
                    newEnemy = new Enemy(EnemyType.BOMBER, this.waves[waveToSpawn].objects["Ships"][i].properties.color, 40 + (2 * this.level), 2, new Vector2(this.waves[waveToSpawn].objects["Ships"][i].x - 192, -this.waves[waveToSpawn].objects["Ships"][i].y + 910), 50, this.killEnemy.bind(this), movement);
                    newEnemy.setDeathSound("enemy_death_big");
                    break;
                case "scout":
                    newEnemy = new Enemy(EnemyType.SCOUT, this.waves[waveToSpawn].objects["Ships"][i].properties.color, 6 + (1.5 * this.level), 2.5, new Vector2(this.waves[waveToSpawn].objects["Ships"][i].x - 192, -this.waves[waveToSpawn].objects["Ships"][i].y + 910), 20, this.killEnemy.bind(this), movement);
                    newEnemy.setDeathSound("enemy_death_small");
                    break;
            }
            if (i == enemytoPickup) {
                let droprate: number = Math.random();
                if (droprate <= 0.5) {
                    newEnemy.hasPickup = true;
                }
                
            }
            newEnemy.setWeapons(this.weapons.returnWeapons(this.waves[waveToSpawn].objects["Ships"][i].properties.weapons, newEnemy.vectorPosition));
            this.enemies.push(newEnemy);
            this.spriteGroup.add(newEnemy);
        }
    }

    public setPlayer(_player: Player) {
        this.player = _player;
        this.weapons = new EnemyWeapons(this.projectilePools, this.player);
    }

    private killEnemy(_enemy: Enemy, score: number) {
        this.scoreCounter.onScoreChange(score);
        if (_enemy.hasPickup == true) {
            let pickup = new Pickup(this.player, _enemy.vectorPosition, Math.floor(Math.random() * 3));
            game.add.existing(pickup);
        }   
        ArrayMethods.removeObject(this.enemies, _enemy);
        _enemy.destroy();
    }

    public getEnemies(): Array<Enemy> {
        return this.enemies;
    }
}