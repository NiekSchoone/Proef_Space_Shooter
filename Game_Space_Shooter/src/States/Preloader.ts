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
        game.load.image("plasma_bullet_player", "assets/Images/Projectiles/bullet_player.png");
        game.load.image("plasma_bullet_enemy", "assets/Images/Projectiles/bullet_enemy.png");

        game.load.image("ui_overlay", "assets/Images/UI/ui_overlay.png");
        game.load.image("health_bar", "assets/Images/UI/Indicators/health_bar.png");

        game.load.image("pickup_repair", "assets/Images/Pickups/pickup_health.png");
        game.load.image("pickup_plasma", "assets/Images/Pickups/pickup_plasma.png");
        game.load.image("pickup_missile", "assets/Images/Pickups/pickup_missile.png");

        // Spritesheets
        game.load.spritesheet("game_background", "assets/Images/Backgrounds/game_background.jpg", 512, 2048, 4);
        game.load.spritesheet("ships_player", "assets/SpriteSheets/Ships/player_ship_sheet.png", 128, 128, 4);
        game.load.spritesheet("ships_enemy_orange", "assets/SpriteSheets/Ships/enemy_ship_sheet_orange.png", 128, 128, 3);
        game.load.spritesheet("ships_enemy_blue", "assets/SpriteSheets/Ships/enemy_ship_sheet_blue.png", 128, 128, 3);
        game.load.spritesheet("ships_enemy_pink", "assets/SpriteSheets/Ships/enemy_ship_sheet_pink.png", 128, 128, 3);
        game.load.spritesheet("missile", "assets/SpriteSheets/Animations/projectile_missile.png", 64, 64, 22);
        game.load.spritesheet("player_exhaust", "assets/SpriteSheets/Animations/player_exhaust.png", 32, 64, 5);
        game.load.spritesheet("explosion", "assets/SpriteSheets/Animations/Explosions/death_explosion.png", 256, 256, 24);
        game.load.spritesheet("missile_hit", "assets/SpriteSheets/Animations/Explosions/hit_missile_explosion.png", 128, 128, 13);

        game.load.spritesheet("bullet_hit_blue", "assets/SpriteSheets/Animations/hit_bullet_blue.png", 64, 64, 5);
        game.load.spritesheet("bullet_hit_red", "assets/SpriteSheets/Animations/hit_bullet_red.png", 64, 64, 5);

        game.load.spritesheet("combo02", "assets/SpriteSheets/Animations/combo02.png", 256, 192, 12);
        game.load.spritesheet("indicator", "assets/SpriteSheets/Animations/indicator.png", 256, 256);
        
        // Audio
        game.load.audio("music_menu", "assets/Audio/music_menu.mp3");

        // JSON
        game.load.tilemap("wave01", "assets/WaveData/wave01.json", null, Phaser.Tilemap.TILED_JSON)
        game.load.tilemap("wave02", "assets/WaveData/wave02.json", null, Phaser.Tilemap.TILED_JSON)
        game.load.tilemap("wave03", "assets/WaveData/wave03.json", null, Phaser.Tilemap.TILED_JSON)
        game.load.tilemap("wave04", "assets/WaveData/wave04.json", null, Phaser.Tilemap.TILED_JSON)
        game.load.tilemap("wave05", "assets/WaveData/wave05.json", null, Phaser.Tilemap.TILED_JSON)
    }

    // After the preload function is done, the create function is called which starts the GameState
    create() {

        menuMusic = game.add.audio("music_menu", 1, true);
        //gameMusic = game.add.audio("music_game", 1, true);

        game.state.start("Start");
    }
}