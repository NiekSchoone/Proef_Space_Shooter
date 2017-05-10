class Player extends Ship
{
    private mouseDown: boolean;
    private moveDir: Vector2;
    private enemies: Array<Enemy>;
    private projectilePools: ProjectilePool[]
    private comboMode: boolean = false;
    private targetEnemies: Enemy[];
    private targetIDs: Array<number>;

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
        this.targetEnemies = new Array<Enemy>();
        this.targetIDs = new Array<number>();
        this.fireAngle = 0;
        this.vectorPosition.X = 200;
        this.vectorPosition.Y = 500;
    }

    public handlePickup(type: PickupType)
    {

    }

    private checkCollision()
    {
        if (this.enemies != null)
        {
            for (let i = 0; i < this.enemies.length; i++)
            {
                let distance = Vector2.distance(new Vector2(game.input.mousePointer.position.x, game.input.mousePointer.position.y), this.enemies[i].vectorPosition);

                if (distance < this.enemies[i].collisionRadius)
                {
                    return this.enemies[i];
                }
            }
        }
    }

    public update()
    {
        // If mouse goes down on top of an enemy
        if (this.checkCollision() != null && game.input.mousePointer.isDown)
        {
            // Check if there's already targets
            if (this.targetEnemies.length != 0)
            {
                let noDuplicate: boolean = true;

                // Loop through all target enemies and check if duplicate.
                for (var i = 0; i < this.targetEnemies.length; i++)
                {  
                    if (this.checkCollision().id == this.targetEnemies[i].id)
                    {
                        noDuplicate = false;            
                    }
                }
                // If there's no duplicate add it to tha target array. 
                if (noDuplicate == true)
                {
                    this.targetEnemies.push(this.checkCollision());
                }
            }
            else
            {
                // If it's the first target skip checking duplicates. 
                this.targetEnemies.push(this.checkCollision());
                
                this.comboMode = true;
            }
        }

        // When button is released.
        if (this.comboMode == true && game.input.mousePointer.isDown == false)
        {
            this.comboMode = false;
            // Check if more than one enemy is selected. 
            if (this.targetEnemies.length > 1)
            {
                // Loop through the enemies and kill them
                for (var i = 0; i <= this.targetEnemies.length; i++)
                {
                    if (this.targetEnemies[i] != null)
                    {
                        this.targetEnemies[i].onHit(666);       
                    }
                }
            }
            // Empty the target array.
            for (var i = 0; i <= this.targetEnemies.length; i++)
            {
                this.targetEnemies.splice(i);
            }
            
        }

        // When a mouse pointer or touch pointer is down on the screen, get get the position and calculate a move direction
        if (game.input.pointer1.isDown || game.input.mousePointer.isDown && this.comboMode == false)
        {
            this.moveDir.X = (game.input.x - this.vectorPosition.X) / 100;
            this.moveDir.Y = (game.input.y - this.vectorPosition.Y) / 100;
            this.vectorPosition.add(new Vector2(this.moveDir.X * this.speed, this.moveDir.Y * this.speed));
        }
        super.update();
    }

    // Set targets that the player's weapon can hit
    public setTargets(_targets: Array<Enemy>) {
        this.enemies = _targets;
        this.addWeapon(1, this.projectilePools[0], this.enemies);
    }
}                       