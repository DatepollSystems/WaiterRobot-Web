import {AEntityWithNumberIDAndName, RememberResult, StringHelper} from 'dfx-helper';

export class ProductsModel extends AEntityWithNumberIDAndName {
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

  @RememberResult
  public get allergens_short_names(): string {
    return StringHelper.getImploded(this.allergens.map((allergen) => allergen.short_name));
  }
}

export class AllergensModel extends AEntityWithNumberIDAndName {
  public readonly short_name: string;

  constructor(data: any) {
    super(data.id, data.name, data);
    this.short_name = data.short_name;
  }
}
