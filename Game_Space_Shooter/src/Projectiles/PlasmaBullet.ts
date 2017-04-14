class PlasmaBullet extends Projectile {

    constructor(_pos: Vector2, _vel: Vector2) {
        super(_pos, _vel);
        this.projectileType = ProjectileType.PLASMABULLET;
    }
}