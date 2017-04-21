var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PlasmaBullet = (function (_super) {
    __extends(PlasmaBullet, _super);
    function PlasmaBullet(_tex, _toPool) {
        _super.call(this, _tex, _toPool);
        this.projectileType = ProjectileType.PLASMABULLET;
        this.speed = 10;
        this.damageAmount = 1;
    }
    return PlasmaBullet;
}(Projectile));
