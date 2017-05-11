class EnemyUnit {
    public time: number;
    private enemies: Array<Enemy>;
    constructor(_time: number, _enemies: Enemy[]) {
        this.time = _time;
        this.enemies = _enemies
    }
    public spawn() {
        for (let i: number = 0; i < this.enemies.length; i++){
            this.enemies[i].spawn();
        }
    }
}