class GameState extends Phaser.State
{
    private level: Level;
    private player: Player;
    private playerSprite: Phaser.Sprite;

    create()
    {
        this.player = new Player(this.game);
        this.level = new Level('background');
    }

    update() {
        this.level.update();
    }
}