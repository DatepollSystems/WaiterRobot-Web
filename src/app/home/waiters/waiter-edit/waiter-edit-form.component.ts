import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ReactiveFormsModule, Validators} from '@angular/forms';

import {AbstractModelEditFormComponent} from '@home-shared/form/abstract-model-edit-form.component';
import {AppModelEditSaveBtn} from '@home-shared/form/app-model-edit-save-btn.component';
import {allowedCharacterSet} from '@home-shared/regex';

import {NgSelectModule} from '@ng-select/ng-select';
import {injectIsValid} from '@shared/form';
import {CreateWaiterDto, GetEventOrLocationMinResponse, GetWaiterResponse, UpdateWaiterDto} from '@shared/waiterrobot-backend';

import {HasNumberIDAndName} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

@Component({
  template: `
    @if (isValid()) {}

    <form #formRef class="d-flex flex-column gap-3" [formGroup]="form" (ngSubmit)="submit()">
      <div class="row g-3">
        <div class="form-group col-sm-12 col-md-4 col-lg-5 col-xl-6">
          <label for="name">{{ 'NAME' | tr }}</label>
          <input class="form-control" type="text" id="name" formControlName="name" [placeholder]="'NAME' | tr" />

          @if (form.controls.name.invalid) {
            <small class="text-danger">
              {{ 'HOME_WAITERS_EDIT_NAME_INCORRECT' | tr }}
            </small>
          }
        </div>

        <div class="form-group col-sm-12 col-md-8 col-lg-7 col-xl-6">
          <label for="eventSelect">{{ 'HOME_WAITERS_EDIT_EVENTS' | tr }}</label>
          <ng-select
            bindLabel="name"
            bindValue="id"
            labelForId="eventSelect"
            clearAllText="Clear"
            formControlName="eventIds"
            [items]="events"
            [multiple]="true"
            [placeholder]="'HOME_WAITERS_EDIT_EVENTS_PLACEHOLDER' | tr"
          />
        </div>
      </div>

      <div class="d-flex flex-column flex-md-row gap-2 gap-md-4">
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" id="activated" formControlName="activated" />
          <label class="form-check-label" for="activated">
            {{ 'HOME_USERS_ACTIVATED' | tr }}
          </label>
        </div>
      </div>

      <app-model-edit-save-btn [valid]="isValid()" [creating]="isCreating()" />
    </form>
  `,
  selector: 'app-waiter-edit-form',
  imports: [ReactiveFormsModule, DfxTr, BiComponent, NgSelectModule, AppModelEditSaveBtn],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppWaiterEditFormComponent extends AbstractModelEditFormComponent<CreateWaiterDto, UpdateWaiterDto> {
  override form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(70), Validators.pattern(allowedCharacterSet)]],
    eventIds: [new Array<number>()],
    organisationId: [-1, [Validators.required, Validators.min(0)]],
    activated: [true, [Validators.required]],
    id: [-1],
  });

  isValid = injectIsValid(this.form);

  @Input()
  set waiter(it: GetWaiterResponse | 'CREATE') {
    if (it === 'CREATE') {
      this.isCreating.set(true);
      return;
    }

    if (it.deleted) {
      this.formDisabled = true;
    }

    this._waiter = it;

    this.form.patchValue({
      name: it.name,
      eventIds: it.events.map((iit) => iit.id),
      organisationId: it.organisationId,
      activated: it.activated,
      id: it.id,
    });
  }

  _waiter?: GetWaiterResponse;

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
  set selectedEvent(it: GetEventOrLocationMinResponse | undefined) {
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
  _selectedEvent?: GetEventOrLocationMinResponse;

  @Input()
  events!: HasNumberIDAndName[];
}
