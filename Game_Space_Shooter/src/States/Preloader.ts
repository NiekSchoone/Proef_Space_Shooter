/**
 * @description State that loads all the assets into the cache
 */
class Preloader extends Phaser.State {

    /**
     * @description Loads all assets
     */
    preload() {
        // Images menu
        game.load.image("startscreen_background", "assets/Images/Backgrounds/StartScreen/startscreen_background.jpg");
        game.load.image("startscreen_title", "assets/Images/Backgrounds/StartScreen/startscreen_title.png");
        game.load.image("insert_coin_text", "assets/Images/Backgrounds/StartScreen/startscreen_coin_text.png");

        game.load.image("menu_background", "assets/Images/Backgrounds/background_characterselect.jpg");

        game.load.image("menu_portrait_1", "assets/Images/UI/CharacterSelect/Portraits/portrait_1.png");
        game.load.image("menu_portrait_2", "assets/Images/UI/CharacterSelect/Portraits/portrait_2.png");
        game.load.image("menu_portrait_3", "assets/Images/UI/CharacterSelect/Portraits/portrait_3.png");
        game.load.image("menu_portrait_4", "assets/Images/UI/CharacterSelect/Portraits/portrait_4.png");

        game.load.image("menu_button_start", "assets/Images/UI/CharacterSelect/button_select.png");
        game.load.image("menu_button_arrow", "assets/Images/UI/CharacterSelect/button_arrow.png");
        game.load.image("menu_selection_overlay", "assets/Images/UI/CharacterSelect/selection_overlay.png");
        game.load.image("menu_welcome_bar", "assets/Images/UI/CharacterSelect/welcome_bar.png");
        game.load.image("menu_name_overlay", "assets/Images/UI/CharacterSelect/name_overlay.png");

        // images tutorial
        game.load.image("tutorial_1", "assets/Images/UI/Tutorial/Tutorial1.png");
        game.load.image("tutorial_2", "assets/Images/UI/Tutorial/Tutorial2.png");
        game.load.image("tutorial_3", "assets/Images/UI/Tutorial/Tutorial3.png");
        game.load.image("tutorial_dots", "assets/Images/UI/Tutorial/Dots.png");
        game.load.image("chat_logo", "assets/Images/UI/Tutorial/Chats.png");

        // Images game
        game.load.image("plasma_bullet_player", "assets/Images/Projectiles/bullet_player.png");
        game.load.image("plasma_bullet_enemy", "assets/Images/Projectiles/bullet_enemy.png");
        game.load.image("missile_enemy", "assets/Images/Projectiles/missile_enemy.png");
        game.load.image("missile_player", "assets/Images/Projectiles/missile_player.png");

        game.load.image("ui_overlay", "assets/Images/UI/ui_overlay.png");
        game.load.image("pause_button", "assets/Images/UI/button_pause.png");
        game.load.image("health_bar", "assets/Images/UI/Indicators/health_bar.png");
        game.load.image("target_indicator", "assets/Images/UI/Indicators/crosshair.png");
        game.load.image("combo_section_middle", "assets/Images/UI/Indicators/combo_bar.png");
        game.load.image("combo_section_end", "assets/Images/UI/Indicators/combo_bar_end.png");

        game.load.image("player_hit_overlay", "assets/Images/player_hit_overlay.png");

        game.load.image("gameover_overlay", "assets/Images/UI/GameOver/gameover_overlay.png");
        game.load.image("gameover_insertcoin", "assets/Images/UI/GameOver/gameover_insertcoin.png");

        game.load.image("pickup_repair", "assets/Images/Pickups/pickup_health.png");
        game.load.image("pickup_plasma", "assets/Images/Pickups/pickup_plasma.png");
        game.load.image("pickup_missile", "assets/Images/Pickups/pickup_missile.png");

        // Spritesheets
        game.load.spritesheet("game_background", "assets/Images/Backgrounds/game_background.jpg", 512, 2048, 4);
        game.load.spritesheet("ships_player", "assets/SpriteSheets/Ships/player_ship_sheet.png", 128, 128, 4);
        game.load.spritesheet("ships_enemy_orange", "assets/SpriteSheets/Ships/enemy_ship_sheet_orange.png", 128, 128, 3);
        game.load.spritesheet("ships_enemy_blue", "assets/SpriteSheets/Ships/enemy_ship_sheet_blue.png", 128, 128, 3);
        game.load.spritesheet("ships_enemy_pink", "assets/SpriteSheets/Ships/enemy_ship_sheet_pink.png", 128, 128, 3);
        game.load.spritesheet("missile_hit", "assets/SpriteSheets/Animations/Explosions/hit_missile_explosion.png", 128, 128, 13);
        game.load.spritesheet("player_exhaust", "assets/SpriteSheets/Animations/player_exhaust.png", 32, 64, 5);
        game.load.spritesheet("explosion", "assets/SpriteSheets/Animations/Explosions/death_explosion.png", 256, 256, 24);
        game.load.spritesheet("player_healing", "assets/SpriteSheets/Animations/player_healing.png", 256, 256, 15);
        game.load.spritesheet("player_powerup", "assets/SpriteSheets/Animations/player_powerup.png", 128, 128, 17);

        game.load.spritesheet("character_select_animation", "assets/SpriteSheets/Animations/character_select_animation.png", 512, 256, 30);

        game.load.spritesheet("bullet_hit_blue", "assets/SpriteSheets/Animations/hit_bullet_blue.png", 64, 64, 5);
        game.load.spritesheet("bullet_hit_red", "assets/SpriteSheets/Animations/hit_bullet_red.png", 64, 64, 5);

        game.load.spritesheet("combo_small", "assets/SpriteSheets/Animations/combo_small.png", 256, 192, 12);
        game.load.spritesheet("combo_big", "assets/SpriteSheets/Animations/combo_big.png", 256, 192, 12);
        game.load.spritesheet("indicator", "assets/SpriteSheets/Animations/indicator.png", 256, 256);
        
        // Audio Music
        game.load.audio("music_menu", "assets/Audio/Music/music_menu.mp3");
        game.load.audio("music_game", "assets/Audio/Music/music_game.mp3");

        // Audio SFX
        game.load.audio("button_click", "assets/Audio/SFX/button_click_1.mp3");
        game.load.audio("startscreen_entry", "assets/Audio/SFX/startscreen_entry.mp3");
        game.load.audio("menu_entry", "assets/Audio/SFX/menu_entry.mp3");
        game.load.audio("gameover_entry", "assets/Audio/SFX/gameover_entry.mp3");
        game.load.audio("gameover_exit", "assets/Audio/SFX/gameover_exit.mp3");
        game.load.audio("player_death", "assets/Audio/SFX/ship_explosion_big.mp3");
        game.load.audio("enemy_death_small", "assets/Audio/SFX/electric_explosion_small.mp3");
        game.load.audio("enemy_death_big", "assets/Audio/SFX/electric_explosion_big.mp3");
        game.load.audio("pickup_sound", "assets/Audio/SFX/player_powerup.mp3");
        game.load.audio("select_dia", "assets/Audio/SFX/character_select_dia.mp3");
        game.load.audio("select_hyun", "assets/Audio/SFX/character_select_hyun.mp3");
        game.load.audio("select_kimmy", "assets/Audio/SFX/character_select_kimmy.mp3");
        game.load.audio("select_stacey", "assets/Audio/SFX/character_select_stacey.mp3");

        // JSON
        game.load.tilemap("wave01", "assets/WaveData/wave01.json", null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap("wave02", "assets/WaveData/wave02.json", null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap("wave03", "assets/WaveData/wave03.json", null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap("wave04", "assets/WaveData/wave04.json", null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap("wave05", "assets/WaveData/wave05.json", null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap("wave06", "assets/WaveData/wave06.json", null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap("wave07", "assets/WaveData/wave07.json", null, Phaser.Tilemap.TILED_JSON);
    }

    /**
     * @description Executes after the preload function
     */
    create() {
        menuMusic = game.add.audio("music_menu", 1, true);
        gameMusic = game.add.audio("music_game", 1, true);

        game.state.start("Start");
    }
}