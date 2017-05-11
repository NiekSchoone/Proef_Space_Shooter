class Preloader extends Phaser.State {

    // Preload all assets
    preload() {

        // Images menu
        game.load.image("startscreen_background", "assets/Images/Backgrounds/StartScreen/startscreen_background.jpg");
        game.load.image("startscreen_title", "assets/Images/Backgrounds/StartScreen/startscreen_title.png");
        game.load.image("insert_coin_text", "assets/Images/Backgrounds/StartScreen/startscreen_coin_text.png");

        game.load.image("menu_background", "assets/Images/Backgrounds/menu_background.jpg");

        game.load.image("menu_portrait_1", "assets/Images/UI/Portraits/portrait_1.png");
        game.load.image("menu_portrait_2", "assets/Images/UI/Portraits/portrait_2.png");
        game.load.image("menu_portrait_3", "assets/Images/UI/Portraits/portrait_3.png");
        game.load.image("menu_portrait_4", "assets/Images/UI/Portraits/portrait_4.png");

        game.load.image("menu_button_start", "assets/Images/UI/Buttons/button_start.png");
        game.load.image("menu_button_arrow", "assets/Images/UI/Buttons/button_arrow.png");

        // Images game
        game.load.image("plasma_bullet", "assets/Images/Projectiles/bullet.png");
        game.load.image("ship_enemy", "assets/Images/Placeholders/ship_enemy.png");

        game.load.image("health_circle", "assets/Images/UI/Indicators/health_circle.png");
        game.load.image("health_bar", "assets/Images/UI/Indicators/health_bar.png");

        // Spritesheets
        game.load.spritesheet("game_background", "assets/Images/Backgrounds/game_background_001.png", 512, 2048, 4);

        game.load.spritesheet("ships_player", "assets/SpriteSheets/player_ship_sheet.png", 128, 128, 4);

        game.load.spritesheet("missile", "assets/SpriteSheets/Animations/projectile_missile.png", 64, 64, 22);

        game.load.spritesheet("explosion", "assets/SpriteSheets/Animations/Explosions/death_explosion.png", 256, 256, 24);
        game.load.spritesheet("missile_hit", "assets/SpriteSheets/Animations/Explosions/hit_missile_explosion.png", 128, 128, 12);

        // Audio

    }

    // After the preload function is done, the create function is called which starts the GameState
    create() {
        game.state.start("Game");
    }
}