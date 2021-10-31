import {AEntityWithNumberIDAndName, StringHelper} from 'dfx-helper';

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

  private _allergens_short_ames: string | undefined = undefined;
  public get allergens_short_names(): string {
    if (!this._allergens_short_ames) {
      const shortNamesArray = [];
      for (const allergen of this.allergens) {
        shortNamesArray.push(allergen.short_name);
      }
      this._allergens_short_ames = StringHelper.getImploded(shortNamesArray);
    }
    return this._allergens_short_ames;
  }
}

export class AllergensModel extends AEntityWithNumberIDAndName {
  public readonly short_name: string;

  constructor(data: any) {
    super(data.id, data.name, data);
    this.short_name = data.short_name;
  }
}
