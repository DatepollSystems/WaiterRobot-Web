import {TextFieldModule} from '@angular/cdk/text-field';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxLowerCaseExceptFirstLettersPipe} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';

import {AppDatetimeInputComponent} from '../../../_shared/ui/datetime-picker/datetime-picker.component';
import {AbstractModelEditFormComponent} from '../../../_shared/ui/form/abstract-model-edit-form.component';
import {AppModelEditSaveBtn} from '../../../_shared/ui/form/app-model-edit-save-btn.component';
import {injectIsValid} from '../../../_shared/ui/form/tab';
import {
  CreateSystemNotificationDto,
  GetSystemNotificationResponse,
  UpdateSystemNotificationDto,
} from '../../../_shared/waiterrobot-backend';
import {systemNotificationTypes} from '../_services/system-notifications.service';

@Component({
  template: `
    @if (isValid()) {}

    <form #formRef [formGroup]="form" (ngSubmit)="submit()">
      <div class="row gy-2">
        <div class="form-group col-sm">
          <label for="title">{{ 'TITLE' | tr }}</label>
          <input class="form-control" type="text" id="title" formControlName="title" placeholder="{{ 'TITLE' | tr }}" />

          @if (form.controls.title.invalid) {
            <small class="text-danger">
              {{ 'HOME_SYSTEM_NOTIFICATIONS_TITLE_INCORRECT' | tr }}
            </small>
          }
        </div>

        <div class="form-group col-sm">
          <label for="type">{{ 'TYPE' | tr }}</label>
          <div class="input-group">
            <span class="input-group-text" id="type-addon">
              <bi name="diagram-3" />
            </span>
            <select class="form-select" id="type" formControlName="type">
              <option [value]="''" disabled>{{ 'HOME_SYSTEM_NOTIFICATIONS_TYPE_DEFAULT' | tr }}</option>
              @for (type of systemNotificationTypes; track type) {
                <option [value]="type">
                  {{ type | s_lowerCaseAllExceptFirstLetter }}
                </option>
              }
            </select>
          </div>
          @if (form.controls.type.invalid) {
            <small class="text-danger">
              {{ 'HOME_SYSTEM_NOTIFICATIONS_TYPE_INCORRECT' | tr }}
            </small>
          }
        </div>

        <div class="form-group col-sm">
          <label for="starts">{{ 'STARTS' | tr }}</label>

          <app-datetime-input
            id="starts"
            formControlName="starts"
            minuteStep="15"
            [seconds]="false"
            placeholder="{{ 'DATETIME_PLACEHOLDER' | tr }}"
          />
        </div>

        <div class="form-group col-sm">
          <label for="ends">{{ 'ENDS' | tr }}</label>
          <app-datetime-input
            id="ends"
            formControlName="ends"
            minuteStep="15"
            [seconds]="false"
            placeholder="{{ 'DATETIME_PLACEHOLDER' | tr }}"
          />
        </div>
      </div>

      <div class="row gy-2 mt-2">
        <div class="form-group">
          <label for="description">{{ 'DESCRIPTION' | tr }}</label>
          <textarea
            class="form-control"
            placeholder="{{ 'DESCRIPTION' | tr }}..."
            id="description"
            #autosize="cdkTextareaAutosize"
            [cdkTextareaAutosize]="true"
            [cdkAutosizeMinRows]="4"
            formControlName="description"
          ></textarea>

          @if (form.controls.description.invalid) {
            <small class="text-danger">
              {{ 'HOME_SYSTEM_NOTIFICATIONS_DESCRIPTION_INCORRECT' | tr }}
            </small>
          }
        </div>
      </div>

      <div class="d-flex flex-column flex-md-row gap-2 gap-md-4 mt-2">
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" id="active" formControlName="active" />
          <label class="form-check-label" for="active">
            {{ 'ACTIVE' | tr }}
          </label>
        </div>
      </div>

      <app-model-edit-save-btn [valid]="isValid()" [creating]="isCreating()" />
    </form>
  `,
  selector: 'app-system-notification-edit-form',
  imports: [
    ReactiveFormsModule,
    DfxTr,
    BiComponent,
    TextFieldModule,
    DfxLowerCaseExceptFirstLettersPipe,
    AppDatetimeInputComponent,
    AppModelEditSaveBtn,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SystemNotificationEditFormComponent extends AbstractModelEditFormComponent<
  CreateSystemNotificationDto,
  UpdateSystemNotificationDto
> {
  systemNotificationTypes = systemNotificationTypes;

  override form = this.fb.nonNullable.group({
    title: ['', [Validators.minLength(1), Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(2000)]],
    type: ['', [Validators.required, Validators.minLength(1)]],
    starts: new FormControl<string | null>(null),
    ends: new FormControl<string | null>(null),
    active: [true],
    id: [-1],
  });

  isValid = injectIsValid(this.form);

  @Input()
  set systemNotification(it: GetSystemNotificationResponse | 'CREATE') {
    if (it === 'CREATE') {
      this.isCreating.set(true);
      return;
    }

    this.form.patchValue(it);
  }
}
