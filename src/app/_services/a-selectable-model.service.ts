import {Subject} from 'rxjs';

import {AModel, AModelService, StorageHelper} from 'dfx-helper';

import {HttpService} from './http.service';

export abstract class ASelectableModelService<Model extends AModel> extends AModelService<Model> {
  protected abstract selectedStorageKey: string;

  private selected!: Model | null;
  public selectedChange: Subject<Model | null> = new Subject<Model | null>();

  protected constructor(httpService: HttpService, url: string) {
    super(httpService, url);
  }

  public getSelected(): Model | null {
    if (this.selected == null) {
      this.selected = StorageHelper.getObject(this.selectedStorageKey);
      if (this.selected != null) {
        this.selectedChange.next(this.selected);
      }
    }
    return this.selected;
  }

  public setSelected(selected: Model | null): void {
    this.selected = selected;
    StorageHelper.setObject(this.selectedStorageKey, this.selected);
    this.selectedChange.next(this.selected);
  }
}
