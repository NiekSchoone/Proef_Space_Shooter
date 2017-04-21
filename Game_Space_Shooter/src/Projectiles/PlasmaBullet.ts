class PlasmaBullet extends Projectile {

    constructor(_tex: string, _toPool: Function) {
        super(_tex, _toPool);
        this.projectileType = ProjectileType.PLASMABULLET;
        this.speed = 10;
        this.damageAmount = 1;
    }
}