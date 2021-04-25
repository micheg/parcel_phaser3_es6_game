import Phaser from 'phaser';
import ScoreLabel from '../ui/ScoreLabel';
import LevelLabel from '../ui/LevelLabel';

export default class HUDScene extends Phaser.Scene
{
    constructor ()
    {
        super({ key: 'HUDScene', active: true });
        this.level = 0;
        this.score_label = undefined;
        this.level_label = undefined;
    }

    // factory methods
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

    create_ui()
    {
        this.score_label = this.create_score_label(16, 16, 0);
        this.level_label = this.create_level_label(260, 16, 0);
    }
    create ()
    {
        this.create_ui();
        const our_game = this.scene.get('main_game_scene');

        our_game.events.on('add.score', () =>
        {
            this.score_label.add(10);
        }, this);

        our_game.events.on('add.level', () =>
        {
            this.level_label.add(1);
        }, this);
    }
}