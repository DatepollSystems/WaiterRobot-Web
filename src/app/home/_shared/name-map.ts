import {IHasName} from 'dfts-helper';

export function mapName(): (it: IHasName) => string {
  return (it: IHasName) => it.name;
}
