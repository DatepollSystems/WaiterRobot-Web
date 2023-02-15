import {AsyncPipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ReactiveFormsModule, Validators} from '@angular/forms';
import {DfxTr} from 'dfx-translate';

import {AbstractModelEditFormComponent} from '../../../_shared/ui/form/abstract-model-edit-form.component';
import {AppIconsModule} from '../../../_shared/ui/icons.module';
import {CreateTableGroupDto, GetTableGroupResponse, UpdateTableGroupDto} from '../../../_shared/waiterrobot-backend';

@Component({
  template: `
    <ng-container *ngIf="form.statusChanges | async"></ng-container>

    <form [formGroup]="form" (ngSubmit)="submit()">
      <div class="d-flex flex-column flex-md-row gap-4 mb-4">
        <div class="form-group col">
          <label for="name">{{ 'NAME' | tr }}</label>
          <input class="form-control bg-dark text-white" type="text" id="name" formControlName="name" placeholder="{{ 'NAME' | tr }}" />

          <small *ngIf="form.controls.name.invalid" class="text-danger">
            {{ 'HOME_TABLE_GROUP_NAME_INCORRECT' | tr }}
          </small>
        </div>
      </div>
    </form>
  `,
  selector: 'app-table-group-edit-form',
  imports: [ReactiveFormsModule, NgIf, AsyncPipe, DfxTr, AppIconsModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableGroupEditFormComponent extends AbstractModelEditFormComponent<CreateTableGroupDto, UpdateTableGroupDto> {
  override form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(60)]],
    eventId: [-1, [Validators.required, Validators.min(0)]],
    id: [-1],
  });

  override reset() {
    super.reset();

    this.form.controls.eventId.setValue(this._selectedEventId);
  }

  @Input()
  set tableGroup(it: GetTableGroupResponse | 'CREATE') {
    if (it === 'CREATE') {
      this.isEdit = false;
      return;
    }

    this.form.patchValue({
      name: it.name,
      id: it.id,
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
