import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ReactiveFormsModule, Validators} from '@angular/forms';
import {HasNumberIDAndName} from 'dfts-helper';
import {DfxTrackById} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';
import {allowedCharacterSet} from '../../../_shared/regex';
import {ChipInput} from '../../../_shared/ui/chip-input/chip-input.component';

import {AbstractModelEditFormComponent} from '../../../_shared/ui/form/abstract-model-edit-form.component';
import {AppIconsModule} from '../../../_shared/ui/icons.module';
import {CreateWaiterDto, GetEventOrLocationMinResponse, GetWaiterResponse, UpdateWaiterDto} from '../../../_shared/waiterrobot-backend';

@Component({
  template: `
    <ng-container *ngIf="formStatusChanges | async" />

    <form #formRef [formGroup]="form" (ngSubmit)="submit()">
      <div class="row g-3">
        <div class="form-group col-sm-12 col-md-4 col-lg-5 col-xl-6">
          <label for="name">{{ 'NAME' | tr }}</label>
          <input class="form-control bg-dark text-white" type="text" id="name" placeholder="{{ 'NAME' | tr }}" formControlName="name" />

          <small *ngIf="form.controls.name.invalid" class="text-danger">
            {{ 'HOME_WAITERS_EDIT_NAME_INCORRECT' | tr }}
          </small>
        </div>

        <chip-input
          dark="true"
          class="col-sm-12 col-md-8 col-lg-7 col-xl-6"
          placeholder="{{ 'HOME_WAITERS_EDIT_EVENTS_PLACEHOLDER' | tr }}"
          label="{{ 'HOME_WAITERS_EDIT_EVENTS' | tr }}"
          editable="false"
          [formatter]="formatter"
          [models]="_isEdit ? _waiter?.events : !!_selectedEvent ? [_selectedEvent] : []"
          [allModelsToAutoComplete]="events"
          (valueChange)="eventsChange($event)"
        >
        </chip-input>
      </div>

      <div class="d-flex flex-column flex-md-row gap-2 gap-md-4 mt-2">
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="activated" formControlName="activated" />
          <label class="form-check-label" for="activated">
            {{ 'HOME_USERS_ACTIVATED' | tr }}
          </label>
        </div>
      </div>
    </form>
  `,
  selector: 'app-waiter-edit-form',
  imports: [ReactiveFormsModule, NgIf, NgForOf, AsyncPipe, DfxTr, DfxTrackById, AppIconsModule, ChipInput],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppProductEditFormComponent extends AbstractModelEditFormComponent<CreateWaiterDto, UpdateWaiterDto> {
  override form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(70), Validators.pattern(allowedCharacterSet)]],
    eventIds: [new Array<number>()],
    organisationId: [-1, [Validators.required, Validators.min(0)]],
    activated: [true, [Validators.required]],
    id: [-1],
  });

  override reset(): void {
    super.reset();
    this.form.controls.organisationId.setValue(this._selectedOrganisationId);
    this.form.controls.eventIds.setValue(this.selectedEvents);
  }

  @Input()
  set waiter(it: GetWaiterResponse | 'CREATE') {
    if (it === 'CREATE') {
      this.isEdit = false;
      return;
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
    if (it) {
      this.lumber.log('selectedEvent', 'set selected event', it);
      this._selectedEvent = it;
      this.form.controls.eventIds.setValue(
        [...this.form.controls.eventIds.getRawValue(), it.id].filter((value, index, array) => array.indexOf(value) === index)
      );
    }
  }

  _selectedEvent?: GetEventOrLocationMinResponse;

  @Input()
  events!: HasNumberIDAndName[];

  formatter = (it: unknown): string => (it as HasNumberIDAndName).name;

  selectedEvents: number[] = [];
  eventsChange = (events: HasNumberIDAndName[]): void => {
    this.selectedEvents = events.map((a) => a.id);
    this.form.controls.eventIds.setValue(this.selectedEvents);
  };
}
