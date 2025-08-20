import {ChangeDetectionStrategy, Component, Input, input} from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {RouterLink} from '@angular/router';

import {TranslocoPipe} from '@jsverse/transloco';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import {a_pluck, s_from} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';

import {APIType} from '../../../api';
import {AppColorPicker} from '../../../components/color/color-picker.component';
import {AbstractModelEditFormComponent} from '../../../forms/form/abstract-model-edit-form.component';
import {AppModelEditSaveBtn} from '../../../forms/form/app-model-edit-save-btn.component';
import {injectIsValid} from '../../../util/form';
import {allowedCharacterSet, s_toCurrencyNumber} from '../../../util/regex';

@Component({
  template: `
    @if (isValid()) {}

    <form #formRef [formGroup]="form" (ngSubmit)="submit()">
      <div class="d-flex flex-column flex-md-row gap-4 mb-3">
        <div class="form-group col">
          <label for="name">{{ 'NAME' | transloco }}</label>
          <input class="form-control" id="name" [placeholder]="'NAME' | transloco" formControlName="name" type="text" />

          @if (form.controls.name.invalid) {
            <small class="text-danger">
              {{ 'HOME_PROD_NAME_INCORRECT' | transloco }}
            </small>
          }
        </div>

        <div class="form-group col-12 col-md-3 col-lg-2">
          <label for="price">{{ 'PRICE' | transloco }}</label>
          <div class="input-group">
            <input class="form-control" id="price" [placeholder]="'PRICE' | transloco" type="text" formControlName="price" />
            <span class="input-group-text">€</span>
          </div>

          @if (form.controls.price.invalid) {
            <small class="text-danger">
              {{ 'HOME_PROD_PRICE_INCORRECT' | transloco }}
            </small>
          }
        </div>

        <div class="form-group col">
          <label for="allergenSelect">{{ 'HOME_PROD_ALLERGENS' | transloco }}</label>
          <ng-select
            [items]="allergens()"
            [multiple]="true"
            [placeholder]="'HOME_PROD_ALLERGENS_PLACEHOLDER' | transloco"
            bindLabel="name"
            bindValue="id"
            labelForId="allergenSelect"
            clearAllText="Clear"
            formControlName="allergenIds"
          >
            <ng-template let-item="item" let-clear="clear" ng-label-tmp>
              <span class="ng-value-icon left" (mousedown)="clear(item)" aria-hidden="true">×</span>
              <span class="ng-value-label">({{ item.shortName }}) {{ item.name }}</span>
            </ng-template>
          </ng-select>
        </div>
      </div>

      <div class="d-flex flex-column flex-md-row gap-4 mb-3">
        <div class="col">
          <div class="d-flex flex-column">
            <label for="name">{{ 'COLOR' | transloco }}</label>
            <app-color-picker
              [color]="form.controls.color.getRawValue()"
              [disabled]="form.disabled"
              (colorChange)="form.controls.color.setValue($event)"
            />
          </div>
        </div>

        <div class="form-group col">
          <label for="selectGroup">{{ 'HOME_PROD_GROUPS' | transloco }}</label>
          <div class="input-group">
            @if (isCreating()) {
              <span class="input-group-text" id="selectGroup-addon">
                <bi name="diagram-3" />
              </span>
            } @else {
              <a
                class="input-group-text"
                id="selectGroup-addon"
                [routerLink]="'../../' + form.controls.groupId.value"
                [ngbTooltip]="('HOME_PROD_GROUP' | transloco) + ('OPEN_2' | transloco)"
                placement="bottom"
              >
                <bi name="diagram-3" />
              </a>
            }
            <select class="form-select" id="selectGroup" formControlName="groupId">
              <option [value]="-1" disabled>
                {{ 'HOME_PROD_GROUPS_DEFAULT' | transloco }}
              </option>
              @for (productGroup of productGroups(); track productGroup.id) {
                <option [value]="productGroup.id">
                  {{ productGroup.name }}
                </option>
              }
            </select>
          </div>
          @if (form.controls.groupId.invalid) {
            <small class="text-danger">
              {{ 'HOME_PROD_GROUP_ID_INCORRECT' | transloco }}
            </small>
          }
        </div>

        <div class="form-group col">
          <label for="selectPrinter">{{ 'NAV_PRINTERS' | transloco }}</label>
          <div class="input-group">
            @if (isCreating()) {
              <span class="input-group-text" id="selectPrinter-addon">
                <bi name="printer" />
              </span>
            } @else {
              <a
                class="input-group-text"
                id="selectPrinter-addon"
                [routerLink]="'../../../printers()/' + form.controls.printerId.value"
                [ngbTooltip]="('NAV_PRINTERS' | transloco) + ('OPEN_2' | transloco)"
                placement="bottom"
              >
                <bi name="printer" />
              </a>
            }
            <select class="form-select" id="selectPrinter" formControlName="printerId">
              <option [value]="-1" disabled>
                {{ 'HOME_PROD_PRINTER_SELECT_DEFAULT' | transloco }}
              </option>
              @for (printer of printers(); track printer.id) {
                <option [value]="printer.id">
                  {{ printer.name }}
                </option>
              }
            </select>
          </div>
          @if (form.controls.printerId.invalid) {
            <small class="text-danger">
              {{ 'HOME_PROD_PRINTER_ID_INCORRECT' | transloco }}
            </small>
          }
        </div>

        <div class="form-group col-12 col-md-3 col-lg-2">
          <label for="initialStock">{{ 'HOME_PROD_AMOUNT_LEFT_SET' | transloco }}</label>
          <input
            class="form-control"
            id="initialStock"
            [placeholder]="'HOME_PROD_AMOUNT_LEFT_SET' | transloco"
            type="number"
            formControlName="initialStock"
          />
          @if (form.controls.initialStock.invalid) {
            <small class="text-danger">
              {{ 'HOME_PROD_AMOUNT_LEFT_SET_INCORRECT' | transloco }}
            </small>
          }
          @if (form.controls.initialStock.value && _product) {
            <small class="d-flex justify-content-between">
              <span>{{ 'HOME_PROD_AMOUNT_LEFT' | transloco }}: {{ form.controls.initialStock.value - _product.amountOrdered }}</span>
              <span>{{ 'HOME_PROD_AMOUNT_ORDERED' | transloco }}: {{ _product.amountOrdered }}</span>
            </small>
          }
        </div>
      </div>

      <div class="d-flex flex-column flex-md-row gap-2 gap-md-5 mb-3">
        <div class="form-check form-switch">
          <input class="form-check-input" id="soldOut" formControlName="soldOut" type="checkbox" />
          <label class="form-check-label" for="soldOut">
            {{ 'HOME_PROD_SOLD_OUT' | transloco }}
          </label>
        </div>

        @if (!isCreating()) {
          <div class="form-check">
            <input class="form-check-input" id="resetOrderedProducts" formControlName="resetOrderedProducts" type="checkbox" />
            <label class="form-check-label" for="resetOrderedProducts">
              {{ 'HOME_PROD_AMOUNT_ORDERED_RESET' | transloco }}
            </label>
          </div>
        }
      </div>

      <app-model-edit-save-btn [valid]="isValid()" [creating]="isCreating()" />
    </form>
  `,
  selector: 'app-product-edit-form',
  imports: [ReactiveFormsModule, TranslocoPipe, BiComponent, NgSelectModule, AppModelEditSaveBtn, RouterLink, NgbTooltip, AppColorPicker],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppProductEditFormComponent extends AbstractModelEditFormComponent<APIType['CreateProductDto'], APIType['UpdateProductDto']> {
  override form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(70), Validators.pattern(allowedCharacterSet)]],
    price: ['', [Validators.required, Validators.pattern(/^\d+([.,](\d{1,2}|[0-8]\d?))?$/)]],
    allergenIds: [new Array<number>()],
    eventId: [-1, [Validators.required, Validators.min(0)]],
    groupId: [-1, [Validators.required, Validators.min(0)]],
    printerId: [-1, [Validators.required, Validators.min(0)]],
    soldOut: [false, [Validators.required]],
    color: new FormControl<string | undefined>(undefined),
    resetOrderedProducts: [false],
    initialStock: [null as number | null, [Validators.min(0)]],
    id: [-1],
  });

  isValid = injectIsValid(this.form);

  override overrideRawValue = (value: typeof this.form.value): unknown => {
    // @ts-expect-error price is a string
    value.price = s_toCurrencyNumber(value.price);

    return super.overrideRawValue(value);
  };

  @Input()
  set product(it: APIType['GetProductMaxResponse'] | 'CREATE') {
    if (it === 'CREATE') {
      this.isCreating.set(true);
      return;
    }

    this._product = it;

    this.form.patchValue({
      name: it.name,
      price: s_from(it.price / 100),
      allergenIds: a_pluck(it.allergens, 'id'),
      groupId: it.group.id,
      printerId: it.printer.id,
      soldOut: it.soldOut,
      initialStock: it.initialStock,
      color: it.color,
      id: it.id,
    });
  }

  _product?: APIType['GetProductMaxResponse'];

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

  productGroups = input<APIType['GetProductGroupMinResponse'][]>();

  printers = input<APIType['GetPrinterMinResponse'][]>();

  allergens = input<APIType['GetAllergenResponse'][]>();
}
