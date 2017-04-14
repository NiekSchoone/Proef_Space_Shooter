class PlasmaBullet extends Projectile {

    constructor(_pos: Vector2, _vel: Vector2, _toPool: Function) {
        super(_pos, _vel, _toPool);
        this.projectileType = ProjectileType.PLASMABULLET;
    }
}