﻿enum EnemyType
{
    FIGHTER,
    BOMBER,
    SCOUT
}
class Enemy extends Ship {
    private enemyType: EnemyType;
    private movementPattern: Array<EnemyPosition>;
    private currentMove: number;
    private moveDir: Vector2;
    private killEnemy: Function;
    private comboSprite: Phaser.Sprite;
    private weapons: Array<Weapon>;
    public inBounds: boolean;
    private indicator: Phaser.Sprite;
    public color: number;
    private score: number;
    public hasPickup: boolean;
    private anim: Phaser.Animation;
    constructor(_type: EnemyType, _color: number, _maxHP: number, _speed: number, _start: Vector2, _collisionRadius: number, _killEnemy: Function, _movementPattern: Array<EnemyPosition>) {
        super(_collisionRadius, _maxHP);
        this.killEnemy = _killEnemy;

        this.active = true;
        this.speed = _speed;
        this.moveDir = new Vector2(0, 1);
        this.vectorPosition.X = _start.X;
        this.vectorPosition.Y = _start.Y;
        this.currentMove = 0;
        if (_movementPattern == null) {
            this.movementPattern = [new EnemyPosition(new Vector2(this.vectorPosition.X, 1000),180)];
        }
        else {
            this.movementPattern = _movementPattern;
        }

        this.inBounds = false;
        this.hasPickup = false;

        this.comboSprite = new Phaser.Sprite(game, 0, 0, "indicator");
        this.indicator = new Phaser.Sprite(game, 0, 0, "target_indicator");
        this.comboSprite.anchor.setTo(0.5);
        this.indicator.anchor.setTo(0.5);
        this.indicator.scale.setTo(1.5);
        this.indicator.angle = 45;
        this.anim = this.comboSprite.animations.add("indicator", Phaser.ArrayUtils.numberArray(0, 19), 24, false);
        this.anim.setFrame(19);
        this.anchor.set(0.5);
        this.addChild(this.indicator);

        this.color = _color;
        this.enemyType = _type;
        switch (this.color) {
            case 0:
                this.loadTexture("ships_enemy_orange", this.enemyType);
                break;
            case 1:
                this.loadTexture("ships_enemy_blue", this.enemyType);
                break;
            case 2:
                this.loadTexture("ships_enemy_pink", this.enemyType);
                break;
        }
        game.add.existing(this);
    }
    public setWeapons(_weapons: Array<Weapon>) {
        this.weapons = _weapons;
    }
    public update() {
        if (this.active) {
            this.moveDir.X = (this.movementPattern[this.currentMove].point.X - this.vectorPosition.X) / 100;
            this.moveDir.Y = (this.movementPattern[this.currentMove].point.Y - this.vectorPosition.Y) / 100;
            this.moveDir.normalize();
            this.vectorPosition.add(new Vector2(this.moveDir.X * this.speed, this.moveDir.Y * this.speed));
            if (Vector2.distance(this.vectorPosition, this.movementPattern[this.currentMove].point) < 1) {
                this.currentMove++;
                if (this.currentMove == this.movementPattern.length) {
                    this.killEnemy(this, 0);
                }
            }
            if (this.inBounds) {
                if (this.weapons != null) {
                    for (let i = 0; i < this.weapons.length; i++) {
                        this.weapons[i].update();
                    }
                }
            }
            else if (this.checkBounds()) {
                this.inBounds = true;
            }

            super.update();
        } else {
            if (this.explosion.animations.frame >= this.explosion.animations.frameTotal - 8) {
                this.killEnemy(this, this.score);
            }
        } 
    }
    private checkBounds(): boolean {
        return (this.vectorPosition.Y > -64 && this.vectorPosition.Y < 1000 && this.vectorPosition.X > -64 && this.vectorPosition.X < 576)
    }
    public toggleComboTarget(activate: boolean)
    {
        if (activate == true && this.anim.isFinished == false)
        {
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
        game.add.tween(this.indicator).to({ alpha: 1 }, 350, Phaser.Easing.Linear.None, true);
    }
}