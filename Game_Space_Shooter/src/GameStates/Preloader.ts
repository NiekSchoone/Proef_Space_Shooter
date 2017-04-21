class Preloader extends Phaser.State {

    // Preload all assets
    preload() {

        // Images
        game.load.image("background", "assets/Images/background_001.png");
        game.load.image("plasma_bullet", "assets/Images/Placeholders/bullet.png");
        game.load.image("ship_enemy", "assets/Images/Placeholders/ship_enemy.png");

        // Spritesheets
        game.load.spritesheet("ships_player", "assets/SpriteSheets/player_ship_sheet.png", 128, 128, 4);

        // Audio
    }

    // After the preload function is done, the create function is called which starts the GameState
    create() {
        game.state.start("Game");
    }
}