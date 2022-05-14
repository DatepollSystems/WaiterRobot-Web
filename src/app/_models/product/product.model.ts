import {AEntityWithNumberIDAndName, EntityList, IEntityList, StringHelper} from 'dfx-helper';
import {AllergenModel} from '../allergen.model';
import {GetAllergenResponse} from '../waiterrobot-backend';

export class ProductModel extends AEntityWithNumberIDAndName {
  public readonly price: number;
  public readonly allergens: IEntityList<AllergenModel> = new EntityList();
  public readonly groupId: number;
  public readonly groupName: string;
  public readonly printerId: number;

  constructor(data: any) {
    super(data.id, data.name, data);
    this.price = data.price;
    this.allergens.add(
      data.allergens.map((allergen: GetAllergenResponse) => {
        return new AllergenModel(allergen);
      })
    );
    this.groupId = data.groupId;
    this.groupName = data.groupName;
    this.printerId = data.printerId;
  }

  private allergensShortName: string | undefined;

  public allergens_short_names(): string {
    if (!this.allergensShortName) {
      this.allergensShortName = StringHelper.getImploded(this.allergens.map((allergen) => allergen.shortName));
    }
    return this.allergensShortName;
  }
}
