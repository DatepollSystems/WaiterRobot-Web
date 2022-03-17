import {AEntityWithNumberIDAndName, EntityList, IEntityList, StringHelper} from 'dfx-helper';
import {AllergenModel} from '../allergen.model';

export class ProductModel extends AEntityWithNumberIDAndName {
  public readonly price: number;
  public readonly allergens: IEntityList<AllergenModel> = new EntityList();
  public readonly group_id: number;
  public readonly group_name: string;
  public readonly printer_id: number;

  constructor(data: any) {
    super(data.id, data.name, data);
    this.price = data.price;
    this.allergens.add(
      data.allergens.map((allergen: any) => {
        return new AllergenModel(allergen);
      })
    );
    this.group_id = data.group_id;
    this.group_name = data.group_name;
    this.printer_id = data.printer_id;
  }

  private allergensShortName: string | undefined;

  public allergens_short_names(): string {
    if (!this.allergensShortName) {
      this.allergensShortName = StringHelper.getImploded(this.allergens.map((allergen) => allergen.short_name));
    }
    return this.allergensShortName;
  }
}
