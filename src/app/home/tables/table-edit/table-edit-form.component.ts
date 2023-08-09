import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';
import {ReactiveFormsModule, Validators} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {HasNumberIDAndName} from 'dfts-helper';
import {DfxTrackById} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';
import {debounceTime, filter, map, switchMap, tap} from 'rxjs';
import {MobileLinkService} from '../../../_shared/services/mobile-link.service';
import {AbstractModelEditFormComponent} from '../../../_shared/ui/form/abstract-model-edit-form.component';
import {AppIconsModule} from '../../../_shared/ui/icons.module';
import {CreateTableDto, GetTableResponse, UpdateTableDto} from '../../../_shared/waiterrobot-backend';
import {TablesService} from '../_services/tables.service';

@Component({
  template: `
    <ng-container *ngIf="formStatusChanges | async" />

    <form #formRef [formGroup]="form" (ngSubmit)="submit()" class="d-flex flex-column flex-md-row gap-4 mb-3">
      <div class="form-group col-12 col-md-3">
        <label for="number">{{ 'NUMBER' | tr }}</label>
        <input
          formControlName="number"
          class="form-control bg-dark text-white"
          type="number"
          id="number"
          placeholder="{{ 'NUMBER' | tr }}"
        />

        <small *ngIf="form.controls.number.errors?.required" class="text-danger">
          {{ 'HOME_TABLES_NUMBER_INCORRECT' | tr }}
        </small>

        <small *ngIf="(existsAlready$ | async) && form.controls.number.errors?.existsAlready" class="text-danger">
          {{ 'HOME_TABLES_NUMBER_EXISTS_ALREADY' | tr }}
        </small>
      </div>

      <div class="form-group col-12 col-md-3">
        <label for="seats">{{ 'SEATS' | tr }}</label>
        <input formControlName="seats" class="form-control bg-dark text-white" type="number" id="seats" placeholder="{{ 'SEATS' | tr }}" />
        <small *ngIf="form.controls.seats.invalid" class="text-danger">
          {{ 'HOME_TABLES_SEATS_INCORRECT' | tr }}
        </small>
      </div>

      <div class="form-group col">
        <label for="selectGroup">{{ 'HOME_TABLE_GROUPS' | tr }}</label>
        <div class="input-group">
          <span class="input-group-text bg-dark text-white" id="selectGroup-addon">
            <i-bs name="diagram-3" />
          </span>
          <select class="form-select bg-dark text-white" id="selectGroup" formControlName="groupId">
            <option [value]="-1" disabled>{{ 'HOME_TABLES_GROUPS_DEFAULT' | tr }}</option>
            <option [value]="group.id" *ngFor="let group of tableGroups; trackById">
              {{ group.name }}
            </option>
          </select>
        </div>

        <small *ngIf="form.controls.groupId.invalid" class="text-danger">
          {{ 'HOME_TABLES_GROUPS_INCORRECT' | tr }}
        </small>
      </div>
    </form>
    <div class="form-group col-12 col-md-5" *ngIf="publicTableIdLink">
      <label for="publicId">{{ 'HOME_TABLES_PUBLIC_ID' | tr }}</label>
      <div class="input-group">
        <input class="form-control bg-dark text-white" type="text" id="publicId" [value]="publicTableIdLink" readonly />
        <a [href]="publicTableIdLink" target="_blank" class="btn btn-outline-light" type="button">{{ 'OPEN' | tr }}</a>
      </div>
    </div>
  `,
  selector: 'app-table-edit-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, AsyncPipe, NgIf, NgForOf, DfxTr, DfxTrackById, AppIconsModule, RouterLink],
})
export class TableEditFormComponent extends AbstractModelEditFormComponent<CreateTableDto, UpdateTableDto> {
  tablesService = inject(TablesService);
  ml = inject(MobileLinkService);

  publicTableIdLink?: string;

  override form = this.fb.nonNullable.group({
    number: this.fb.control<number | undefined>(undefined, [Validators.required, Validators.min(0)]),
    seats: [10, [Validators.required, Validators.min(0)]],
    eventId: [-1, [Validators.required, Validators.min(0)]],
    groupId: [-1, [Validators.required, Validators.min(0)]],
    id: [-1],
  });

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

  _table?: GetTableResponse;
  @Input()
  set table(it: GetTableResponse | 'CREATE') {
    if (it === 'CREATE') {
      this.isEdit = false;
      return;
    }

    this._table = it;
    this.publicTableIdLink = this.ml.createTableLink(it.publicId);
    this.form.patchValue({
      number: it.number,
      seats: it.seats,
      groupId: it.groupId,
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
