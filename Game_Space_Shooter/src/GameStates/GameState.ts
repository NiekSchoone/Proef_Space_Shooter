class GameState extends Phaser.State {
    private player: Player;
    private level: Level;
    private playerSprite: Phaser.Sprite;

    create() {
        this.level = new Level('background');
        this.player = new Player(game);
    }

    update() {
        this.level.update();
    }
}