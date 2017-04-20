class Ship extends Phaser.Sprite
{
    public health: number;
    public speed: number;
    public vectorPosition: Vector2;
    public collisionRadius: number;
    private weapons: Array<Weapon>;

    constructor(game: Phaser.Game)
    {
        super(game, 0, 0);
        this.game = game;
        this.weapons = new Array<Weapon>();
    }

    public onHit(amount: number) {
        this.health -= amount;
        if (this.health <= 0) {
            this.die();
        }
    }
    public addWeapon(weapon: Weapon) {
        this.weapons.push(weapon);
    }
    public update() {
        for (let i = 0; i < this.weapons.length; i++) {
            let currentPosition: Vector2 = new Vector2(this.x, this.y);
            this.weapons[i].position = currentPosition;
            this.weapons[i].angle = this.angle;
            this.weapons[i].update();
        }
    }
    protected die() {
        //this.destroy();
    }
}