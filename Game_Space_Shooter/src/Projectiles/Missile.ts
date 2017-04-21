class Missile extends Projectile {

    constructor(_tex: string, _toPool: Function) {
        super(_tex, _toPool);
        this.projectileType = ProjectileType.MISSILE;
        this.speed = 5;
        this.damageAmount = 5;
    }
}