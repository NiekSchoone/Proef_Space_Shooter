class EnemyManager {

    private enemies: Enemy[];
    private patterns: MovementPatterns;
    private projectilePools: ProjectilePool[];
    private player: Player;
    constructor(_projectilePools: ProjectilePool[])
    {
        this.patterns = new MovementPatterns();
        this.enemies = new Array<Enemy>();
        this.projectilePools = _projectilePools;
        
    }

    public createEnemy(type: EnemyType, healthMod: number, speedMod: number) {
        let newEnemy = new Enemy(type, healthMod, speedMod, this.patterns.pattern01,2);
        newEnemy.addWeapon(1, this.projectilePools[0],[this.player]);
        this.enemies.push(newEnemy);
    }
    public update() {
        for (let i = 0; i < this.enemies.length; i++){
            this.enemies[i].update();
        }
    }
    public setPlayer(_player: Player){
        this.player = _player;
    }
    public getEnemies(): Enemy[] {
        return this.enemies;
    }
}