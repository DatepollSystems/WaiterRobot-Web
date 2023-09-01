import {SelectionModel} from '@angular/cdk/collections';
import {Component, Inject} from '@angular/core';

import {forkJoin, Observable, tap} from 'rxjs';

import {IHasID, s_imploder} from 'dfts-helper';
import {NgbTableDataSource} from 'dfx-bootstrap-table';
import {HasDelete, HasGetAll} from 'dfx-helper';

import {AbstractModelsListComponent} from '../abstract-models-list.component';
import {injectConfirmDialog} from '../question-dialog/question-dialog.component';

@Component({
  template: '',
})
export abstract class AbstractModelsListWithDeleteComponent<
  EntityType extends IHasID<EntityType['id']>,
> extends AbstractModelsListComponent<EntityType> {
  protected selectionEnabled = true;
  public selection = new SelectionModel<EntityType>(true, []);

  protected confirmDialog = injectConfirmDialog();

  protected constructor(@Inject(null) protected entitiesService: HasGetAll<EntityType> & HasDelete<EntityType>) {
    super(entitiesService);
  }

  protected override getDataSource(entitiesStream: Observable<EntityType[]>): Observable<NgbTableDataSource<EntityType>> {
    return super.getDataSource(entitiesStream).pipe(tap(() => (this.selection = new SelectionModel<EntityType>(true, []))));
  }

  override get columnsToDisplay(): string[] {
    return this.selectionEnabled ? ['select'].concat(super.columnsToDisplay) : super.columnsToDisplay;
  }

  override set columnsToDisplay(it: string[]) {
    super.columnsToDisplay = it;
  }

  public onDelete(modelId: keyof EntityType['id'], event?: MouseEvent): void {
    event?.stopPropagation();
    this.lumber.info('onDelete', 'Opening delete question dialog');
    void this.confirmDialog('DELETE_CONFIRMATION').then((result) => {
      if (result) {
        this.entitiesService.delete$(modelId).subscribe();
      }
    });
  }

  abstract nameMap: (it: EntityType) => string;

  public onDeleteSelected(): void {
    this.lumber.info('onDeleteSelected', 'Opening delete question dialog');
    this.lumber.info('onDeleteSelected', 'Selected entities:', this.selection.selected);

    void this.confirmDialog(
      'DELETE_ALL',
      `<ol><li>${s_imploder().mappedSource(this.selection.selected, this.nameMap).separator('</li><li>').build()}</li></ol>`,
    ).then((result) => {
      if (result) {
        const observables: Observable<unknown>[] = [];
        for (const selected of this.selection.selected) {
          observables.push(this.entitiesService.delete$(selected.id));
        }
        forkJoin(observables).subscribe();
      }
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  public isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this._dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  public toggleAllRows(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection?.select(...this._dataSource.data);
  }
}
