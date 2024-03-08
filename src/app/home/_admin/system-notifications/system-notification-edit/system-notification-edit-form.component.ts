import {TextFieldModule} from '@angular/cdk/text-field';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';

import {AppDatetimeInputComponent} from '@home-shared/components/datetime-picker/datetime-picker.component';
import {AbstractModelEditFormComponent} from '@home-shared/form/abstract-model-edit-form.component';
import {AppModelEditSaveBtn} from '@home-shared/form/app-model-edit-save-btn.component';
import {TranslocoPipe} from '@ngneat/transloco';
import {injectIsValid} from '@shared/form';
import {CreateSystemNotificationDto, GetSystemNotificationResponse, UpdateSystemNotificationDto} from '@shared/waiterrobot-backend';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxLowerCaseExceptFirstLettersPipe} from 'dfx-helper';
import {systemNotificationTypes} from '../_services/system-notifications.service';

@Component({
  template: `
    @if (isValid()) {}

    <form #formRef class="d-flex flex-column gap-3" [formGroup]="form" (ngSubmit)="submit()">
      <div class="d-flex flex-column flex-md-row gap-4 gap-md-3">
        <div class="form-group flex-fill">
          <label for="title">{{ 'TITLE' | transloco }}</label>
          <input class="form-control" type="text" id="title" formControlName="title" [placeholder]="'TITLE' | transloco" />

          @if (form.controls.title.invalid) {
            <small class="text-danger">
              {{ 'HOME_SYSTEM_NOTIFICATIONS_TITLE_INCORRECT' | transloco }}
            </small>
          }
        </div>

        <div class="form-group flex-fill">
          <label for="type">{{ 'TYPE' | transloco }}</label>
          <div class="input-group">
            <span class="input-group-text" id="type-addon">
              <bi name="diagram-3" />
            </span>
            <select class="form-select" id="type" formControlName="type">
              <option disabled [value]="''">{{ 'HOME_SYSTEM_NOTIFICATIONS_TYPE_DEFAULT' | transloco }}</option>
              @for (type of systemNotificationTypes; track type) {
                <option [value]="type">
                  {{ type | s_lowerCaseAllExceptFirstLetter }}
                </option>
              }
            </select>
          </div>
          @if (form.controls.type.invalid) {
            <small class="text-danger">
              {{ 'HOME_SYSTEM_NOTIFICATIONS_TYPE_INCORRECT' | transloco }}
            </small>
          }
        </div>

        <div class="form-group flex-fill">
          <label for="starts">{{ 'STARTS' | transloco }}</label>

          <app-datetime-input
            id="starts"
            formControlName="starts"
            minuteStep="15"
            [seconds]="false"
            [placeholder]="'DATETIME_PLACEHOLDER' | transloco"
          />
        </div>

        <div class="form-group flex-fill">
          <label for="ends">{{ 'ENDS' | transloco }}</label>
          <app-datetime-input
            id="ends"
            formControlName="ends"
            minuteStep="15"
            [seconds]="false"
            [placeholder]="'DATETIME_PLACEHOLDER' | transloco"
          />
        </div>
      </div>

      <div class="form-group">
        <label for="description">{{ 'DESCRIPTION' | transloco }}</label>
        <textarea
          #autosize="cdkTextareaAutosize"
          class="form-control"
          id="description"
          formControlName="description"
          [placeholder]="('DESCRIPTION' | transloco) + '...'"
          [cdkTextareaAutosize]="true"
          [cdkAutosizeMinRows]="4"
        ></textarea>

        @if (form.controls.description.invalid) {
          <small class="text-danger">
            {{ 'HOME_SYSTEM_NOTIFICATIONS_DESCRIPTION_INCORRECT' | transloco }}
          </small>
        }
      </div>

      <div class="d-flex flex-column flex-md-row gap-2 gap-md-4 mt-2">
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" id="active" formControlName="active" />
          <label class="form-check-label" for="active">
            {{ 'ACTIVE' | transloco }}
          </label>
        </div>
      </div>

      <app-model-edit-save-btn [valid]="isValid()" [creating]="isCreating()" />
    </form>
  `,
  selector: 'app-system-notification-edit-form',
  imports: [
    ReactiveFormsModule,
    TranslocoPipe,
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
