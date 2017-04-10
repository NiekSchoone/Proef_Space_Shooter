class Ship extends Phaser.Sprite
{
    public health: number;
    public speed: number;

    constructor(game: Phaser.Game)
    {
        super(game, 0, 0);
        this.game = game;
    }
}