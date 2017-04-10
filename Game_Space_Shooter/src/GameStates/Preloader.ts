class Preloader extends Phaser.State {
    preload() {
        this.game.load.image("tempship", "assets/Images/Placeholders/alienspaceship.png");
    }

    create()
    {
        this.game.state.start("Game");
    }
}