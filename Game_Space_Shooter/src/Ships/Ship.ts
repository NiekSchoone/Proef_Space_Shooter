class Ship extends Phaser.Sprite
{
    public health: number;
    public speed: number;

    constructor(game: Phaser.Game)
    {
        super(game, 0, 0);
        this.game = game;
    }
    public onHit(amount: number) {
        this.health -= amount;
        if (this.health <= 0) {
            this.die();
        }
    }
    private die() {
        //this.destroy();
    }
}