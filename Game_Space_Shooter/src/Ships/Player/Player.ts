/// <reference path="../Ship.ts"/>
class Player extends Ship
{
    private mouseDown: boolean;

    constructor(game: Phaser.Game)
    {
        super(game);

        this.loadTexture("tempship");
        this.game.add.existing(this);
        this.speed = 10;

        this.scale.set(0.25);
        this.anchor.set(0.5);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.enable(this);
    }

    update()
    {
        if (this.game.input.mousePointer.isDown)
        {
            var dirx = (this.game.input.x - this.x) / 100;
            var diry = (this.game.input.y - this.y) / 100;

            this.x += dirx * this.speed;
            this.y += diry * this.speed;
        }
    }
                                  
}