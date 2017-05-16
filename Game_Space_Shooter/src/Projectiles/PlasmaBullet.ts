class PlasmaBullet extends Projectile {

    constructor(_toPool: Function, _tex?: string, _hitAnim?: string) {
        super(_toPool, _tex, _hitAnim, true);
        this.projectileType = ProjectileType.PLASMABULLET;
        this.speed = 10;
        this.damageAmount = 4;
    }
}