import {SelectionModel} from '@angular/cdk/collections';
import {Signal} from '@angular/core';
import {injectConfirmDialog} from '@home-shared/components/question-dialog.component';
import {IHasID, loggerOf, s_imploder} from 'dfts-helper';
import {forkJoin, Observable} from 'rxjs';

export function injectTableDelete<EntityType extends IHasID<EntityType['id']>>({
  delete$,
  selection,
  nameMap,
}: {
  delete$: (entityId: EntityType['id']) => Observable<unknown>;
  selection?: undefined;
  nameMap?: undefined;
}): {
  onDelete: (id: EntityType['id']) => void;
  onDeleteSelected: undefined;
};

export function injectTableDelete<EntityType extends IHasID<EntityType['id']>>({
  delete$,
  selection,
  nameMap,
}: {
  delete$: (entityId: EntityType['id']) => Observable<unknown>;
  selection: Signal<SelectionModel<EntityType>>;
  nameMap: (it: EntityType) => string;
}): {
  onDelete: (id: EntityType['id']) => void;
  onDeleteSelected: () => void;
};

export function injectTableDelete<EntityType extends IHasID<EntityType['id']>>({
  delete$,
  selection,
  nameMap,
}: {
  delete$: (entityId: EntityType['id']) => Observable<unknown>;
  selection?: Signal<SelectionModel<EntityType>> | undefined;
  nameMap?: ((it: EntityType) => string) | undefined;
}): {
  onDelete: (id: EntityType['id']) => void;
  onDeleteSelected: (() => void) | undefined;
} {
  const confirmDialog = injectConfirmDialog();
  const lumber = loggerOf('injectTableDelete');

  const onDelete = (id: EntityType['id']): void => {
    lumber.info('onDelete', 'Opening delete question dialog');
    void confirmDialog('DELETE_CONFIRMATION').then((result) => {
      if (result) {
        delete$(id).subscribe();
      }
    });
  };

  const onDeleteSelected = (): void => {
    if (!selection || !nameMap) {
      throw new Error('injectTableDelete: onDeleteSelected used but no selection or nameMap passed in');
    }

    const selected = selection().selected;

    lumber.info('onDeleteSelected', 'Opening delete question dialog');
    lumber.info('onDeleteSelected', 'Selected entities:', selected);

    void confirmDialog(
      'DELETE_ALL',
      `<ol><li>${s_imploder().mappedSource(selected, nameMap).separator('</li><li>').build()}</li></ol>`,
    ).then((result) => {
      if (result) {
        forkJoin(selected.map((it) => delete$(it.id))).subscribe();
      }
    });
  };

  return {
    onDelete,
    onDeleteSelected,
  };
}
