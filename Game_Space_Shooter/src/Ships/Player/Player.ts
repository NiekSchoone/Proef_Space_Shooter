class Player extends Ship
{
    private mouseDown: boolean;
    private moveDir: Vector2;
    private enemies: Array<Enemy>;
    private projectilePools: ProjectilePool[]

    constructor(_projectilePools: ProjectilePool[], _collisionRadius: number)
    {
        super(_collisionRadius);
        this.projectilePools = _projectilePools;
        this.loadTexture("ship_player");
        this.speed = 10;
        this.anchor.set(0.5);
        game.add.existing(this);
        game.physics.arcade.enable(this);
        this.moveDir = new Vector2();
        this.enemies = new Array<Enemy>();

        this.fireAngle = 0;
    }

    public update() {
        if (game.input.mousePointer.isDown) {
            this.moveDir.X = (game.input.x - this.vectorPosition.X) / 100;
            this.moveDir.Y = (game.input.y - this.vectorPosition.Y) / 100;
            this.vectorPosition.add(new Vector2(this.moveDir.X * this.speed, this.moveDir.Y * this.speed));
        }
        super.update();
    }

    public setTargets(_enemies: Array<Enemy>) {
        this.enemies = _enemies;
        this.addWeapon(0.4, this.projectilePools[0], this.enemies);
    }
}