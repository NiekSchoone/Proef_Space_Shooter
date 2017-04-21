class Player extends Ship
{
    private mouseDown: boolean;
    private moveDir: Vector2;
    private projPool: ProjectilePool;

    constructor(projectilePool : ProjectilePool)
    {
        super();
        this.projPool = projectilePool;
        this.loadTexture("ship_player");
        this.game.add.existing(this);
        this.speed = 10;

        this.anchor.set(0.5);
        
        game.physics.arcade.enable(this);
        this.moveDir = new Vector2();
        let newWeapon = new Weapon(0.1, this.projPool);
        this.addWeapon(newWeapon);
    }

    public update()
    {
        if (this.game.input.mousePointer.isDown)
        {
            this.moveDir.X = (this.game.input.x - this.x) / 100;
            this.moveDir.Y = (this.game.input.y - this.y) / 100;
            this.x += this.moveDir.X * this.speed;
            this.y += this.moveDir.Y * this.speed;
        }
        super.update();
    }
                                  
}