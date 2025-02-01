import Phaser from "phaser";
import { Character } from "../objects/Character";

export class BattleUI {
    private scene: Phaser.Scene;
    private player: Character;
    private enemy: Character;

    private playerHealthBar!: Phaser.GameObjects.Graphics;
    private playerEnergyBar!: Phaser.GameObjects.Graphics;
    private enemyHealthBar!: Phaser.GameObjects.Graphics;
    private enemyEnergyBar!: Phaser.GameObjects.Graphics;

    private playerHealthText!: Phaser.GameObjects.Text;
    private playerEnergyText!: Phaser.GameObjects.Text;
    private enemyHealthText!: Phaser.GameObjects.Text;
    private enemyEnergyText!: Phaser.GameObjects.Text;

    private playerPotionCircles!: Phaser.GameObjects.Graphics;
    private enemyPotionCircles!: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene, player: Character, enemy: Character) {
        this.scene = scene;
        this.player = player;
        this.enemy = enemy;

        this.createHealthAndEnergyBars();
    }

    private createHealthAndEnergyBars() {
        this.playerHealthBar = this.scene.add.graphics();
        this.playerEnergyBar = this.scene.add.graphics();
        this.enemyHealthBar = this.scene.add.graphics();
        this.enemyEnergyBar = this.scene.add.graphics();

        this.playerHealthText = this.scene.add.text(50, 100, "", { fontSize: "16px", color: "#fff" }).setDepth(1);
        this.playerEnergyText = this.scene.add.text(50, 130, "", { fontSize: "16px", color: "#fff" }).setDepth(1);
        this.enemyHealthText = this.scene.add.text(550, 100, "", { fontSize: "16px", color: "#fff" }).setDepth(1);
        this.enemyEnergyText = this.scene.add.text(550, 130, "", { fontSize: "16px", color: "#fff" }).setDepth(1);

        this.playerPotionCircles = this.scene.add.graphics();
        this.enemyPotionCircles = this.scene.add.graphics();

        this.updateHealthAndEnergyBars();
    }

    public updateHealthAndEnergyBars() {
        const healthBarWidth = 200;
        const energyBarWidth = 200;
        const barHeight = 20;
        const circleRadius = 10;
        const circleSpacing = 5;

        // Clear previous bars and circles
        this.playerHealthBar.clear();
        this.playerEnergyBar.clear();
        this.enemyHealthBar.clear();
        this.enemyEnergyBar.clear();
        this.playerPotionCircles.clear();
        this.enemyPotionCircles.clear();

        // Clamp values to ensure they don't go negative
        const playerHealth = Math.max(this.player.currentHealth, 0);
        const playerEnergy = Math.max(this.player.currentEnergy, 0);
        const enemyHealth = Math.max(this.enemy.currentHealth, 0);
        const enemyEnergy = Math.max(this.enemy.currentEnergy, 0);

        // Draw player health bar
        this.playerHealthBar.fillStyle(0xff0000);
        this.playerHealthBar.fillRect(50, 100, healthBarWidth * (playerHealth / this.player.maxHealth), barHeight);

        // Draw player energy bar
        this.playerEnergyBar.fillStyle(0x0000ff);
        this.playerEnergyBar.fillRect(50, 130, energyBarWidth * (playerEnergy / this.player.maxEnergy), barHeight);

        // Draw enemy health bar
        this.enemyHealthBar.fillStyle(0xff0000);
        this.enemyHealthBar.fillRect(550, 100, healthBarWidth * (enemyHealth / this.enemy.maxHealth), barHeight);

        // Draw enemy energy bar
        this.enemyEnergyBar.fillStyle(0x0000ff);
        this.enemyEnergyBar.fillRect(550, 130, energyBarWidth * (enemyEnergy / this.enemy.maxEnergy), barHeight);

        // Update text
        this.playerHealthText.setText(`${playerHealth} / ${this.player.maxHealth}`).setPosition(50 + healthBarWidth / 2, 100 + barHeight / 2).setOrigin(0.5);
        this.playerEnergyText.setText(`${playerEnergy} / ${this.player.maxEnergy}`).setPosition(50 + energyBarWidth / 2, 130 + barHeight / 2).setOrigin(0.5);
        this.enemyHealthText.setText(`${enemyHealth} / ${this.enemy.maxHealth}`).setPosition(550 + healthBarWidth / 2, 100 + barHeight / 2).setOrigin(0.5);
        this.enemyEnergyText.setText(`${enemyEnergy} / ${this.enemy.maxEnergy}`).setPosition(550 + energyBarWidth / 2, 130 + barHeight / 2).setOrigin(0.5);

        // Draw player potion circles
        for (let i = 0; i < this.player.currentPotions; i++) {
            this.playerPotionCircles.fillStyle(0x00ff00);
            this.playerPotionCircles.fillCircle(50 + i * (circleRadius * 2 + circleSpacing), 160, circleRadius);
        }

        // Draw enemy potion circles
        for (let i = 0; i < this.enemy.currentPotions; i++) {
            this.enemyPotionCircles.fillStyle(0x00ff00);
            this.enemyPotionCircles.fillCircle(550 + i * (circleRadius * 2 + circleSpacing), 160, circleRadius);
        }
    }
}