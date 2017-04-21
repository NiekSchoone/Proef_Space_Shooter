var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Projectile = (function (_super) {
    __extends(Projectile, _super);
    function Projectile(_tex, _toPool) {
        _super.call(this, game, 0, 0);
        this.vectorPosition = new Vector2(0, 0);
        this.loadTexture(_tex);
        this.returnToPool = _toPool;
        this.anchor.set(0.5);
        this.targets = new Array();
    }
    Projectile.prototype.update = function () {
        if (this.active) {
            this.vectorPosition.add(this.velocity);
        }
        this.position.setTo(this.vectorPosition.X, this.vectorPosition.Y);
        this.checkCollision();
        this.checkBounds();
    };
    Projectile.prototype.fire = function (_pos, _rotation) {
        this.angle = _rotation;
        var angleVelocity = game.physics.arcade.velocityFromAngle(this.angle - 90, this.speed);
        this.velocity = new Vector2(angleVelocity.x, angleVelocity.y);
        this.vectorPosition = _pos;
        this.active = true;
    };
    Projectile.prototype.setTarget = function (_targets) {
        this.targets = _targets;
    };
    Projectile.prototype.checkCollision = function () {
        if (this.targets != null) {
            for (var i = 0; i < this.targets.length; i++) {
                var distance = Vector2.distance(this.vectorPosition, this.targets[i].vectorPosition);
                if (distance < this.targets[i].collisionRadius) {
                    this.onHit(this.targets[i]);
                }
            }
        }
    };
    Projectile.prototype.checkBounds = function () {
        if (this.vectorPosition.Y < -20 || this.vectorPosition.Y > game.height + 20 || this.vectorPosition.X > game.width + 20 || this.vectorPosition.X < -20) {
            this.returnToPool(this);
        }
    };
    Projectile.prototype.onHit = function (_target) {
        _target.onHit(this.damageAmount);
        this.returnToPool(this);
    };
    Projectile.prototype.resetValues = function () {
        this.visible = false;
        this.active = false;
        this.targets = new Array();
        this.vectorPosition = new Vector2(0, 0);
        this.velocity = new Vector2(0, 0);
    };
    return Projectile;
}(Phaser.Sprite));
var ProjectileType;
(function (ProjectileType) {
    ProjectileType[ProjectileType["PLASMABULLET"] = 0] = "PLASMABULLET";
    ProjectileType[ProjectileType["MISSILE"] = 1] = "MISSILE";
})(ProjectileType || (ProjectileType = {}));
