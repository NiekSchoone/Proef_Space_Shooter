enum EnemyType
{
    FIGHTER,
    BOMBER,
    BOSS
}
class Enemy extends Ship
{
    private enemyType: EnemyType;
    private movementPattern: Vector2[];
    private currentMove: number;
    private moveDir: Vector2;
    private notdead: boolean;
    private killEnemy: Function;
    private comboSprite: Phaser.Sprite;
    public id: number;

    constructor(type: EnemyType, healthMod: number, speedMod: number, pattern: Vector2[], _collisionRadius: number, _killEnemy: Function, _id: number)
    {
        super(_collisionRadius);
        this.moveDir = new Vector2(0, 0);
        this.id = _id;
        this.killEnemy = _killEnemy;
        this.movementPattern = pattern;                   
        this.vectorPosition.X = this.movementPattern[0].X;
        this.vectorPosition.Y = this.movementPattern[0].Y;
        this.notdead = true;
        this.currentMove = 1;
        this.comboSprite = new Phaser.Sprite(game, 0, 0, "combo02");
        
        switch (type) {
            case EnemyType.FIGHTER:
                this.setStats(2 * healthMod, 5 * speedMod);
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
    
    public update() {
        if (this.active) {
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
            super.update();
        } else {
            if (this.explosion.animations.frame >= this.explosion.animations.frameTotal - 8) {
                this.killEnemy(this);
            }
        }
    }

    private setStats(_health: number, _speed: number) {
        this.health = _health;
        this.speed = _speed;
    }

    protected die() {
        super.die();
    }

    public toggleComboTarget()
    {
        this.addChild(this.comboSprite);  
    }

}