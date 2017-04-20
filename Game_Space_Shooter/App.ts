declare var game: Phaser.Game;

class App {

    constructor() {
        game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', { create: this.create });
        game.stage = new Phaser.Stage(game);
    }

    create() {
        //this.initStates();
        game.state.add("Preload", Preloader);
        game.state.add("Game", GameState);
        game.state.start("Preload");
        //this.game.state.add("Game", GameState);
    }

    initStates()
    {
    }
}

window.onload = () => {
    var greeter = new App();
};