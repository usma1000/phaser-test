export class Character {
    name: string;
    currentHealth: number;
    maxHealth: number;
    currentEnergy: number;
    maxEnergy: number;
    currentPotions: number;
    maxPotions: number;
    attacks: { name: string; damage: number; cost: number }[];

    constructor(name: string) {
        this.name = name;
        this.currentHealth = 100;
        this.maxHealth = 100;
        this.currentEnergy = 50;
        this.maxEnergy = 50;
        this.currentPotions = 5;
        this.maxPotions = 5;
        this.attacks = [
            { name: "Quick Strike", damage: 15, cost: 0 },
            { name: "Heavy Blow", damage: 30, cost: 10 }
        ];
    }

    attack(index: number, target: Character): string {
        const attack = this.attacks[index];
        if (this.currentEnergy >= attack.cost) {
            this.currentEnergy -= attack.cost;
            target.currentHealth -= attack.damage;
            return `${this.name} used ${attack.name}! It dealt ${attack.damage} damage.`;
        } else {
            return `${this.name} tried to use ${attack.name} but didn't have enough energy!`;
        }
    }

    usePotion(type: "health" | "energy"): string {
        if (type === "health" && this.currentPotions > 0) {
            this.currentPotions--;
            this.currentHealth += 20;
            return `${this.name} used a Health Potion and restored 20 HP!`;
        } else if (type === "energy" && this.currentPotions > 0) {
            this.currentPotions--;
            this.currentEnergy += 15;
            return `${this.name} used an Energy Potion and restored 15 EN!`;
        } else {
            return `${this.name} has no more ${type} potions left!`;
        }
    }

    isDefeated(): boolean {
        return this.currentHealth <= 0;
    }
}
