/**
 * @description All possible types of enemy
 */
enum EnemyType {
    FIGHTER,
    BOMBER,
    SCOUT
}
/**
 * @description Class containing functionality of an enemy
 */
class Enemy extends Ship {

    private enemyType: EnemyType;
    private movementPattern: Array<EnemyPosition>;
    private currentMove: number;
    private moveDir: Vector2;
    private killEnemy: Function;
    private comboSprite: Phaser.Sprite;
    private weapons: Array<Weapon>;
    private indicator: Phaser.Sprite;
    private score: number;
    private anim: Phaser.Animation;
    private indicateInTween: Phaser.Tween;
    private indicateOutTween: Phaser.Tween;
    private isIndicating: boolean;

    public hasPickup: boolean;
    public inBounds: boolean;
    public color: number;

    constructor(_type: EnemyType, _color: number, _maxHP: number, _speed: number, _start: Vector2, _collisionRadius: number, _killEnemy: Function, _movementPattern: Array<EnemyPosition>) {
        super(_collisionRadius, _maxHP);
        this.killEnemy = _killEnemy;

        this.active = true;
        this.speed = _speed;
        this.moveDir = new Vector2(0, 0);
        this.vectorPosition.X = _start.X;
        this.vectorPosition.Y = _start.Y;
        this.currentMove = 0;
        if (_movementPattern == null) {
            this.movementPattern = [new EnemyPosition(new Vector2(this.vectorPosition.X, 1000), 0)];
        } else {
            this.movementPattern = _movementPattern;
        }
        this.angle = this.movementPattern[this.currentMove].rotation;
        this.inBounds = false;
        this.hasPickup = false;
        this.score = 10;
        this.comboSprite = new Phaser.Sprite(game, 0, 0, "indicator");
        this.inBounds = false;
        this.anim = this.comboSprite.animations.add("indicator", Phaser.ArrayUtils.numberArray(0, 19), 24, false);
        this.anim.setFrame(19);
        this.anchor.set(0.5);
        this.comboSprite.anchor.setTo(0.5);
        this.indicator = new Phaser.Sprite(game, 0, 0, "target_indicator");
        this.indicator.alpha = 0;
        this.indicator.anchor.setTo(0.5);
        this.indicator.scale.setTo(1.5);
        this.indicator.angle = 45;
        this.addChild(this.indicator);

        this.hasPickup = false;
        this.isIndicating = true;

        this.indicateInTween = game.add.tween(this.indicator).to({ alpha: 1 }, 400, "Linear", false);
        this.indicateOutTween = game.add.tween(this.indicator).to({ alpha: 0 }, 400, "Linear", false);

        this.score = 10;

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
        this.active = true;
        game.add.existing(this);
    }
    /**
     * @description Sets the weapon system that will be used by this enemy
     * @param _weapons
     */
    public setWeapons(_weapons: Array<Weapon>) {
        this.weapons = _weapons;
    }
    /**
     * @description Executes every frame
     */
    public update() {
        if (this.active) {
            this.moveDir.X = (this.movementPattern[this.currentMove].point.X - this.vectorPosition.X) / 100;
            this.moveDir.Y = (this.movementPattern[this.currentMove].point.Y - this.vectorPosition.Y) / 100;
            this.moveDir.normalize();
            this.vectorPosition.add(new Vector2(this.moveDir.X * this.speed, this.moveDir.Y * this.speed));
            if (Vector2.distance(this.vectorPosition, this.movementPattern[this.currentMove].point) < 1.5) {
                this.currentMove++;
                if (this.currentMove >= this.movementPattern.length) {
                    this.killEnemy(this, 0);
                }
                else {
                    this.angle = this.movementPattern[this.currentMove].rotation;
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
    /**
     * @description Check if the position of this enemy is outside of the level's bounds
     */
    private checkBounds(): boolean {
        return (this.vectorPosition.Y > -64 && this.vectorPosition.Y < 1000 && this.vectorPosition.X > -64 && this.vectorPosition.X < 576)
    }
    /**
     * @description Toggle whether this enemy is a combo target or not
     * @param activate
     */
    public toggleComboTarget(activate: boolean) {
        if (activate == true && this.anim.isFinished == false) {
            this.addChild(this.comboSprite);
            this.anim.play();
        }
        else {
            this.removeChild(this.comboSprite);
        }
    }
    /**
     * @description Display a crosshair over this enemy
     */
    public indicateIn() {
        if (!this.isIndicating) {
            this.indicateInTween.start();
            this.isIndicating = true;
        }
    }
    /**
     * @description Hide the crosshair on this enemy
     */
    public indicateOut() {
        if (this.isIndicating) {
            this.indicateOutTween.start();
            this.isIndicating = false;
        }
    }
}