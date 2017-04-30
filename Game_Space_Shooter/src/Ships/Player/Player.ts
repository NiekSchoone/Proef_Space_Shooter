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
        this.loadTexture("ships_player", 3);
        this.speed = 10;
        this.anchor.set(0.5);
        game.add.existing(this);
        game.physics.arcade.enable(this);
        this.moveDir = new Vector2();
        this.enemies = new Array<Enemy>();
        this.fireAngle = 0;
    }

    public update() {
        // When a mouse pointer or touch pointer is down on the screen, get get the position and calculate a move direction
        if (game.input.pointer1.isDown || game.input.mousePointer.isDown) {
            this.moveDir.X = (game.input.x - this.vectorPosition.X) / 100;
            this.moveDir.Y = (game.input.y - this.vectorPosition.Y) / 100;
            this.vectorPosition.add(new Vector2(this.moveDir.X * this.speed, this.moveDir.Y * this.speed));
        }
        super.update();
    }

    // Set targets that the player's weapon can hit
    public setTargets(_targets: Array<Enemy>) {
        this.enemies = _targets;
        this.addWeapon(0.35, this.projectilePools[0], this.enemies); // Create a weapon for the player
        this.addWeapon(0.35, this.projectilePools[0], this.enemies);
    }
}