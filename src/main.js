import Phaser from 'phaser';

import GameScene from './scenes/GameScene';
import HUDScene from './scenes/HUDScene';

const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 600 }
		}
	},
	scene: [GameScene, HUDScene]
}

export default new Phaser.Game(config)
