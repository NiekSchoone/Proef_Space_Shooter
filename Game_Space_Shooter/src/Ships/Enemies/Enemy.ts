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
    private dead: Boolean;
    private indicator: Phaser.Graphics;

    constructor(type: EnemyType, health: number, speed: number, pattern: Vector2[], _collisionRadius: number, _killEnemy: Function, _id: number)
    {
        super(_collisionRadius);
        this.moveDir = new Vector2(0, 0);
        this.id = _id;
        this.killEnemy = _killEnemy;
        this.movementPattern = pattern;                   
        this.vectorPosition.X = this.movementPattern[0].X;
        this.vectorPosition.Y = this.movementPattern[0].Y;
        this.currentMove = 1;
        this.comboSprite = new Phaser.Sprite(game, 0, 0, "indicator");

        this.speed = speed;
        this.enemyType = type;
        this.anchor.set(0.5);
        this.fireAngle = 180;
        this.active = false;
        this.dead = true;
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
        } else if(this.dead) {
            if (this.explosion.animations.frame >= this.explosion.animations.frameTotal - 8) {
                this.killEnemy(this);
            }
        }
    }
    public spawn() {
        switch (this.enemyType) {
            case EnemyType.FIGHTER:
                this.loadTexture("ship_enemy");
                break;
            case EnemyType.BOMBER:
                this.loadTexture("ship_enemy");
                break;
            case EnemyType.BOSS:
                this.loadTexture("ship_enemy");
                break;
        }
        game.add.existing(this);
        this.active = true;
    }
    protected die() {
        this.dead = true;
        super.die();
        this.killEnemy(this);
    }

    public toggleComboTarget(activate : boolean)
    {
        if (activate == true)
        {
            this.comboSprite.anchor.setTo(0.5);
            let anim = this.comboSprite.animations.add("indicator", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], 24, false);
            anim.play();
            this.addChild(this.comboSprite);
        }
        else
        {
            this.removeChild(this.comboSprite);
        }
    }

    public indicateTarget()
    {
        //this.indicator = game.add.graphics(this.vectorPosition.X - 60, this.vectorPosition.Y - 60);
        //this.indicator.lineStyle(5, 0xff0000);
        //this.indicator.lineTo(this.vectorPosition.X - 50, this.vectorPosition.Y - 50);
        //console.log("HELLCHEA");
    }
}