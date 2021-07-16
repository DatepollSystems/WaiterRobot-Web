export abstract class Model {
  public id: number;

  protected constructor(id: number) {
    this.id = id;
  }
}
