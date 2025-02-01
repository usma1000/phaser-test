import Phaser from "phaser";
import { Character } from "../objects/Character";
import { BattleUI } from "../ui/BattleUI";

export class BattleScene extends Phaser.Scene {
    private player!: Character;
    private enemy!: Character;
    private playerSprite!: Phaser.GameObjects.Sprite;
    private enemySprite!: Phaser.GameObjects.Sprite;
    private battleText!: Phaser.GameObjects.Text;
    private turn: "player" | "enemy" = "player";

    private battleUI!: BattleUI;

    constructor() {
        super("BattleScene");
    }

    preload() {
        this.load.image("hero", "assets/monsters/goblin-rider.png");
        this.load.image("goblin", "assets/monsters/goblin-spearman.png");
    }

    create() {
        this.player = new Character("Hero");
        this.enemy = new Character("Goblin");

        this.playerSprite = this.add.sprite(200, 400, "hero").setScale(2);
        this.enemySprite = this.add.sprite(600, 400, "goblin").setScale(2).setFlipX(true);

        this.battleText = this.add.text(50, 450, "", { fontSize: "20px", color: "#fff" });

        this.battleUI = new BattleUI(this, this.player, this.enemy);
        this.updateBattleText();
        this.setupInput();
    }

    setupInput() {
        this.input.keyboard?.on("keydown-ONE", () => this.handleAttack(0)); // Attack 1
        this.input.keyboard?.on("keydown-TWO", () => this.handleAttack(1)); // Attack 2
        this.input.keyboard?.on("keydown-H", () => this.handlePotionUse("health")); // Use Health Potion
        this.input.keyboard?.on("keydown-E", () => this.handlePotionUse("energy")); // Use Energy Potion
    }

    handleAttack(index: number) {
        if (this.turn !== "player") return;

        const message = this.player.attack(index, this.enemy);
        this.turn = "enemy";
        this.updateBattleText(message);
        this.battleUI.updateHealthAndEnergyBars();

        if (this.enemy.isDefeated()) {
            this.updateBattleText("Enemy defeated! You win!");
            this.time.delayedCall(1000, () => this.scene.start("Game"), [], this);
            return;
        }

        this.time.delayedCall(1000, () => this.enemyTurn(), [], this);
    }

    handlePotionUse(type: "health" | "energy") {
        if (this.turn !== "player") return;

        const message = this.player.usePotion(type);
        this.endPlayerTurn(message);
    }

    enemyTurn() {
        let message = this.enemyDecideAction();
        this.endEnemyTurn(message);
    }

    enemyDecideAction(): string {
        // Enemy has a 50% chance to use a potion if health is low or energy is empty
        if (this.enemy.currentHealth <= 30 && this.enemy.maxPotions > 0 && Math.random() < 0.5) {
            return this.enemy.usePotion("health");
        } else if (this.enemy.currentEnergy === 0 && this.enemy.maxPotions > 0 && Math.random() < 0.5) {
            return this.enemy.usePotion("energy");
        }

        // If no potion was used, attack
        const randomAttack = Math.random() < 0.5 ? 0 : 1;
        return this.enemy.attack(randomAttack, this.player);
    }

    endPlayerTurn(message: string) {
        this.turn = "enemy";
        this.updateBattleText(message);
        this.battleUI.updateHealthAndEnergyBars();
        this.time.delayedCall(1000, () => this.enemyTurn(), [], this);
    }

    endEnemyTurn(message: string) {
        this.updateBattleText(message);
        this.battleUI.updateHealthAndEnergyBars();

        if (this.player.isDefeated()) {
            this.updateBattleText("You have been defeated! Game Over.");
        } else if (this.enemy.isDefeated()) {
            this.updateBattleText("Enemy defeated! You win!");
            this.time.delayedCall(1000, () => this.scene.start("GameScene"), [], this);
        } else {
            this.turn = "player";
        }
    }

    updateBattleText(extraMessage: string = "") {
        this.battleText.setText(
            `${extraMessage}\n\n` +
            `Press [1] for Quick Strike | [2] for Heavy Blow\n` +
            `Press [H] for Health Potion | [E] for Energy Potion`
        );
    }
}
