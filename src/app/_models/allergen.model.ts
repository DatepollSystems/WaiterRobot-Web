import {AEntityWithNumberIDAndName} from 'dfx-helper';

export class AllergenModel extends AEntityWithNumberIDAndName {
  public readonly short_name: string;

  constructor(data: any) {
    super(data.id, data.name + ' (' + data.short_name + ')', data);
    this.short_name = data.short_name;
  }
}
