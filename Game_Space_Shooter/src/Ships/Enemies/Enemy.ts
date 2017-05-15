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


    constructor(type: EnemyType, health: number, speed: number, start: Vector2, _collisionRadius: number, _killEnemy: Function, _id: number)
    {
        super(_collisionRadius);
        this.moveDir = new Vector2(0, 0);
        this.id = _id;
        this.killEnemy = _killEnemy;
        this.vectorPosition.X = start.X;
        this.vectorPosition.Y = start.Y;              
        this.currentMove = 1;
        this.comboSprite = new Phaser.Sprite(game, 0, 0, "indicator");

        this.speed = speed;
        this.enemyType = type;
        this.comboSprite = new Phaser.Sprite(game, 0, 0, "combo02");
        this.anchor.set(0.5);
        this.fireAngle = 180;
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

    public toggleComboTarget()
    {
        this.comboSprite.anchor.setTo(0.5);
        let anim = this.comboSprite.animations.add("indicated", [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], 24, false);
        anim.play();
        this.addChild(this.comboSprite);  
    }

}