declare var game: Phaser.Game;

class App {

    constructor() {
        game = new Phaser.Game(512, 910, Phaser.AUTO, 'content', { create: this.create });
        game.stage = new Phaser.Stage(game);
    }

    private create() {
        game.state.add("Preload", Preloader);
        game.state.add("Game", GameState);

        game.state.start("Preload");
    }

    private initStates()
    {
    }
}

window.onload = () => {
    var greeter = new App();
};