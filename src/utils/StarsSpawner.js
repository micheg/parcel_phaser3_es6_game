import Phaser from 'phaser'

export default class BombSpawner
{
    constructor(scene, star_key = 'star')
    {
        this.scene = scene;
        this.key = star_key;
        this._group = undefined;
    }

    get group()
    {
        return this._group;
    }
    
    spawn()
    {
        const stars = this.scene.physics.add.group(
        {
            key: this.key,
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });
        stars.children.iterate((child) =>
        {
            child.setBounceY(Phaser.Math.FloatBetween(0.5, 0.9));
        });
        //return stars
        this._group = stars;
        return stars;
    }

    count_active()
    {
        return this._group.countActive(true);
    }

    re_spawn()
    {
        this._group.children.iterate((child) =>
        {
            child.enableBody(true, child.x, 0, true, true)
        });
    }
}