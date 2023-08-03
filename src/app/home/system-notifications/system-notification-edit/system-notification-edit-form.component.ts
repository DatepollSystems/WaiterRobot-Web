import {TextFieldModule} from '@angular/cdk/text-field';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {DfxLowerCaseExceptFirstLettersPipe} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';
import {AbstractModelEditFormComponent} from '../../../_shared/ui/form/abstract-model-edit-form.component';
import {AppIconsModule} from '../../../_shared/ui/icons.module';
import {
  CreateSystemNotificationDto,
  GetSystemNotificationResponse,
  UpdateSystemNotificationDto,
} from '../../../_shared/waiterrobot-backend';
import {systemNotificationTypes} from '../_services/system-notifications.service';

@Component({
  template: `
    <ng-container *ngIf="formStatusChanges | async" />

    <form #formRef [formGroup]="form" (ngSubmit)="submit()">
      <div class="row gy-2">
        <div class="form-group col-sm">
          <label for="title">{{ 'TITLE' | tr }}</label>
          <input class="form-control bg-dark text-white" type="text" id="title" formControlName="title" placeholder="{{ 'TITLE' | tr }}" />

          <small *ngIf="form.controls.title.invalid" class="text-danger">
            {{ 'HOME_SYSTEM_NOTIFICATIONS_TITLE_INCORRECT' | tr }}
          </small>
        </div>

        <div class="form-group col-sm">
          <label for="type">{{ 'TYPE' | tr }}</label>
          <div class="input-group">
            <span class="input-group-text bg-dark text-white" id="type-addon">
              <i-bs name="diagram-3" />
            </span>
            <select class="form-select bg-dark text-white" id="type" formControlName="type">
              <option [value]="''" disabled>{{ 'HOME_SYSTEM_NOTIFICATIONS_TYPE_DEFAULT' | tr }}</option>
              <option [value]="type" *ngFor="let type of systemNotificationTypes; trackById">
                {{ type | s_lowerCaseAllExceptFirstLetter }}
              </option>
            </select>
          </div>
          <small *ngIf="form.controls.type.invalid" class="text-danger">
            {{ 'HOME_SYSTEM_NOTIFICATIONS_TYPE_INCORRECT' | tr }}
          </small>
        </div>

        <div class="form-group col-sm">
          <label for="starts">{{ 'STARTS' | tr }}</label>
          <div class="input-group">
            <input
              type="text"
              class="form-control bg-dark text-white"
              id="starts"
              placeholder="{{ 'HOME_SYSTEM_NOTIFICATIONS_DATE_PLACEHOLDER' | tr }}"
              formControlName="starts"
            />
          </div>

          <small *ngIf="form.controls.starts.invalid" class="text-danger">
            {{ 'HOME_SYSTEM_NOTIFICATIONS_STARTS_INCORRECT' | tr }}
          </small>
        </div>

        <div class="form-group col-sm">
          <label for="ends">{{ 'ENDS' | tr }}</label>
          <div class="input-group">
            <input
              type="text"
              class="form-control bg-dark text-white"
              id="ends"
              placeholder="{{ 'HOME_SYSTEM_NOTIFICATIONS_DATE_PLACEHOLDER' | tr }}"
              formControlName="ends"
            />
          </div>

          <small *ngIf="form.controls.ends.invalid" class="text-danger">
            {{ 'HOME_SYSTEM_NOTIFICATIONS_STARTS_INCORRECT' | tr }}
          </small>
        </div>
      </div>

      <div class="row gy-2 mt-2">
        <div class="form-group">
          <label for="description">{{ 'DESCRIPTION' | tr }}</label>
          <textarea
            class="form-control bg-dark text-white"
            placeholder="{{ 'DESCRIPTION' | tr }}..."
            id="description"
            cdkTextareaAutosize
            #autosize="cdkTextareaAutosize"
            cdkAutosizeMinRows="4"
            formControlName="description"
          ></textarea>

          <small *ngIf="form.controls.description.invalid" class="text-danger">
            {{ 'HOME_SYSTEM_NOTIFICATIONS_DESCRIPTION_INCORRECT' | tr }}
          </small>
        </div>
      </div>

      <div class="d-flex flex-column flex-md-row gap-2 gap-md-4 mt-2">
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="active" formControlName="active" />
          <label class="form-check-label" for="active">
            {{ 'ACTIVE' | tr }}
          </label>
        </div>
      </div>
    </form>
  `,
  selector: 'app-system-notification-edit-form',
  imports: [ReactiveFormsModule, NgIf, AsyncPipe, DfxTr, AppIconsModule, NgForOf, TextFieldModule, DfxLowerCaseExceptFirstLettersPipe],
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

  @Input()
  set systemNotification(it: GetSystemNotificationResponse | 'CREATE') {
    if (it === 'CREATE') {
      this.isEdit = false;
      return;
    }

    this.form.patchValue(it);
  }
}