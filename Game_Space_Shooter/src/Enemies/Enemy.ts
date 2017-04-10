enum EnemyType
{
}
class Enemy extends Ship
{
    private direction: Vector2;
    private enemyType: EnemyType;

    constructor(game: Phaser.Game, healthMod: number, speedMod: number)
    {
        super(game);
    }

    

}