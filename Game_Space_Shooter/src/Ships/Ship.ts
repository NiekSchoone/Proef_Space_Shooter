class Ship extends Phaser.Sprite
{
    public health: number;
    public speed: number;
    public pos: Vector2;
    public collisionRadius: number;
    public fireCooldown: number;

    constructor(game: Phaser.Game)
    {
        super(game, 0, 0);
        this.game = game;
    }

    public die()
    {

    }

    public fire()
    {

=======
    public onHit(amount: number) {
        this.health -= amount;
        if (this.health <= 0) {
            this.die();
        }
    }
    private die() {
        //this.destroy();
>>>>>>> ec05dd27e1efa22f2b87470b7056df56c0073940
    }
}