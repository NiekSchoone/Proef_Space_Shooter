class Missile extends Projectile {

    constructor(_toPool: Function, _tex: string, _hitAnim: string) {
        super(_toPool, _tex, _hitAnim, false);
        this.projectileType = ProjectileType.MISSILE;
        this.speed = 5;
        this.damageAmount = 10;
        this.animations.add("missile");
    }
}