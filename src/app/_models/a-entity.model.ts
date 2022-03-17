import {AEntityWithNumberIDAndName} from 'dfx-helper';

export class EntityWithNumberIDAndName extends AEntityWithNumberIDAndName {
  constructor(id: number, name: string, originalJsonDto: any) {
    super(id, name, originalJsonDto);
  }
}
