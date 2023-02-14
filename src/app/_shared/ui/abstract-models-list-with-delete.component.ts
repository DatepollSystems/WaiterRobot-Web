import {SelectionModel} from '@angular/cdk/collections';
import {Component, Inject, inject} from '@angular/core';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {HasIDAndName, s_imploder} from 'dfts-helper';
import {NgbTableDataSource} from 'dfx-bootstrap-table';
import {Observable, tap} from 'rxjs';

import {QuestionDialogComponent} from './question-dialog/question-dialog.component';
import {AbstractModelsListV2Component} from './abstract-models-list-v2.component';
import {HasDelete, HasGetAll} from '../services/abstract-entity.service';

@Component({
  template: '',
})
export abstract class AbstractModelsListWithDeleteComponent<
  EntityType extends HasIDAndName<EntityType['id']>
> extends AbstractModelsListV2Component<EntityType> {
  public selection?: SelectionModel<EntityType>;

  protected modal = inject(NgbModal);

  protected constructor(@Inject(null) protected entitiesService: HasGetAll<EntityType> & HasDelete<EntityType>) {
    super(entitiesService);
  }

  protected override getDataSource(entitiesStream: Observable<EntityType[]>): Observable<NgbTableDataSource<EntityType>> {
    return super.getDataSource(entitiesStream).pipe(
      tap(() => {
        if (this.selection) {
          this.selection = new SelectionModel<EntityType>(true, []);
        }
      })
    );
  }

  protected setSelectable(): void {
    this.columnsToDisplay = ['select'].concat(this.columnsToDisplay);
    this.selection = new SelectionModel<EntityType>(true, []);
  }

  public onDeleteAll(): void {
    if (!this.isAllSelected()) {
      this.toggleAllRows();
    }
    this.onDeleteSelected();
  }

  public onDelete(modelId: keyof EntityType['id'], event?: MouseEvent): void {
    event?.stopPropagation();
    this.lumber.info('onDelete', 'Opening delete question dialog');
    const modalRef = this.modal.open(QuestionDialogComponent, {ariaLabelledBy: 'modal-question-title', size: 'lg'});
    modalRef.componentInstance.title = 'DELETE_CONFIRMATION';
    void modalRef.result.then((result) => {
      this.lumber.info('onDelete', 'Question dialog result:', result?.toString());
      if (result?.toString().includes(QuestionDialogComponent.YES_VALUE)) {
        this.entitiesService.delete$(modelId).subscribe();
      }
    });
  }

  public onDeleteSelected(): void {
    if (!this.selection) {
      this.lumber.error('onDeleteSelected', 'Enable selectable with this.setSelectable()');
      return;
    }

    this.lumber.info('onDeleteSelected', 'Opening delete question dialog');
    this.lumber.info('onDeleteSelected', 'Selected entities:', this.selection.selected);
    const modalRef = this.modal.open(QuestionDialogComponent, {ariaLabelledBy: 'modal-question-title', size: 'lg'});
    modalRef.componentInstance.title = 'DELETE_ALL';
    const list = s_imploder()
      .mappedSource(this.selection.selected, (it) => it.name)
      .separator('</li><li>')
      .build();
    modalRef.componentInstance.info = `<ol><li>${list}</li></ol>`;
    void modalRef.result.then((result) => {
      this.lumber.info('onDeleteSelected', 'Question dialog result:', result);
      if (result?.toString().includes(QuestionDialogComponent.YES_VALUE)) {
        for (const selected of this.selection?.selected ?? []) {
          this.entitiesService.delete$(selected.id).subscribe();
        }
      }
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  public isAllSelected(): boolean {
    const numSelected = this.selection?.selected.length;
    const numRows = this.entities?.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  public toggleAllRows(): void {
    if (this.isAllSelected()) {
      this.selection?.clear();
      return;
    }

    this.selection?.select(...(this.entities?.data ?? []));
  }
}