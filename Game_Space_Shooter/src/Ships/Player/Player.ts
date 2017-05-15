class Player extends Ship
{
    private mouseDown: boolean;
    private moveDir: Vector2;
    private enemies: Array<Enemy>;
    private projectilePools: ProjectilePool[]
    private comboMode: boolean = false;
    private targetEnemies: Enemy[];
    private targetIDs: Array<number>;
    private graphics: Phaser.Graphics;
    private slowMo: boolean = false;

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
        this.shooting = true;
    }

    public handlePickup(type: PickupType)
    {

    }

    // Check's if the pointer is colliding with an enemy. 
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
                // If there's no duplicate add it to the target array. 
                if (noDuplicate == true)
                {
                    this.targetEnemies.push(this.checkCollision());
                    this.checkCollision().toggleComboTarget();
                }
            }
            else
            {
                // If it's the first target skip checking duplicates. 
                this.targetEnemies.push(this.checkCollision());
                this.checkCollision().toggleComboTarget();
                this.comboMode = true;
            }
        }

        // Handle slowmotion inputs.
        if (game.input.mousePointer.isDown && this.comboMode == false)
        {
            this.reverseSlowmo();
        }
        else if (game.input.mousePointer.isDown == false)
        {
            this.smoothSlowmo();
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

                        if (this.targetEnemies[i - 1] != null)
                        {
                            this.graphics = game.add.graphics(this.targetEnemies[i - 1].vectorPosition.X, this.targetEnemies[i - 1].vectorPosition.Y);
                            this.graphics.lineStyle(15, 0xff0000, 0.6);
                            this.graphics.lineTo(this.targetEnemies[i].vectorPosition.X - this.targetEnemies[i - 1].vectorPosition.X, this.targetEnemies[i].vectorPosition.Y - this.targetEnemies[i - 1].vectorPosition.Y);
                            game.add.tween(this.graphics).to({ alpha: 0 }, 350, Phaser.Easing.Linear.None, true);
                        }
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
    public setTargets(_targets: Array<Enemy>)
    {
        this.enemies = _targets;
        this.addWeapon(0.80, this.projectilePools[1], this.enemies);
    }

    // Smoothly slowdown time. 
    private smoothSlowmo()
    {
        if (this.slowMo == false)
        {
            if (game.time.slowMotion < 1.5)
            {
                game.time.slowMotion += 0.0125;
                game.time.events.add(200, this.smoothSlowmo, this);
            }
            else if (game.time.slowMotion > 1.5)
            {
                game.time.slowMotion = 1.5;
                this.slowMo = true;
            }
        }

    }

    // Smoothly reverts time back to normal.
    private reverseSlowmo()
    {
        if (this.slowMo == true)
        {
            if (this.game.time.slowMotion > 1.0)
            {
                game.time.slowMotion -= 0.05;
                game.time.events.add(200, this.reverseSlowmo, this);
            }
            else if (game.time.slowMotion < 1.0)
            {
                game.time.slowMotion = 1.0;
                this.slowMo = false;
            }
        }
    }
}
