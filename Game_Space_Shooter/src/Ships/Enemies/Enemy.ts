enum EnemyType
{
    FIGHTER,
    BOMBER,
    BOSS
}
class Enemy extends Ship {
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


    constructor(_type: EnemyType, _maxHP: number, _speed: number, _start: Vector2, _collisionRadius: number, _killEnemy: Function, _id: number) {
        super(_collisionRadius, _maxHP);
        this.moveDir = new Vector2(0, 0);
        this.id = _id;
        this.enemyType = _type;
        this.killEnemy = _killEnemy;
        this.vectorPosition.X = _start.X;
        this.vectorPosition.Y = _start.Y;              
        this.currentMove = 1;
        this.speed = _speed;
        this.comboSprite = new Phaser.Sprite(game, 0, 0, "indicator");

        this.speed = speed;
        this.enemyType = type;
        this.anchor.set(0.5);
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
        this.shooting = false;
    }

    public update() {
        if (this.active) {
            this.moveDir.X = 0
            this.moveDir.Y = 1
            

            this.vectorPosition.add(new Vector2(this.moveDir.X * this.speed, this.moveDir.Y * this.speed));

            super.update();
            if (this.shooting == false)
            {
                this.shooting = (this.vectorPosition.Y > 0);
            }
        } else {
            if (this.explosion.animations.frame >= this.explosion.animations.frameTotal - 8) {
                this.killEnemy(this);
            }
        }
    }

    public spawn() {
        
    }

    protected die() {
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
    
        this.comboSprite.anchor.setTo(0.5);
        let anim = this.comboSprite.animations.add("indicated", [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], 24, false);
        anim.play();
        this.addChild(this.comboSprite);
    }
}