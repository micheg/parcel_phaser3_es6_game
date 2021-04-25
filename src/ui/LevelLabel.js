import Phaser from 'phaser'

const format_level = (level) => `Level: ${level}`;

export default class LevelLabel extends Phaser.GameObjects.Text
{
	constructor(scene, x, y, level, style)
	{
		super(scene, x, y, format_level(level), style);
		this.level = level;
	}

	setScore(level)
	{
		this.level  = level
		this.updateScoreText();
	}

	add(level)
	{
		this.setScore(this.level + level);
	}

	updateScoreText()
	{
		this.setText(format_level(this.level));
	}
}
