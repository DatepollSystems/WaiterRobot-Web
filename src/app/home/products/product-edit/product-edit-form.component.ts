import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ReactiveFormsModule, Validators} from '@angular/forms';
import {a_pluck, HasNumberIDAndName, n_from, s_from} from 'dfts-helper';
import {DfxTrackById} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';
import {ChipInput} from '../../../_shared/ui/chip-input/chip-input.component';

import {AbstractModelEditFormComponent} from '../../../_shared/ui/form/abstract-model-edit-form.component';
import {AppIconsModule} from '../../../_shared/ui/icons.module';
import {CreateProductDto, GetProductMaxResponse, UpdateProductDto} from '../../../_shared/waiterrobot-backend';

@Component({
  template: `
    <ng-container *ngIf="formStatusChanges | async" />

    <form #formRef [formGroup]="form" (ngSubmit)="submit()">
      <div class="d-flex flex-column flex-md-row gap-4 mb-3">
        <div class="form-group col">
          <label for="name">{{ 'NAME' | tr }}</label>
          <input formControlName="name" class="form-control bg-dark text-white" type="text" id="name" placeholder="{{ 'NAME' | tr }}" />

          <small *ngIf="form.controls.name.invalid" class="text-danger">
            {{ 'HOME_PROD_NAME_INCORRECT' | tr }}
          </small>
        </div>

        <div class="form-group col-12 col-md-3 col-lg-2">
          <label for="price">{{ 'HOME_PROD_PRICE' | tr }}</label>
          <input
            class="form-control bg-dark text-white"
            type="string"
            id="price"
            placeholder="{{ 'HOME_PROD_PRICE' | tr }}"
            formControlName="price"
          />

          <small *ngIf="form.controls.price.invalid" class="text-danger">
            {{ 'HOME_PROD_PRICE_INCORRECT' | tr }}
          </small>
        </div>

        <chip-input
          class="col"
          dark="true"
          editable="false"
          label="{{ 'HOME_PROD_ALLERGENS' | tr }}"
          placeholder="{{ 'HOME_PROD_ALLERGENS_PLACEHOLDER' | tr }}"
          [models]="_product?.allergens"
          [allModelsToAutoComplete]="allergens"
          [formatter]="formatter"
          (valueChange)="allergenChange($event)"
        />
      </div>

      <div class="d-flex flex-column flex-md-row gap-4 mb-3">
        <div class="form-group col">
          <label for="selectGroup">{{ 'HOME_PROD_GROUP' | tr }}</label>
          <div class="input-group">
            <span class="input-group-text bg-dark text-white" id="selectGroup-addon">
              <i-bs name="diagram-3" />
            </span>
            <select class="form-select bg-dark text-white" id="selectGroup" formControlName="groupId">
              <option [value]="-1" disabled>{{ 'HOME_PROD_GROUPS_DEFAULT' | tr }}</option>
              <option [value]="productGroup.id" *ngFor="let productGroup of productGroups; trackById">
                {{ productGroup.name }}
              </option>
            </select>
          </div>
          <small *ngIf="form.controls.groupId.invalid" class="text-danger">
            {{ 'HOME_PROD_GROUP_ID_INCORRECT' | tr }}
          </small>
        </div>

        <div class="form-group col">
          <label for="selectPrinter">{{ 'NAV_PRINTERS' | tr }}</label>
          <div class="input-group">
            <span class="input-group-text bg-dark text-white" id="selectPrinter-addon">
              <i-bs name="diagram-3" />
            </span>
            <select class="form-select bg-dark text-white" id="selectPrinter" formControlName="printerId">
              <option [value]="-1" disabled>{{ 'HOME_PROD_PRINTER_SELECT_DEFAULT' | tr }}</option>
              <option [value]="printer.id" *ngFor="let printer of this.printers; trackById">
                {{ printer.name }}
              </option>
            </select>
          </div>
          <small *ngIf="form.controls.printerId.invalid" class="text-danger">
            {{ 'HOME_PROD_PRINTER_ID_INCORRECT' | tr }}
          </small>
        </div>
      </div>

      <div class="d-flex flex-column flex-md-row gap-2 gap-md-4 mt-2">
        <div class="form-check">
          <input formControlName="soldOut" class="form-check-input" type="checkbox" id="soldOut" />
          <label class="form-check-label" for="soldOut">
            {{ 'HOME_PROD_SOLD_OUT' | tr }}
          </label>
        </div>
      </div>
    </form>
  `,
  selector: 'app-product-edit-form',
  imports: [ReactiveFormsModule, NgIf, NgForOf, AsyncPipe, DfxTr, DfxTrackById, AppIconsModule, ChipInput],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppProductEditFormComponent extends AbstractModelEditFormComponent<CreateProductDto, UpdateProductDto> {
  override form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(70)]],
    price: ['', [Validators.required, Validators.pattern(/^\d+([.,](\d{1,2}|[0-8]\d?))?$/)]],
    allergenIds: [new Array<number>()],
    eventId: [-1, [Validators.required, Validators.min(0)]],
    groupId: [-1, [Validators.required, Validators.min(0)]],
    printerId: [-1, [Validators.required, Validators.min(0)]],
    soldOut: [false, [Validators.required]],
    id: [-1],
  });

  override overrideRawValue = (value: any): any => {
    console.log(value.price);

    const result: string[] = value.price.split(/[,.]/);
    value.price = n_from(result[0]!) * 100 + n_from(result[1] ?? 0);
    console.log(result);

    console.log(value.price);

    return super.overrideRawValue(value);
  };

  override reset(): void {
    super.reset();
    this.form.controls.eventId.setValue(this._selectedEventId);
    this.form.controls.groupId.setValue(this._selectedProductGroupId);
    this.form.controls.allergenIds.setValue(this.selectedAllergens);
  }

  @Input()
  set product(it: GetProductMaxResponse | 'CREATE') {
    if (it === 'CREATE') {
      this.isEdit = false;
      return;
    }

    this._product = it;

    this.form.patchValue({
      name: it.name,
      price: s_from(it.price),
      allergenIds: a_pluck(it.allergens, 'id') ?? [],
      groupId: it.group.id,
      printerId: it.printer.id,
      soldOut: it.soldOut,
      id: it.id,
    });
  }

  _product?: GetProductMaxResponse;

  @Input()
  set selectedProductGroupId(id: number | undefined | null) {
    if (id) {
      this.lumber.log('selectedProductGroupId', 'set selected group', id);
      this._selectedProductGroupId = id;
      this.form.controls.groupId.setValue(id);
    }
  }
  _selectedProductGroupId = -1;

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
  productGroups!: HasNumberIDAndName[];

  @Input()
  printers!: HasNumberIDAndName[];

  @Input()
  allergens!: HasNumberIDAndName[];

  formatter = (it: unknown): string => (it as HasNumberIDAndName).name;

  selectedAllergens: number[] = [];
  allergenChange = (allergens: HasNumberIDAndName[]): void => {
    this.selectedAllergens = allergens.map((a) => a.id);
    this.form.controls.allergenIds.setValue(this.selectedAllergens);
  };
}
