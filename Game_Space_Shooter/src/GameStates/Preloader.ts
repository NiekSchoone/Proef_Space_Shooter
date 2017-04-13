class Preloader extends Phaser.State {
    preload() {
        game.load.spritesheet('background', 'assets/Images/background_002.jpg', 512, 2048, 4);
    }

    create()
    {
        this.game.state.start("Game");
    }
}