import {ChangeDetectionStrategy, Component, Input, input} from '@angular/core';
import {ReactiveFormsModule, Validators} from '@angular/forms';

import {TranslocoPipe} from '@jsverse/transloco';
import {NgSelectModule} from '@ng-select/ng-select';
import {HasNumberIDAndName} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';

import {AbstractModelEditFormComponent} from '@home-shared/form/abstract-model-edit-form.component';
import {AppModelEditSaveBtn} from '@home-shared/form/app-model-edit-save-btn.component';
import {allowedCharacterSet} from '@home-shared/regex';

import {BackendType} from '@shared/api';
import {injectIsValid} from '@shared/form';

@Component({
  template: `
    @if (isValid()) {}

    <form class="d-flex flex-column gap-3" #formRef [formGroup]="form" (ngSubmit)="submit()">
      <div class="row g-3">
        <div class="form-group col-sm-12 col-md-4 col-lg-5 col-xl-6">
          <label for="name">{{ 'NAME' | transloco }}</label>
          <input class="form-control" id="name" [placeholder]="'NAME' | transloco" type="text" formControlName="name" />

          @if (form.controls.name.invalid) {
            <small class="text-danger">
              {{ 'HOME_WAITERS_EDIT_NAME_INCORRECT' | transloco }}
            </small>
          }
        </div>

        <div class="form-group col-sm-12 col-md-8 col-lg-7 col-xl-6">
          <label for="eventSelect">{{ 'HOME_WAITERS_EDIT_EVENTS' | transloco }}</label>
          <ng-select
            [items]="events()"
            [multiple]="true"
            [placeholder]="'HOME_WAITERS_EDIT_EVENTS_PLACEHOLDER' | transloco"
            bindLabel="name"
            bindValue="id"
            labelForId="eventSelect"
            clearAllText="Clear"
            formControlName="eventIds"
          />
        </div>
      </div>

      <div class="d-flex flex-column flex-md-row gap-2 gap-md-4">
        <div class="form-check form-switch">
          <input class="form-check-input" id="activated" type="checkbox" formControlName="activated" />
          <label class="form-check-label" for="activated">
            {{ 'HOME_USERS_ACTIVATED' | transloco }}
          </label>
        </div>
      </div>

      <app-model-edit-save-btn [valid]="isValid()" [creating]="isCreating()" />
    </form>
  `,
  selector: 'app-waiter-edit-form',
  imports: [ReactiveFormsModule, TranslocoPipe, BiComponent, NgSelectModule, AppModelEditSaveBtn],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppWaiterEditFormComponent extends AbstractModelEditFormComponent<
  BackendType['CreateWaiterDto'],
  BackendType['UpdateWaiterDto']
> {
  override form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(70), Validators.pattern(allowedCharacterSet)]],
    eventIds: [new Array<number>()],
    organisationId: [-1, [Validators.required, Validators.min(0)]],
    activated: [true, [Validators.required]],
    id: [-1],
  });

  isValid = injectIsValid(this.form);

  @Input()
  set waiter(it: BackendType['GetWaiterResponse'] | 'CREATE') {
    if (it === 'CREATE') {
      this.isCreating.set(true);
      return;
    }

    if (it.deleted) {
      this.formDisabled = true;
    }

    this.form.patchValue({
      name: it.name,
      eventIds: it.events.map((iit) => iit.id),
      organisationId: it.organisationId,
      activated: it.activated,
      id: it.id,
    });
  }

  @Input()
  set selectedOrganisationId(id: number | undefined | null) {
    if (id) {
      this.lumber.log('selectedOrganisationId', 'set selected organisation', id);
      this._selectedOrganisationId = id;
      this.form.controls.organisationId.setValue(id);
    }
  }

  _selectedOrganisationId = -1;

  @Input()
  set selectedEvent(it: BackendType['GetEventOrLocationMinResponse'] | undefined) {
    console.warn('setting selected event', it);
    if (it) {
      this.lumber.info('selectedEvent', 'set selected event', it);
      this._selectedEvent = it;
      if (this.isCreating()) {
        this.lumber.info('selectedEvent', 'isCreating - adding selected event to selected events for waiter');
        this.form.controls.eventIds.setValue(
          [...this.form.controls.eventIds.getRawValue(), it.id].filter((value, index, array) => array.indexOf(value) === index),
        );
      }
    }
  }
  _selectedEvent?: BackendType['GetEventOrLocationMinResponse'];

  events = input.required<HasNumberIDAndName[]>();
}
