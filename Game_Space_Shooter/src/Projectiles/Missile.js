var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Missile = (function (_super) {
    __extends(Missile, _super);
    function Missile(_tex, _toPool) {
        _super.call(this, _tex, _toPool);
        this.projectileType = ProjectileType.MISSILE;
        this.speed = 5;
        this.damageAmount = 5;
    }
    return Missile;
}(Projectile));
