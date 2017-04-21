class Player extends Ship
{
    private mouseDown: boolean;
    private moveDir: Vector2;
    private projPool: ProjectilePool;
    private enemies: Enemy[];
    projectilePools: ProjectilePool[]

    constructor(_projectilePools: ProjectilePool[], _collisionRadius: number)
    {
        super(_collisionRadius);
        this.projectilePools = _projectilePools;
        this.loadTexture("ship_player");
        this.game.add.existing(this);
        this.speed = 10;
        this.anchor.set(0.5);
        
        game.physics.arcade.enable(this);
        this.moveDir = new Vector2();
        
    }

    public update()
    {
        if (this.game.input.mousePointer.isDown)
        {
            this.moveDir.X = (this.game.input.x - this.x) / 100;
            this.moveDir.Y = (this.game.input.y - this.y) / 100;
            this.vectorPosition.X += this.moveDir.X * this.speed;
            this.vectorPosition.Y += this.moveDir.Y * this.speed;
        }
        super.update();
    }

    public setTargets(_enemies : Enemy[])
    {
        this.enemies = _enemies;
    }
}