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

    }
}