import {ChangeDetectionStrategy, Component, Inject, inject, signal, ViewChild} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {ActivatedRoute} from '@angular/router';

import {map, of, switchMap} from 'rxjs';

import {IHasID, n_from, n_isNumeric} from 'dfts-helper';
import {HasGetSingle} from 'dfx-helper';

import {AbstractModelEditFormComponent} from './abstract-model-edit-form.component';

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class AbstractModelEditComponent<EntityType extends IHasID<EntityType['id']>> {
  protected route = inject(ActivatedRoute);

  @ViewChild('form') set setForm(it: AbstractModelEditFormComponent<unknown, unknown>) {
    this.form.set(it);
  }
  form = signal<AbstractModelEditFormComponent<unknown, unknown> | undefined>(undefined);

  entity = toSignal(
    inject(ActivatedRoute).paramMap.pipe(
      map((params) => params.get('id')),
      map((id) => (n_isNumeric(id) ? n_from(id) : undefined)),
      switchMap((it) => (it ? this.entityService.getSingle$(it) : of('CREATE' as const))),
    ),
  );

  protected constructor(@Inject(null) protected entityService: HasGetSingle<EntityType>) {}
}
