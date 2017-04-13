class Preloader extends Phaser.State {
    preload() {
        game.load.spritesheet('background', 'assets/Images/background_002.jpg', 512, 2048, 4);
        game.load.image("tempship", "assets/Images/Placeholders/alienspaceship.png");
    }

    create()
    {
        this.game.state.start("Game");
    }
}