import { Scene } from 'phaser';

const TILESIZE = 32;
const GAME_TILES_WIDTH = 30;
const GAME_TILES_HEIGHT = 20;
const GAME_WIDTH = TILESIZE * GAME_TILES_WIDTH;
const GAME_HEIGHT = TILESIZE * GAME_TILES_HEIGHT;

export class Game extends Scene {
    player!: Phaser.Physics.Arcade.Sprite;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor() {
        super('Game');
    }

    preload() {
        this.loadAssets();
    }

    create() {
        this.setupWorldBounds();
        this.createTilemap();
        this.createPlayer();
        this.setupCamera();
        this.setupInput();
        this.createAnimations();
    }

    update() {
        this.handlePlayerMovement();

        this.input.keyboard?.on("keydown-B", () => {
        this.scene.start("BattleScene");
    });

    }

    private loadAssets() {
        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 48, frameHeight: 48 });
        this.load.image('grasstiles', 'assets/tilesets/grass.png');
        this.load.image('groundtiles', 'assets/tilesets/ground.png');
        this.load.tilemapTiledJSON('map', 'assets/tilemaps/ground.json');
    }

    private setupWorldBounds() {
        this.physics.world.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT);
    }

    private createTilemap() {
        try {
            const map = this.make.tilemap({ key: 'map' });

            const grass = map.addTilesetImage('grass', 'grasstiles', 32, 32);
            if (!grass) throw new Error('Failed to load tileset');

            const ground = map.addTilesetImage('ground', 'groundtiles', 32, 32);
            if (!ground) throw new Error('Failed to load tileset');

            const grassLayer = map.createLayer('grassLayer', grass, 0, 0);
            if (!grassLayer) throw new Error('Failed to create layer');

            const groundLayer = map.createLayer('groundLayer', ground, 0, 0);
            if (!groundLayer) throw new Error('Failed to create layer');
        } catch (error) {
            console.error('Error creating tilemap:', error);
        }
    }

    private createPlayer() {
        this.player = this.physics.add.sprite(400, 300, 'player');
        this.player.setCollideWorldBounds(true);
    }

    private setupCamera() {
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT);
    }

    private setupInput() {
        if (this.input && this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
        } else {
            console.error("Input or keyboard is null");
        }
    }

    private createAnimations() {
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'walk-right',
            frames: this.anims.generateFrameNumbers('player', { start: 6, end: 11 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'walk-up',
            frames: this.anims.generateFrameNumbers('player', { start: 12, end: 17 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'walk-down',
            frames: this.anims.generateFrameNumbers('player', { start: 18, end: 23 }),
            frameRate: 10,
            repeat: -1
        });
    }

    private handlePlayerMovement() {
        this.player.setVelocity(0);

        if (this.cursors.left?.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('walk-right', true);
            this.player.flipX = true;
        } else if (this.cursors.right?.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('walk-right', true);
            this.player.flipX = false;
        } else if (this.cursors.up?.isDown) {
            this.player.setVelocityY(-160);
            this.player.anims.play('walk-up', true);
        } else if (this.cursors.down?.isDown) {
            this.player.setVelocityY(160);
            this.player.anims.play('walk-down', true);
        } else {
            this.player.anims.play('idle', true);
        }
    }
}
