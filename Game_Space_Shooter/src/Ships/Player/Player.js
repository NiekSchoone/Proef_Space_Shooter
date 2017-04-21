var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(_projectilePools, _collisionRadius) {
        _super.call(this, _collisionRadius);
        this.projectilePools = _projectilePools;
        this.loadTexture("ship_player");
        this.speed = 10;
        this.anchor.set(0.5);
        game.add.existing(this);
        game.physics.arcade.enable(this);
        this.moveDir = new Vector2();
        this.enemies = new Array();
        this.fireAngle = 0;
    }
    Player.prototype.update = function () {
        if (game.input.mousePointer.isDown) {
            this.moveDir.X = (game.input.x - this.vectorPosition.X) / 100;
            this.moveDir.Y = (game.input.y - this.vectorPosition.Y) / 100;
            this.vectorPosition.add(new Vector2(this.moveDir.X * this.speed, this.moveDir.Y * this.speed));
        }
        _super.prototype.update.call(this);
    };
    Player.prototype.setTargets = function (_enemies) {
        this.enemies = _enemies;
        this.addWeapon(0.4, this.projectilePools[0], this.enemies);
    };
    return Player;
}(Ship));
