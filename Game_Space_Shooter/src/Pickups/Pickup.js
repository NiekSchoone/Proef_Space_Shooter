var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Pickup = (function (_super) {
    __extends(Pickup, _super);
    function Pickup(_x, _y, _type) {
        _super.call(this, game, _x, _y);
        this.vectorPosition = new Vector2(_x, _y);
    }
    Pickup.prototype.onPickup = function () {
    };
    return Pickup;
}(Phaser.Sprite));
var PickupType;
(function (PickupType) {
    PickupType[PickupType["REPAIR"] = 0] = "REPAIR";
    PickupType[PickupType["UPGRADEMISSILE"] = 1] = "UPGRADEMISSILE";
    PickupType[PickupType["UPGRADEPLASMA"] = 2] = "UPGRADEPLASMA";
})(PickupType || (PickupType = {}));
