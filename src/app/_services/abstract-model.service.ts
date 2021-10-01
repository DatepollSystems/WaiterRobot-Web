import {AbstractEntity, AbstractEntityService, AbstractSelectableEntityService, StorageHelper} from 'dfx-helper';

export abstract class AbstractModelService<EntityType extends AbstractEntity<number>> extends AbstractEntityService<number, EntityType> {}

export abstract class AbstractSelectedModelService<EntityType extends AbstractEntity<number>> extends AbstractSelectableEntityService<
  number,
  EntityType
> {
  private customSelected: EntityType | undefined;

  public override getSelected(): EntityType | undefined {
    if (this.customSelected == undefined) {
      this.customSelected = this.convert(StorageHelper.getObject(this.selectedStorageKey));
      if (this.customSelected != undefined) {
        this.selectedChange.next(this.customSelected);
      }
    }
    return this.customSelected;
  }

  public override setSelected(selected: EntityType | undefined) {
    this.customSelected = selected;
    super.setSelected(selected);
  }
}
