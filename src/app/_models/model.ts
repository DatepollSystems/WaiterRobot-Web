export abstract class WModel {
  public id: number;

  protected constructor(id: number) {
    this.id = id;
  }

  public static createOfDTO<T extends WModel>(type: any, dto: any): T {
    return new type(dto);
  }
}
