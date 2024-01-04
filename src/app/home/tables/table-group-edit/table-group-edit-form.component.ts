import {AsyncPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';

import {AppColorPicker} from '@home-shared/components/color/color-picker.component';
import {AbstractModelEditFormComponent} from '@home-shared/form/abstract-model-edit-form.component';
import {AppModelEditSaveBtn} from '@home-shared/form/app-model-edit-save-btn.component';
import {allowedCharacterSet} from '@home-shared/regex';
import {injectIsValid} from '@shared/form';
import {CreateTableGroupDto, GetTableGroupResponse, UpdateTableGroupDto} from '@shared/waiterrobot-backend';

import {DfxTr} from 'dfx-translate';

@Component({
  template: `
    @if (isValid()) {}

    <form #formRef [formGroup]="form" (ngSubmit)="submit()">
      <div class="d-flex flex-column flex-md-row gap-4 mb-5">
        <div class="form-group col">
          <label for="name">{{ 'NAME' | tr }}</label>
          <input class="form-control" type="text" id="name" formControlName="name" placeholder="{{ 'NAME' | tr }}" />

          @if (form.controls.name.invalid) {
            <small class="text-danger">
              {{ 'HOME_TABLE_GROUP_NAME_INCORRECT' | tr }}
            </small>
          }
        </div>

        <div class="d-flex flex-column">
          <label for="name">{{ 'COLOR' | tr }}</label>
          <app-color-picker
            [color]="form.controls.color.getRawValue()"
            (colorChange)="form.controls.color.setValue($event)"
            [disabled]="form.disabled"
          />
        </div>
      </div>

      <app-model-edit-save-btn [valid]="isValid()" [creating]="isCreating()" />
    </form>
  `,
  selector: 'app-table-group-edit-form',
  imports: [ReactiveFormsModule, AsyncPipe, DfxTr, AppColorPicker, AppModelEditSaveBtn],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableGroupEditFormComponent extends AbstractModelEditFormComponent<CreateTableGroupDto, UpdateTableGroupDto> {
  override form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(60), Validators.pattern(allowedCharacterSet)]],
    eventId: [-1, [Validators.required, Validators.min(0)]],
    color: new FormControl<string | undefined>(undefined),
    id: [-1],
  });

  isValid = injectIsValid(this.form);

  @Input()
  set tableGroup(it: GetTableGroupResponse | 'CREATE') {
    if (it === 'CREATE') {
      this.isCreating.set(true);
      return;
    }

    this.form.patchValue({
      name: it.name,
      id: it.id,
      color: it.color,
    });
  }

  @Input()
  set selectedEventId(id: number | undefined) {
    if (id) {
      this._selectedEventId = id;
      this.form.controls.eventId.setValue(this._selectedEventId);
    }
  }
  _selectedEventId = -1;
}
