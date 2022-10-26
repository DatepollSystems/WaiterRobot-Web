import {AEntityWithNumberIDAndName} from 'dfx-helper';
import {GetAllergenResponse} from '../../../_shared/waiterrobot-backend';

export class AllergenModel extends AEntityWithNumberIDAndName {
  public readonly shortName: string;

  constructor(data: GetAllergenResponse) {
    super(data.id, data.name + ' (' + data.shortName + ')', data);
    this.shortName = data.shortName;
  }
}
