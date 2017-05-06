class EnemyUnit {
    public time: number;
    private enemies: Array<Enemy>;
    private weapones: Array<Weapon>;
    constructor(_time: number) {
        this.time = _time;
        this.enemies = new Array<Enemy>();
        this.weapones = new Array<Weapon>();
    }
    public addEnemy(_enemy: Enemy) {
        this.enemies.push(_enemy);
    }
    public addWeapon(_weapon) {
        this.weapones.push(_weapon);
    }
    public spawn() {
        for (let i: number = 0; i < this.enemies.length; i++){
            for (let w: number = 0; w < this.weapones.length; w++) {
                this.enemies[i].addWeapon(Object.create(this.weapones[w]));
            }
            this.enemies[i].spawn();
        }
    }
}