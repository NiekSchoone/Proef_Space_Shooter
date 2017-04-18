class GameState extends Phaser.State
{
    private player: Player;
    private playerSprite: Phaser.Sprite;

    create()
    {
        this.player = new Player(this.game);
    }

}