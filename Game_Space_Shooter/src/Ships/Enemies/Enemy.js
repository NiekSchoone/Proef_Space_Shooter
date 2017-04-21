var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EnemyType;
(function (EnemyType) {
    EnemyType[EnemyType["FIGHTER"] = 0] = "FIGHTER";
    EnemyType[EnemyType["BOMBER"] = 1] = "BOMBER";
    EnemyType[EnemyType["BOSS"] = 2] = "BOSS";
})(EnemyType || (EnemyType = {}));
var Enemy = (function (_super) {
    __extends(Enemy, _super);
    function Enemy(type, healthMod, speedMod, pattern, _collisionRadius, _killEnemy, _id) {
        _super.call(this, _collisionRadius);
        this.moveDir = new Vector2(0, 0);
        this.id = _id;
        this.movementPattern = pattern;
        this.vectorPosition.X = this.movementPattern[0].X;
        this.vectorPosition.Y = this.movementPattern[0].Y;
        this.notdead = true;
        this.currentMove = 1;
        switch (type) {
            case EnemyType.FIGHTER:
                this.setStats(10 * healthMod, 5 * speedMod);
                this.loadTexture("ship_enemy");
                break;
            case EnemyType.BOMBER:
                this.setStats(20 * healthMod, 2 * speedMod);
                this.loadTexture("ship_enemy");
                break;
            case EnemyType.BOSS:
                this.setStats(100 * healthMod, 5 * speedMod);
                this.loadTexture("ship_enemy");
                break;
        }
        game.add.existing(this);
        this.anchor.set(0.5);
        this.fireAngle = 180;
    }
    Enemy.prototype.update = function () {
        if (this.notdead) {
            this.moveDir.X = (this.movementPattern[this.currentMove].X - this.vectorPosition.X) / 100;
            this.moveDir.Y = (this.movementPattern[this.currentMove].Y - this.vectorPosition.Y) / 100;
            this.moveDir.normalize();
            this.vectorPosition.add(new Vector2(this.moveDir.X * this.speed, this.moveDir.Y * this.speed));
            if (Vector2.distance(this.vectorPosition, this.movementPattern[this.currentMove]) < 1) {
                this.currentMove++;
                if (this.currentMove == this.movementPattern.length) {
                    this.die();
                }
            }
            _super.prototype.update.call(this);
        }
    };
    Enemy.prototype.setStats = function (_health, _speed) {
        this.health = _health;
        this.speed = _speed;
    };
    Enemy.prototype.die = function () {
        this.notdead = false;
    };
    return Enemy;
}(Ship));
