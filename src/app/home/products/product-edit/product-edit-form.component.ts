import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ReactiveFormsModule, Validators} from '@angular/forms';

import {a_pluck, HasNumberIDAndName, n_from, s_from} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTrackById} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';

import {allowedCharacterSet} from '../../../_shared/regex';
import {ChipInput} from '../../../_shared/ui/chip-input/chip-input.component';
import {AbstractModelEditFormComponent} from '../../../_shared/ui/form/abstract-model-edit-form.component';
import {CreateProductDto, GetProductMaxResponse, UpdateProductDto} from '../../../_shared/waiterrobot-backend';

@Component({
  template: `
    <ng-container *ngIf="formStatusChanges | async" />

    <form #formRef [formGroup]="form" (ngSubmit)="submit()">
      <div class="d-flex flex-column flex-md-row gap-4 mb-3">
        <div class="form-group col">
          <label for="name">{{ 'NAME' | tr }}</label>
          <input formControlName="name" class="form-control" type="text" id="name" placeholder="{{ 'NAME' | tr }}" />

          <small *ngIf="form.controls.name.invalid" class="text-danger">
            {{ 'HOME_PROD_NAME_INCORRECT' | tr }}
          </small>
        </div>

        <div class="form-group col-12 col-md-3 col-lg-2">
          <label for="price">{{ 'PRICE' | tr }}</label>
          <input class="form-control" type="string" id="price" placeholder="{{ 'PRICE' | tr }}" formControlName="price" />

          <small *ngIf="form.controls.price.invalid" class="text-danger">
            {{ 'HOME_PROD_PRICE_INCORRECT' | tr }}
          </small>
        </div>

        <chip-input
          class="col"
          editable="false"
          label="{{ 'HOME_PROD_ALLERGENS' | tr }}"
          placeholder="{{ 'HOME_PROD_ALLERGENS_PLACEHOLDER' | tr }}"
          [minInputLengthKick]="0"
          [formatter]="formatter"
          [models]="_product?.allergens"
          [allModelsToAutoComplete]="allergens"
          (valueChange)="allergenChange($event)"
        />
      </div>

      <div class="d-flex flex-column flex-md-row gap-4 mb-3">
        <div class="form-group col">
          <label for="selectGroup">{{ 'HOME_PROD_GROUPS' | tr }}</label>
          <div class="input-group">
            <span class="input-group-text" id="selectGroup-addon">
              <bi name="diagram-3" />
            </span>
            <select class="form-select" id="selectGroup" formControlName="groupId">
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
            <span class="input-group-text" id="selectPrinter-addon">
              <bi name="diagram-3" />
            </span>
            <select class="form-select" id="selectPrinter" formControlName="printerId">
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

        <div class="form-group col-12 col-md-3 col-lg-2">
          <label for="initialStock">{{ 'HOME_PROD_AMOUNT_LEFT_SET' | tr }}</label>
          <input
            class="form-control"
            type="number"
            id="initialStock"
            placeholder="{{ 'HOME_PROD_AMOUNT_LEFT_SET' | tr }}"
            formControlName="initialStock"
          />
          <small *ngIf="form.controls.initialStock.invalid" class="text-danger">
            {{ 'HOME_PROD_AMOUNT_LEFT_SET_INCORRECT' | tr }}
          </small>
          <small *ngIf="form.controls.initialStock.value && _product" class="d-flex justify-content-between">
            <span>{{ 'HOME_PROD_AMOUNT_LEFT' | tr }}: {{ form.controls.initialStock.value - _product.amountOrdered }}</span>
            <span>{{ 'HOME_PROD_AMOUNT_ORDERED' | tr }}: {{ _product.amountOrdered }}</span>
          </small>
        </div>
      </div>

      <div class="d-flex flex-column flex-md-row gap-2 gap-md-5 mb-3">
        <div class="form-check form-switch">
          <input formControlName="soldOut" class="form-check-input" type="checkbox" id="soldOut" />
          <label class="form-check-label" for="soldOut">
            {{ 'HOME_PROD_SOLD_OUT' | tr }}
          </label>
        </div>

        <div class="form-check" *ngIf="_isEdit">
          <input formControlName="resetOrderedProducts" class="form-check-input" type="checkbox" id="resetOrderedProducts" />
          <label class="form-check-label" for="resetOrderedProducts">
            {{ 'HOME_PROD_AMOUNT_ORDERED_RESET' | tr }}
          </label>
        </div>
      </div>
    </form>
  `,
  selector: 'app-product-edit-form',
  imports: [ReactiveFormsModule, NgIf, NgForOf, AsyncPipe, DfxTr, DfxTrackById, BiComponent, ChipInput],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppProductEditFormComponent extends AbstractModelEditFormComponent<CreateProductDto, UpdateProductDto> {
  override form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(70), Validators.pattern(allowedCharacterSet)]],
    price: ['', [Validators.required, Validators.pattern(/^\d+([.,](\d{1,2}|[0-8]\d?))?$/)]],
    allergenIds: [new Array<number>()],
    eventId: [-1, [Validators.required, Validators.min(0)]],
    groupId: [-1, [Validators.required, Validators.min(0)]],
    printerId: [-1, [Validators.required, Validators.min(0)]],
    soldOut: [false, [Validators.required]],
    resetOrderedProducts: [false],
    initialStock: [null as number | null, [Validators.min(0)]],
    id: [-1],
  });

  override overrideRawValue = (value: typeof this.form.value): unknown => {
    const match: string[] = s_from(value.price).split(/[,.]/);
    const euro = n_from(match[0] ?? 0);
    const cent = n_from(match[1]?.padEnd(2, '0') ?? 0);
    // @ts-ignore
    value.price = euro * 100 + cent;

    this.lumber.log('overrideRawValue', 'Euro to cent', match, value.price);

    return super.overrideRawValue(value);
  };

  @Input()
  set product(it: GetProductMaxResponse | 'CREATE') {
    if (it === 'CREATE') {
      this.isEdit = false;
      return;
    }

    this._product = it;

    this.form.patchValue({
      name: it.name,
      price: s_from(it.price / 100),
      allergenIds: a_pluck(it.allergens, 'id') ?? [],
      groupId: it.group.id,
      printerId: it.printer.id,
      soldOut: it.soldOut,
      initialStock: it.initialStock,
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
