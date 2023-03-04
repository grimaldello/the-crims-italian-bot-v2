import { singleton } from "tsyringe";

@singleton()
export class User {

    private cashFormatter: Intl.NumberFormat = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'});

    public stamina: number = 0;
    public tolerance: number = 0;
    public strength: number = 0;
    public charisma: number = 0;
    public intelligence: number = 0;
    public respect: number = 0;
    public cash: number = 0;
    public addiction: number = 0;
    public tickets: number = 0;
    public singleRobberyPower: number = 0;
    public gangRobberyPower: number = 0;
    public assaultPower: number = 0;

    public updateStats(userData: any): void {
        if(userData.user) {
            this.stamina = userData.user.stamina;
            this.tolerance = userData.user.tolerance;
            this.strength = userData.user.strength;
            this.charisma = userData.user.charisma;
            this.intelligence = userData.user.intelligence;
            this.respect = userData.user.respect;
            this.cash = userData.user.cash;
            this.addiction = userData.user.addiction;
            this.tickets = userData.user.tickets;
            this.singleRobberyPower = userData.user.single_robbery_power;
            this.gangRobberyPower = userData.user.gang_robbery_power;
            this.assaultPower = userData.user.assault_power;
    
            // this.printAllStats();
        }
    }

    public printAllStats(): void {

        console.log(`Respect: ${this.respect}`);
        console.log(`Cash: ${this.cashFormatter.format(this.cash)}`);
        console.log(`Stamina: ${this.stamina}`);
        console.log(`Addiction: ${this.addiction}`);
        console.log(`Tickets: ${this.tickets}`);
        console.log(`Tolerance: ${this.tolerance}`);
        console.log(`Strength: ${this.strength}`);
        console.log(`Charisma: ${this.charisma}`);
        console.log(`Intelligence: ${this.intelligence}`);
        console.log(`Single Robbery Power: ${this.singleRobberyPower}`);
        console.log(`Gang Robbery Power: ${this.gangRobberyPower}`);
        console.log(`Assault Power: ${this.assaultPower}`);
    }
}