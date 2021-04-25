import Phaser from 'phaser';
import ScoreLabel from '../ui/ScoreLabel';
import LevelLabel from '../ui/LevelLabel';
import BombSpawner from '../utils/BombSpawner';

const GROUND_KEY = 'ground';
const DUDE_KEY = 'dude';
const STAR_KEY = 'star';
const BOMB_KEY = 'bomb';

export default class GameScene extends Phaser.Scene
{
	constructor()
	{
	    super('game-scene');
        this.player = undefined;
		this.cursors = undefined;
        this.score_label = undefined;
        this.bomb_spawner = undefined;
        this.stars = undefined;
        this.game_over = false
        this.level = 0;
	}
	preload()
    {
		this.load.image('sky', 'assets/sky.png');
		this.load.image(GROUND_KEY, 'assets/platform.png');
		this.load.image(STAR_KEY, 'assets/star.png');
		this.load.image(BOMB_KEY, 'assets/bomb.png');

		this.load.spritesheet(DUDE_KEY, 
			'assets/dude.png',
			{ frameWidth: 32, frameHeight: 48 }
		);
    }
    create()
    {
        //this.camera = this.cameras.main;
        //this.physics.world.setBounds(0,0,1000,1000);
        //this.camera.setBounds(0, 0, 1000, 1000);
        this.add.image(400, 300, 'sky');
        const platforms = this.create_platforms()
        this.player = this.create_player();
        //this.camera.startFollow(this.player, true, 0.5, 0.5, 100,100);
        this.stars = this.create_stars();
        this.score_label = this.create_score_label(16, 16, 0);
        this.level_label = this.create_level_label(260, 16, 0);
        this.bomb_spawner = new BombSpawner(this, BOMB_KEY);
        const bombs_group = this.bomb_spawner.group
        // colliders
		this.physics.add.collider(this.player, platforms);
		this.physics.add.collider(this.stars, platforms);
        this.physics.add.collider(bombs_group, platforms);
		this.physics.add.collider(this.player, bombs_group, this.hit_bomb, null, this);
        // player, object, callback, additional callback, scope
        this.physics.add.overlap(this.player, this.stars, this.collect_star, null, this);
        // keyboards
		this.cursors = this.input.keyboard.createCursorKeys();
        this.cameras.main.setZoom(1);
    }
    update()
    {
        if (this.game_over)
		{
			return
		}
		if (this.cursors.left.isDown)
		{
            this.player.setVelocityX(-160);
			this.player.anims.play('left', true);
		}
		else if (this.cursors.right.isDown)
		{
			this.player.setVelocityX(160);
			this.player.anims.play('right', true);
		}
		else
		{
			this.player.setVelocityX(0);
			this.player.anims.play('turn');
		}
		//if (this.cursors.up.isDown && this.player.body.touching.down)
        if (this.cursors.up.isDown && this.player.body.onFloor())
		{
			this.player.setVelocityY(-500);
		}
    }
    create_platforms()
    {
		const platforms = this.physics.add.staticGroup();
		platforms.create(400, 568, GROUND_KEY).setScale(2).refreshBody();
		platforms.create(600, 400, GROUND_KEY);
		platforms.create(50, 250, GROUND_KEY);
		platforms.create(750, 220, GROUND_KEY);
        return platforms;
    }
    create_player()
    {
        const player = this.physics.add.sprite(100, 450, DUDE_KEY);
		player.setBounce(0.2);
		player.setCollideWorldBounds(true);

		this.anims.create(
        {
			key: 'left',
			frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 0, end: 3 }),
			frameRate: 10,
			repeat: -1
		});
		
		this.anims.create(
        {
			key: 'turn',
			frames: [ { key: DUDE_KEY, frame: 4 } ],
			frameRate: 20
		});
		
		this.anims.create(
        {
			key: 'right',
			frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 5, end: 8 }),
			frameRate: 10,
			repeat: -1
		});
        return player;
    }
    create_stars()
    {
		const stars = this.physics.add.group(
        {
			key: STAR_KEY,
			repeat: 11,
			setXY: { x: 12, y: 0, stepX: 70 }
		});
		stars.children.iterate((child) =>
        {
			child.setBounceY(Phaser.Math.FloatBetween(0.5, 0.9));
		});
		return stars
    }
    collect_star(player, star)
    {
        star.disableBody(true, true);
        this.score_label.add(10);
        if (this.stars.countActive(true) === 0)
		{
            this.level++;
            this.level_label.add(1);
            for(let i=0; i< this.level; i++)
            {
                this.bomb_spawner.spawn(player.x);
            }
			//  A new batch of stars to collect
			this.stars.children.iterate((child) =>
            {
				child.enableBody(true, child.x, 0, true, true)
			});
		}
    }
    create_score_label(x, y, score)
    {
        const style = { fontSize: '32px', fill: '#000' };
		const label = new ScoreLabel(this, x, y, score, style);
		this.add.existing(label);
		return label;
    }
    create_level_label(x, y, level)
    {
        console.log("cl => " + x + y + level);
        const style = { fontSize: '32px', fill: '#000' };
		const label = new LevelLabel(this, x, y, level, style);
		this.add.existing(label);
		return label;
    }
    hit_bomb(player, bomb)
    {
        this.physics.pause();
		player.setTint(0xff0000);
		player.anims.play('turn');
        player.setFlip(true, true);
		this.game_over = true;
    }
}
