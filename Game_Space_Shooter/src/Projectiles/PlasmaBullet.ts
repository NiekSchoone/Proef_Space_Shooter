class PlasmaBullet extends Projectile {

    constructor(_tex: string, _toPool: Function, _hitAnim: string) {
        super(_tex, _toPool, _hitAnim);
        this.projectileType = ProjectileType.PLASMABULLET;
        this.speed = 10;
        this.damageAmount = 1;
    }
}