class Preloader extends Phaser.State {
    preload() {

    }

    create()
    {
        this.game.state.start("Game");
    }
}