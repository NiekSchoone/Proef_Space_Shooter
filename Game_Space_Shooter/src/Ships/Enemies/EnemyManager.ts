class EnemyManager {

    enemys: Enemy[];
    patterns: MovementPatterns;
    constructor() {
        this.patterns = new MovementPatterns();
        this.enemys = new Array<Enemy>();
    }

    public createEnemy(type: EnemyType, healthMod: number, speedMod: number) {
        let newEnemy = new Enemy(game, type, healthMod, speedMod, this.patterns.pattern01);
        this.enemys.push(newEnemy);
    }
    public update() {
        for (let i = 0; i < this.enemys.length; i++){
            this.enemys[i].update();
        }
    }
}