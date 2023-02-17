import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {HasNumberIDAndName} from 'dfts-helper';
import {DfxTrackById} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';

import {AbstractModelEditFormComponent} from '../../../_shared/ui/form/abstract-model-edit-form.component';
import {AppIconsModule} from '../../../_shared/ui/icons.module';
import {CreateProductGroupDto, GetProductGroupResponse, UpdateProductGroupDto} from '../../../_shared/waiterrobot-backend';

@Component({
  template: `
    <ng-container *ngIf="form.statusChanges | async"></ng-container>

    <form [formGroup]="form" (ngSubmit)="submit()">
      <div class="d-flex flex-column flex-md-row gap-4 mb-4">
        <div class="form-group col">
          <label for="name">{{ 'NAME' | tr }}</label>
          <input class="form-control bg-dark text-white" type="text" id="name" formControlName="name" placeholder="{{ 'NAME' | tr }}" />

          <small *ngIf="form.controls.name.invalid" class="text-danger">
            {{ 'HOME_PROD_GROUP_NAME_INCORRECT' | tr }}
          </small>
        </div>

        <div class="col" *ngIf="this._isEdit">
          <div class="form-group mb-2">
            <label for="selectPrinter">{{ 'NAV_PRINTERS' | tr }}</label>
            <div class="input-group">
              <span class="input-group-text bg-dark text-white" id="selectPrinter-addon"><i-bs name="diagram-3"></i-bs></span>
              <select class="form-select bg-dark text-white" id="selectPrinter" formControlName="printerId">
                <option [ngValue]="-1">{{ 'HOME_PROD_PRINTER_SELECT_DEFAULT' | tr }}</option>
                <option [ngValue]="printer.id" *ngFor="let printer of this.printers; trackById">
                  {{ printer.name }}
                </option>
              </select>
            </div>
            <small *ngIf="form.controls.printerId.invalid" class="text-danger">
              {{ 'HOME_PROD_GROUP_ID_INCORRECT' | tr }}
            </small>
          </div>

          <div class="form-check form-switch mt-2">
            <input class="form-check-input" type="checkbox" role="switch" id="updatePrinter" [formControl]="updatePrinterFormControl" />
            <label class="form-check-label" for="updatePrinter">{{ 'HOME_PROD_GROUP_PRINTER_UPDATE' | tr }}</label>
          </div>
        </div>
      </div>
    </form>
  `,
  selector: 'app-product-group-edit-form',
  imports: [ReactiveFormsModule, NgIf, NgForOf, AsyncPipe, DfxTr, DfxTrackById, AppIconsModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductGroupEditFormComponent extends AbstractModelEditFormComponent<CreateProductGroupDto, UpdateProductGroupDto> {
  override form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(60)]],
    eventId: [-1, [Validators.required, Validators.min(0)]],
    printerId: [-1],
    id: [-1],
  });

  override overrideRawValue = (value: any): any => {
    if (value.printerId === -1) {
      value.printerId = undefined;
    }

    return super.overrideRawValue(value);
  };

  override reset(): void {
    super.reset();

    this.form.controls.eventId.setValue(this._selectedEventId);
  }

  updatePrinterFormControl = new FormControl(false);

  constructor() {
    super();
    this.form.controls.printerId.disable();
    this.unsubscribe(
      this.updatePrinterFormControl.valueChanges.subscribe((value) =>
        value ? this.form.controls.printerId.enable() : this.form.controls.printerId.disable()
      )
    );
  }

  @Input()
  set productGroup(it: GetProductGroupResponse | 'CREATE') {
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

  @Input()
  printers!: HasNumberIDAndName[];
}
