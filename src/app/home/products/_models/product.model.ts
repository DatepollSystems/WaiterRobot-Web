import {AEntityWithNumberIDAndName, EntityList, IEntityList, s_imploder} from 'dfts-helper';
import {GetAllergenResponse, GetProductMaxResponse} from '../../../_shared/waiterrobot-backend';
import {AllergenModel} from './allergen.model';

export class ProductModel extends AEntityWithNumberIDAndName {
  public readonly price: number;
  public readonly allergens: IEntityList<AllergenModel> = new EntityList();
  public readonly groupId: number;
  public readonly groupName: string;
  public readonly printerId: number;
  public readonly printerName: string;
  public readonly soldOut: boolean;

  constructor(data: GetProductMaxResponse) {
    super(data.id, data.name, data);
    this.price = data.price / 100;
    this.soldOut = data.soldOut;
    this.allergens.add(
      data.allergens.map((allergen: GetAllergenResponse) => {
        return new AllergenModel(allergen);
      })
    );
    this.groupId = data.group.id;
    this.groupName = data.group.name;
    this.printerId = data.printer.id;
    this.printerName = data.printer.name;
  }

  private allergensShortName: string | undefined;

  public allergens_short_names(): string {
    if (!this.allergensShortName) {
      this.allergensShortName = s_imploder()
        .mappedSource(this.allergens, (it) => it.shortName)
        .separator(', ')
        .build();
    }
    return this.allergensShortName;
  }
}
