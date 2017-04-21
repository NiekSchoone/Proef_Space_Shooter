var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Ship = (function (_super) {
    __extends(Ship, _super);
    function Ship(_collisionRadius) {
        _super.call(this, game, 0, 0);
        this.game = game;
        this.collisionRadius = _collisionRadius;
        this.weapons = new Array();
        this.vectorPosition = new Vector2();
    }
    Ship.prototype.onHit = function (_amount) {
        this.health -= _amount;
        if (this.health <= 0) {
            this.die();
        }
    };
    Ship.prototype.addWeapon = function (cooldown, projectilePool, _targets) {
        var newWeapon = new Weapon(cooldown, projectilePool, _targets);
        newWeapon.setAngle(this.fireAngle);
        this.weapons.push(newWeapon);
    };
    Ship.prototype.update = function () {
        this.position.setTo(this.vectorPosition.X, this.vectorPosition.Y);
        for (var i = 0; i < this.weapons.length; i++) {
            this.weapons[i].vectorPosition = Vector2.copy(this.vectorPosition);
            this.weapons[i].update();
        }
    };
    Ship.prototype.die = function () {
    };
    return Ship;
}(Phaser.Sprite));
