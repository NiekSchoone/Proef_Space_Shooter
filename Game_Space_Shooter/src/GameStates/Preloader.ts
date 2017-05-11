class Preloader extends Phaser.State {

    // Preload all assets
    preload() {

        // Images menu
        game.load.image("menu_background", "assets/Images/Backgrounds/menu_background.jpg");

        game.load.image("menu_portrait_1", "assets/Images/UI/Portraits/portrait_1.png");
        game.load.image("menu_portrait_2", "assets/Images/UI/Portraits/portrait_2.png");
        game.load.image("menu_portrait_3", "assets/Images/UI/Portraits/portrait_3.png");
        game.load.image("menu_portrait_4", "assets/Images/UI/Portraits/portrait_4.png");

        game.load.image("menu_button_start", "assets/Images/UI/Buttons/button_start.png");
        game.load.image("menu_button_arrow", "assets/Images/UI/Buttons/button_arrow.png");

        // Images game
        game.load.image("plasma_bullet", "assets/Images/Placeholders/bullet.png");
        game.load.image("ship_enemy", "assets/Images/Placeholders/ship_enemy.png");

        // Spritesheets
        game.load.spritesheet("game_background", "assets/Images/Backgrounds/game_background_001.png", 512, 2048, 4);

        game.load.spritesheet("ships_player", "assets/SpriteSheets/player_ship_sheet.png", 128, 128, 4);
        game.load.spritesheet("explosion", "assets/SpriteSheets/Animations/explosion.png", 256, 256, 24);
        game.load.spritesheet("combo02", "assets/SpriteSheets/Animations/combo02.png", 256, 192, 12);
        game.load.spritesheet("indicator", "assets/SpriteSheets/Animations/Indicator.png", 256, 256);
        

        // Audio

    }

    // After the preload function is done, the create function is called which starts the GameState
    create() {
        game.state.start("Menu");
    }
}