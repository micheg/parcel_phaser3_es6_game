import Phaser from 'phaser';
import BombSpawner from '../utils/BombSpawner';
import StarsSpawner from '../utils/StarsSpawner';

const GROUND_KEY = 'ground';
const DUDE_KEY = 'dude';
const STAR_KEY = 'star';
const BOMB_KEY = 'bomb';

export default class GameScene extends Phaser.Scene
{
    constructor()
    {
        super('main_game_scene');
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
        this.stars_spawner = new StarsSpawner(this, STAR_KEY);
        this.bomb_spawner = new BombSpawner(this, BOMB_KEY);
        const bombs_group = this.bomb_spawner.group
        this.stars = this.stars_spawner.spawn();
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
    collect_star(player, star)
    {
        star.disableBody(true, true);
        this.events.emit('add.score');
        if (this.stars_spawner.count_active() === 0)
        {
            this.level++;
            this.events.emit('add.level');
            for(let i=0; i< this.level; i++)
            {
                this.bomb_spawner.spawn(player.x);
            }
            this.stars_spawner.re_spawn();
        }
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
