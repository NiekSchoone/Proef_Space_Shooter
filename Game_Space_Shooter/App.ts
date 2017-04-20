declare var game: Phaser.Game;

class App {
    constructor() {
        game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', { create: this.create });
        game.stage = new Phaser.Stage(game);
    }

    create() {
        game.state.add("Preload", Preloader);
        game.state.add("Game", GameState);
        game.state.start("Preload");
    }

    initStates()
    {
        game.state.add("Preload", Preloader);
        game.state.add("Game", GameState);
        game.state.start("Preload");
    }
}

window.onload = () => {
    var app = new App();
};