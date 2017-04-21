var EnemyManager = (function () {
    function EnemyManager(_projectilePools) {
        this.patterns = new MovementPatterns();
        this.enemies = new Array();
        this.projectilePools = _projectilePools;
        this.enemiesMade = 0;
    }
    EnemyManager.prototype.createEnemy = function (type, healthMod, speedMod) {
        var newEnemy = new Enemy(type, healthMod, speedMod, this.patterns.pattern01, 70, this.killEnemy, this.enemiesMade);
        this.enemiesMade++;
        newEnemy.addWeapon(0.5, this.projectilePools[0], [this.player]);
        this.enemies.push(newEnemy);
    };
    EnemyManager.prototype.setPlayer = function (_player) {
        this.player = _player;
    };
    EnemyManager.prototype.killEnemy = function (_enemy) {
        var index = this.enemies.indexOf(_enemy, _enemy.id);
        this.enemies.splice(index, 1);
        _enemy.destroy();
    };
    EnemyManager.prototype.getEnemies = function () {
        return this.enemies;
    };
    return EnemyManager;
}());
