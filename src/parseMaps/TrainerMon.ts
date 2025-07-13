//@ts-ignore
class TrainerMon {
  public readonly id?: number;
  public readonly level?: number;
  public readonly item?: number;
  public readonly moves?: number[];
  public readonly ability?: number;
  public canMega: boolean = false;
  constructor() {
    this.id = undefined;
    this.level = undefined;
    this.item = undefined;
    this.moves = [];
    this.ability = undefined;
  }
}
