class Missile extends Projectile {

    constructor(_pos: Vector2, _tex: string, _toPool: Function) {
        super(_pos, _tex, _toPool);
        this.projectileType = ProjectileType.MISSILE;
        this.speed = 5;
    }
}