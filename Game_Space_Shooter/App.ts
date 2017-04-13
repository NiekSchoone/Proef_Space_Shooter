declare var game: Phaser.Game;

class App {

    constructor() {
        game = new Phaser.Game(512, 910, Phaser.AUTO, 'content', { create: this.create });
        game.stage = new Phaser.Stage(game);
    }

    create() {
        this.game.state.add("Preload", Preloader);
        this.game.state.add("Game", GameState);
        this.game.state.start("Preload");
    }
}

window.onload = () => {
    var greeter = new App();
};