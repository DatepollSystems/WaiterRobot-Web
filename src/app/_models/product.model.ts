import {AEntityWithNumberIDAndName, IList, List, StringHelper} from 'dfx-helper';
import {AllergenModel} from './allergen.model';

export class ProductModel extends AEntityWithNumberIDAndName {
  public readonly price: number;
  public readonly allergens: IList<AllergenModel> = new List();
  public readonly group_id: number;
  public readonly printer_id: number;
  public readonly organisation_id: number;

  constructor(data: any) {
    super(data.id, data.name, data);
    this.price = data.price;
    this.allergens.add(
      data.allergens.map((allergen: any) => {
        return new AllergenModel(allergen);
      })
    );
    this.group_id = data.product_group_id;
    this.printer_id = data.printer_id;
    this.organisation_id = data.organisation_id;
  }

  public get allergens_short_names(): string {
    return StringHelper.getImploded(this.allergens.map((allergen) => allergen.short_name));
  }
}
