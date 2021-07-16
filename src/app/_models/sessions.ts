import {WModel} from './model';

export class Sessions extends WModel{

  constructor(dto: any) {
    console.log(dto);
    super(dto.id);
  }
}
