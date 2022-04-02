import {AEntityWithNumberIDAndName} from 'dfx-helper';

export class AllergenModel extends AEntityWithNumberIDAndName {
  public readonly shortName: string;

  constructor(data: any) {
    super(data.id, data.name + ' (' + data.shortName + ')', data);
    this.shortName = data.shortName;
  }
}
