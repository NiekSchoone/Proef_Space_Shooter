/// <reference path="../Ship.ts"/>
class Player extends Ship
{
    private mouseDown: boolean;
    private moveDir : Vector2;

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
        this.moveDir = new Vector2();
    }

    update()
    {
        if (this.game.input.mousePointer.isDown)
        {
            this.moveDir.X = (this.game.input.x - this.x) / 100;
            this.moveDir.Y = (this.game.input.y - this.y) / 100;
            this.x += this.moveDir.X * this.speed;
            this.y += this.moveDir.Y * this.speed;
        }
    }
                                  
}