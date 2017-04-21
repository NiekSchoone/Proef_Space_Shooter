var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GameState = (function (_super) {
    __extends(GameState, _super);
    function GameState() {
        _super.apply(this, arguments);
    }
    GameState.prototype.create = function () {
        this.level = new Level();
        this.projectilePools = new Array();
        this.plasmaBulletPool = new ProjectilePool(ProjectileType.PLASMABULLET);
        this.projectilePools.push(this.plasmaBulletPool);
        this.missilePool = new ProjectilePool(ProjectileType.MISSILE);
        this.projectilePools.push(this.missilePool);
        this.player = new Player(this.projectilePools, 50);
        this.enemyManager = new EnemyManager(this.projectilePools);
        this.enemyManager.setPlayer(this.player);
        this.enemyManager.createEnemy(EnemyType.FIGHTER, 1, 0.2);
        this.player.setTargets(this.enemyManager.getEnemies());
        game.physics.startSystem(Phaser.Physics.ARCADE);
    };
    GameState.prototype.update = function () {
        this.level.update();
    };
    return GameState;
}(Phaser.State));
