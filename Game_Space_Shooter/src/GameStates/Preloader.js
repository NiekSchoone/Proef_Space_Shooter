var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Preloader = (function (_super) {
    __extends(Preloader, _super);
    function Preloader() {
        _super.apply(this, arguments);
    }
    Preloader.prototype.preload = function () {
        game.load.image("background", "assets/Images/background_001.png");
        game.load.image("plasma_bullet", "assets/Images/Placeholders/bullet.png");
        game.load.image("ship_player", "assets/Images/Placeholders/ship_player.png");
        game.load.image("ship_enemy", "assets/Images/Placeholders/ship_enemy.png");
    };
    Preloader.prototype.create = function () {
        game.state.start("Game");
    };
    return Preloader;
}(Phaser.State));
