import {AbstractEntityWithNumberIDAndName} from 'dfx-helper';

export class ProductsModel extends AbstractEntityWithNumberIDAndName {
  public readonly price: number;
  public readonly allergens: Array<AllergensModel>;
  public readonly group_id: number;
  public readonly printer_id: number;
  public readonly organisation_id: number;

  constructor(data: any) {
    super(data.id, data.name, data);
    this.price = data.price;
    this.allergens = data.allergens;
    this.group_id = data.group_id;
    this.printer_id = data.printer_id;
    this.organisation_id = data.organisation_id;
  }
}

export class AllergensModel extends AbstractEntityWithNumberIDAndName {
  public readonly short_name: string;

  constructor(data: any) {
    super(data.id, data.name, data);
    this.short_name = data.short_name;
  }
}
