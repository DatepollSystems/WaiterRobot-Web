import {AModel} from 'dfx-helper';

export class ProductsModel extends AModel {
  public readonly name: string;
  public readonly price: number;
  public readonly allergens: Array<AllergensModel>;
  public readonly group_id: number;
  public readonly printer_id: number;
  public readonly organisation_id: number;

  constructor(data: any) {
    super(data.id);
    this.name = data.name;
    this.price = data.price;
    this.allergens = data.allergens;
    this.group_id = data.group_id;
    this.printer_id = data.printer_id;
    this.organisation_id = data.organisation_id;
  }
}

export class AllergensModel extends AModel {
  public readonly name: string;
  public readonly short_name: string;

  constructor(data: any) {
    super(data.id);
    this.name = data.name;
    this.short_name = data.short_name;
  }
}
