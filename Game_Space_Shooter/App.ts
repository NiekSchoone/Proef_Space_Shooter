class App {

    private game: Phaser.Game;

    constructor() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', { create: this.create });
        this.game.stage = new Phaser.Stage(this.game);
    }

    create() {
        //this.initStates();
        this.game.state.add("Preload", Preloader);
        this.game.state.add("Game", GameState);
        this.game.state.start("Preload");
        //this.game.state.add("Game", GameState);
    }

    initStates()
    {
    }
}

window.onload = () => {
    var greeter = new App();
};