declare var game: Phaser.Game;

class App {
    constructor() {
        game = new Phaser.Game(512, 910, Phaser.AUTO, 'content', { create: this.create });
        game.stage = new Phaser.Stage(game);
    }

    create() {
        game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;

        game.physics.startSystem(Phaser.Physics.ARCADE); // Start the arcade physics system

        // Add the various states the game goes through
        game.state.add("Preload", Preloader);
        game.state.add("Boot", BootState);
        game.state.add("Menu", MenuState);
        game.state.add("Game", GameState);
        // Start the preload state
        game.state.start("Preload");
    }
}

window.onload = () => {
    var app = new App();
};