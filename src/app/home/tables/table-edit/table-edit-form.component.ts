import {AsyncPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';
import {ReactiveFormsModule, Validators} from '@angular/forms';

import {debounceTime, filter, map, switchMap, tap} from 'rxjs';

import {AbstractModelEditFormComponent} from '@home-shared/form/abstract-model-edit-form.component';
import {AppModelEditSaveBtn} from '@home-shared/form/app-model-edit-save-btn.component';
import {injectIsValid} from '@shared/form';
import {CreateTableDto, GetTableWithGroupResponse, UpdateTableDto} from '@shared/waiterrobot-backend';

import {HasNumberIDAndName} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

import {TablesService} from '../_services/tables.service';

@Component({
  template: `
    @if (isValid()) {}

    <form #formRef [formGroup]="form" (ngSubmit)="submit()" class="d-flex flex-column gap-3">
      <div class="d-flex flex-column flex-lg-row gap-4">
        <div class="form-group flex-fill">
          <label for="number">{{ 'NUMBER' | tr }}</label>
          <input formControlName="number" class="form-control" type="number" id="number" placeholder="{{ 'NUMBER' | tr }}" />

          @if (form.controls.number.errors?.required) {
            <small class="text-danger">
              {{ 'HOME_TABLES_NUMBER_INCORRECT' | tr }}
            </small>
          }

          @if ((existsAlready$ | async) && form.controls.number.errors?.existsAlready) {
            <small class="text-danger">
              {{ 'HOME_TABLES_NUMBER_EXISTS_ALREADY' | tr }}
            </small>
          }
        </div>

        <div class="form-group flex-fill">
          <label for="seats">{{ 'SEATS' | tr }}</label>
          <input formControlName="seats" class="form-control" type="number" id="seats" placeholder="{{ 'SEATS' | tr }}" />
          @if (form.controls.seats.invalid) {
            <small class="text-danger">
              {{ 'HOME_TABLES_SEATS_INCORRECT' | tr }}
            </small>
          }
        </div>

        <div class="form-group flex-fill">
          <label for="selectGroup">{{ 'HOME_TABLE_GROUPS' | tr }}</label>
          <div class="input-group">
            <span class="input-group-text" id="selectGroup-addon">
              <bi name="diagram-3" />
            </span>
            <select class="form-select" id="selectGroup" formControlName="groupId">
              <option [value]="-1" disabled>{{ 'HOME_TABLES_GROUPS_DEFAULT' | tr }}</option>
              @for (group of tableGroups; track group.id) {
                <option [value]="group.id">
                  {{ group.name }}
                </option>
              }
            </select>
          </div>

          @if (form.controls.groupId.invalid) {
            <small class="text-danger">
              {{ 'HOME_TABLES_GROUPS_INCORRECT' | tr }}
            </small>
          }
        </div>
      </div>

      <app-model-edit-save-btn [valid]="isValid()" [creating]="isCreating()" />
    </form>
  `,
  selector: 'app-table-edit-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, AsyncPipe, DfxTr, BiComponent, AppModelEditSaveBtn],
})
export class TableEditFormComponent extends AbstractModelEditFormComponent<CreateTableDto, UpdateTableDto> {
  tablesService = inject(TablesService);

  override form = this.fb.nonNullable.group({
    number: this.fb.control<number | undefined>(undefined, [Validators.required, Validators.min(0)]),
    seats: [10, [Validators.required, Validators.min(0)]],
    eventId: [-1, [Validators.required, Validators.min(0)]],
    groupId: [-1, [Validators.required, Validators.min(0)]],
    id: [-1],
  });

  isValid = injectIsValid(this.form);

  existsAlready$ = this.form.valueChanges.pipe(
    map((form) => ({number: form.number, groupId: form.groupId})),
    filter(({number, groupId}) => groupId !== -1 && !!number),
    filter(({number}) => {
      if (number === this._table?.number) {
        this.form.controls.number.setErrors(null);
        return false;
      }
      return true;
    }),
    debounceTime(300),
    switchMap(({number, groupId}) => this.tablesService.checkIfExists(groupId as number, number as number)),
    tap((exists) => {
      if (exists) {
        this.form.controls.number.setErrors({existsAlready: true});
      } else {
        this.form.controls.number.setErrors(null);
      }
    }),
  );

  _table?: GetTableWithGroupResponse;
  @Input()
  set table(it: GetTableWithGroupResponse | 'CREATE') {
    if (it === 'CREATE') {
      this.isCreating.set(true);
      return;
    }

    this._table = it;
    this.form.patchValue({
      number: it.number,
      seats: it.seats,
      groupId: it.group.id,
      id: it.id,
    });
  }

  @Input()
  set selectedTableGroupId(id: number | undefined | null) {
    if (id) {
      this.lumber.log('selectedTableGroupId', 'set selected group', id);
      this._selectedTableGroupId = id;
      this.form.controls.groupId.setValue(id);
    }
  }

  _selectedTableGroupId = -1;

  @Input()
  set selectedEventId(id: number | undefined) {
    if (id) {
      this.lumber.log('selectedEvent', 'set selected event', id);
      this._selectedEventId = id;
      this.form.controls.eventId.setValue(this._selectedEventId);
    }
  }

  _selectedEventId = -1;

  @Input()
  tableGroups!: HasNumberIDAndName[];
}
