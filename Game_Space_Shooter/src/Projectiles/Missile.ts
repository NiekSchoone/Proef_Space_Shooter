class Missile extends Projectile {

    constructor(_tex: string, _toPool: Function, _hitAnim: string) {
        super(_tex, _toPool, _hitAnim);
        this.projectileType = ProjectileType.MISSILE;
        this.speed = 5;
        this.damageAmount = 5;
        this.animations.add("missile");
    }
}