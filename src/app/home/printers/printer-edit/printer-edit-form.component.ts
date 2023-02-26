import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ReactiveFormsModule, Validators} from '@angular/forms';
import {HasNumberIDAndName} from 'dfts-helper';
import {DfxTrackById} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';
import {AbstractModelEditFormComponent} from '../../../_shared/ui/form/abstract-model-edit-form.component';
import {AppIconsModule} from '../../../_shared/ui/icons.module';

import {CreatePrinterDto, GetPrinterResponse, UpdatePrinterDto} from '../../../_shared/waiterrobot-backend';

@Component({
  template: `
    <ng-container *ngIf="form.statusChanges | async" />

    <form [formGroup]="form" (ngSubmit)="submit()">
      <div class="d-flex flex-column flex-md-row gap-4 mb-4">
        <div class="col form-group">
          <label for="name">{{ 'NAME' | tr }}</label>
          <input class="form-control bg-dark text-white" type="text" id="name" formControlName="name" placeholder="{{ 'NAME' | tr }}" />

          <small *ngIf="form.controls.name.invalid" class="text-danger">
            {{ 'HOME_PRINTER_NAME_INCORRECT' | tr }}
          </small>
        </div>

        <div class="col form-group">
          <label for="name">{{ 'HOME_PRINTER_NAME' | tr }}</label>
          <input
            class="form-control bg-dark text-white"
            type="text"
            id="printerName"
            formControlName="printerName"
            placeholder="{{ 'NAME' | tr }}" />

          <small *ngIf="form.controls.printerName.invalid" class="text-danger">
            {{ 'HOME_PRINTER_NAME_NAME_INCORRECT' | tr }}
          </small>
        </div>
      </div>

      <div class="d-flex flex-column flex-md-row gap-4">
        <div class="col-12 col-md-6 form-group">
          <label for="eventId">{{ 'NAV_EVENTS' | tr }}</label>
          <div class="input-group">
            <span class="input-group-text bg-dark text-white" id="eventId-addon"><i-bs name="diagram-3" /></span>
            <select class="form-select bg-dark text-white" id="eventId" formControlName="eventId">
              <option [value]="-1" disabled>{{ 'HOME_PRINTER_SELECT_EVENT_DEFAULT' | tr }}</option>
              <option [value]="event.id" *ngFor="let event of this.events; trackById">
                {{ event.name }}
              </option>
            </select>
          </div>
          <small *ngIf="form.controls.eventId.invalid" class="text-danger">
            {{ 'HOME_PRINTER_SELECT_EVENT_INCORRECT' | tr }}
          </small>
        </div>
      </div>
    </form>
  `,
  selector: 'app-printer-edit-form',
  imports: [ReactiveFormsModule, NgIf, NgForOf, AsyncPipe, DfxTr, DfxTrackById, AppIconsModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppPrinterEditForm extends AbstractModelEditFormComponent<CreatePrinterDto, UpdatePrinterDto> {
  override form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(120)]],
    printerName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(70)]],
    eventId: [-1, [Validators.required, Validators.min(0)]],
    id: [-1],
  });

  @Input()
  set printer(it: GetPrinterResponse | 'CREATE') {
    if (it === 'CREATE') {
      this.isEdit = false;
      return;
    }

    this.form.setValue({
      name: it.name,
      printerName: it.printerName,
      eventId: it.eventId,
      id: it.id,
    });
  }

  @Input()
  events!: HasNumberIDAndName[];
}
