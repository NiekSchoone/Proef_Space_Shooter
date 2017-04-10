class Player extends Phaser.Sprite
{
    public PlayerSprite: Phaser.Sprite;
    private mouseDown: boolean;

    constructor(game : Phaser.Game)
    {
        super(game, 0, 0, "tempship");
        this.game.add.existing(this);
        this.game = game;
        this.PlayerSprite = this.PlayerSprite;

        this.scale.set(0.25);
        this.anchor.set(0.5);
    }

    update()
    {
        this.x = this.game.input.x;
        this.y = this.game.input.y;
    }







}