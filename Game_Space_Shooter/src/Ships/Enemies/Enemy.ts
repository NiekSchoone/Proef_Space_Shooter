enum EnemyType
{
    FIGHTER,
    BOMBER,
    BOSS
}
class Enemy extends Ship
{
    private enemyType: EnemyType;
    private movementPattern: Vector2[];
    private currentMove: number;
    private moveDir: Vector2;
    private notdead: boolean;
    private currentPosition: Vector2;

    constructor(game: Phaser.Game, type: EnemyType, healthMod: number, speedMod: number, pattern: Vector2[])
    {
        super(game);
        this.x = 200;
        this.y = -200;
        this.moveDir = new Vector2(0,0);
        this.movementPattern = pattern;
        this.notdead = true;
        this.currentPosition = new Vector2(this.x, this.y);
        this.currentMove = 0;
        game.time.events.loop(Phaser.Timer.SECOND * this.fireCooldown, this.shoot, this);
        switch (type) {
            case EnemyType.FIGHTER:
                this.setStats(10 * healthMod, 5 * speedMod);
                this.loadTexture("tempship");
                break;
            case EnemyType.BOMBER:
                this.setStats(20 * healthMod, 2 * speedMod);
                this.loadTexture("tempship");
                break;
            case EnemyType.BOSS:
                this.setStats(100 * healthMod, 5 * speedMod);
                this.loadTexture("tempship");
                break;
        }
        this.game.add.existing(this);
        this.scale.set(0.25);
        this.anchor.set(0.5);
        this.angle = 180;
    }
    
    public update() {
        if (this.notdead) {
            this.moveDir.X = (this.movementPattern[this.currentMove].X - this.x) / 100;
            this.moveDir.Y = (this.movementPattern[this.currentMove].Y - this.y) / 100;
            this.moveDir.normalize();
            this.x += this.moveDir.X * this.speed;
            this.y += this.moveDir.Y * this.speed;

            this.currentPosition.X = this.x;
            this.currentPosition.Y = this.y;

            if (Vector2.distance(this.currentPosition, this.movementPattern[this.currentMove]) < 1) {
                this.currentMove++;
                if (this.currentMove == this.movementPattern.length) {

                    this.die();
                }
            }
        }
    }
    private shoot()
    {
        if (this.notdead)
        {

        }
    }
    private setStats(health: number, speed: number) {
        this.health = health;
        this.speed = speed;
    }
    protected die() {
        
        this.notdead = false;
    }

}