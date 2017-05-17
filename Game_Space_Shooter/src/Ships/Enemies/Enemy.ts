enum EnemyType
{
    FIGHTER,
    BOMBER,
    BOSS
}
class Enemy extends Ship {
    private enemyType: EnemyType;
    private movementPattern: Array<Vector2>;
    private currentMove: number;
    private moveDir: Vector2;
    private notdead: boolean;
    private killEnemy: Function;
    private comboSprite: Phaser.Sprite;
    private weapons: Array<Weapon>;
    public inBounds: boolean;
    private indicator: Phaser.Sprite;
    private anim: any;
    private color: number;

    constructor(_type: EnemyType, _color: number, _maxHP: number, _speed: number, _start: Vector2, _collisionRadius: number, _killEnemy: Function, _movementPattern: Array<Vector2> = null) {
        super(_collisionRadius, _maxHP);
        this.moveDir = new Vector2(0, 0);
        this.enemyType = _type;
        this.killEnemy = _killEnemy;
        this.vectorPosition.X = _start.X;
        this.vectorPosition.Y = _start.Y;
        this.weapons = new Array<Weapon>();
        this.currentMove = 1;
        this.color = _color;
        this.speed = _speed;
        this.comboSprite = new Phaser.Sprite(game, 0, 0, "indicator");
        this.indicator = new Phaser.Sprite(game, 0, 0, "target_indicator");
        this.inBounds = false;
        this.anim = this.comboSprite.animations.add("indicator", Phaser.ArrayUtils.numberArray(0, 19), 24, false);
        this.anchor.set(0.5);
        this.comboSprite.anchor.setTo(0.5);
        this.indicator.anchor.setTo(0.5);
        this.indicator.scale.setTo(1.5);
        this.indicator.angle = 45;
        this.addChild(this.indicator);

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

    public update() {
        if (this.active) {
            this.moveDir.X = 0
            this.moveDir.Y = 1

            this.vectorPosition.add(new Vector2(this.moveDir.X * this.speed, this.moveDir.Y * this.speed));

            if (this.inBounds) {
                for (let i = 0; i < this.weapons.length; i++) {
                    this.weapons[i].update();
                }
                if (this.checkBounds() == false) {
                    this.killEnemy(this);
                }
            }
            else if ( this.checkBounds()) {
                this.inBounds = true;
            }

            super.update();
        } else {
            if (this.explosion.animations.frame >= this.explosion.animations.frameTotal - 8) {
                this.killEnemy(this);
            }
        }
    }

    private checkBounds(): boolean {
        return (this.vectorPosition.Y > -64 && this.vectorPosition.Y < 1000 && this.vectorPosition.X > -64 && this.vectorPosition.X < 576)
    }
    public toggleComboTarget(activate: boolean) {
        if (activate == true) {
            this.anim.play();
            this.addChild(this.comboSprite);
        }
        else {
            this.removeChild(this.comboSprite);
        }
    }

    public indicateTarget()
    {
        this.indicator.alpha = 0;
        game.add.tween(this.indicator).to({ alpha: 1 }, 200, Phaser.Easing.Linear.None, true);
    }
}