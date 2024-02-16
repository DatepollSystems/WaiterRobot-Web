import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ReactiveFormsModule, Validators} from '@angular/forms';
import {RouterLink} from '@angular/router';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';

import {a_pluck, HasNumberIDAndName, n_from, s_from} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

import {injectIsValid} from '../../../_shared/form';
import {CreateProductDto, GetProductMaxResponse, UpdateProductDto} from '../../../_shared/waiterrobot-backend';
import {AbstractModelEditFormComponent} from '../../_shared/form/abstract-model-edit-form.component';
import {AppModelEditSaveBtn} from '../../_shared/form/app-model-edit-save-btn.component';
import {allowedCharacterSet} from '../../_shared/regex';

@Component({
  template: `
    @if (isValid()) {}

    <form #formRef [formGroup]="form" (ngSubmit)="submit()">
      <div class="d-flex flex-column flex-md-row gap-4 mb-3">
        <div class="form-group col">
          <label for="name">{{ 'NAME' | tr }}</label>
          <input formControlName="name" class="form-control" type="text" id="name" placeholder="{{ 'NAME' | tr }}" />

          @if (form.controls.name.invalid) {
            <small class="text-danger">
              {{ 'HOME_PROD_NAME_INCORRECT' | tr }}
            </small>
          }
        </div>

        <div class="form-group col-12 col-md-3 col-lg-2">
          <label for="price">{{ 'PRICE' | tr }}</label>
          <input class="form-control" type="string" id="price" placeholder="{{ 'PRICE' | tr }}" formControlName="price" />

          @if (form.controls.price.invalid) {
            <small class="text-danger">
              {{ 'HOME_PROD_PRICE_INCORRECT' | tr }}
            </small>
          }
        </div>

        <div class="form-group col">
          <label for="allergenSelect">{{ 'HOME_PROD_ALLERGENS' | tr }}</label>
          <ng-select
            [items]="allergens"
            bindLabel="name"
            bindValue="id"
            labelForId="allergenSelect"
            [multiple]="true"
            placeholder="{{ 'HOME_PROD_ALLERGENS_PLACEHOLDER' | tr }}"
            clearAllText="Clear"
            formControlName="allergenIds"
          >
            <ng-template ng-label-tmp let-item="item" let-clear="clear">
              <span class="ng-value-icon left" (click)="clear(item)" aria-hidden="true">×</span>
              <span class="ng-value-label">({{ item.shortName }}) {{ item.name }}</span>
            </ng-template>
          </ng-select>
        </div>
      </div>

      <div class="d-flex flex-column flex-md-row gap-4 mb-3">
        <div class="form-group col">
          <label for="selectGroup">{{ 'HOME_PROD_GROUPS' | tr }}</label>
          <div class="input-group">
            @if (isCreating()) {
              <span class="input-group-text" id="selectGroup-addon">
                <bi name="diagram-3" />
              </span>
            } @else {
              <a
                routerLink="../groups/{{ form.controls.groupId.value }}"
                class="input-group-text"
                id="selectGroup-addon"
                [ngbTooltip]="('HOME_PROD_GROUP' | tr) + ('OPEN_2' | tr)"
                placement="bottom"
              >
                <bi name="diagram-3" />
              </a>
            }
            <select class="form-select" id="selectGroup" formControlName="groupId">
              <option [value]="-1" disabled>{{ 'HOME_PROD_GROUPS_DEFAULT' | tr }}</option>
              @for (productGroup of productGroups; track productGroup.id) {
                <option [value]="productGroup.id">
                  {{ productGroup.name }}
                </option>
              }
            </select>
          </div>
          @if (form.controls.groupId.invalid) {
            <small class="text-danger">
              {{ 'HOME_PROD_GROUP_ID_INCORRECT' | tr }}
            </small>
          }
        </div>

        <div class="form-group col">
          <label for="selectPrinter">{{ 'NAV_PRINTERS' | tr }}</label>
          <div class="input-group">
            @if (isCreating()) {
              <span class="input-group-text" id="selectPrinter-addon">
                <bi name="printer" />
              </span>
            } @else {
              <a
                routerLink="../../printers/{{ form.controls.printerId.value }}"
                class="input-group-text"
                id="selectPrinter-addon"
                [ngbTooltip]="('NAV_PRINTERS' | tr) + ('OPEN_2' | tr)"
                placement="bottom"
              >
                <bi name="printer" />
              </a>
            }
            <select class="form-select" id="selectPrinter" formControlName="printerId">
              <option [value]="-1" disabled>{{ 'HOME_PROD_PRINTER_SELECT_DEFAULT' | tr }}</option>
              @for (printer of this.printers; track printer.id) {
                <option [value]="printer.id">
                  {{ printer.name }}
                </option>
              }
            </select>
          </div>
          @if (form.controls.printerId.invalid) {
            <small class="text-danger">
              {{ 'HOME_PROD_PRINTER_ID_INCORRECT' | tr }}
            </small>
          }
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
          @if (form.controls.initialStock.invalid) {
            <small class="text-danger">
              {{ 'HOME_PROD_AMOUNT_LEFT_SET_INCORRECT' | tr }}
            </small>
          }
          @if (form.controls.initialStock.value && _product) {
            <small class="d-flex justify-content-between">
              <span>{{ 'HOME_PROD_AMOUNT_LEFT' | tr }}: {{ form.controls.initialStock.value - _product.amountOrdered }}</span>
              <span>{{ 'HOME_PROD_AMOUNT_ORDERED' | tr }}: {{ _product.amountOrdered }}</span>
            </small>
          }
        </div>
      </div>

      <div class="d-flex flex-column flex-md-row gap-2 gap-md-5 mb-3">
        <div class="form-check form-switch">
          <input formControlName="soldOut" class="form-check-input" type="checkbox" id="soldOut" />
          <label class="form-check-label" for="soldOut">
            {{ 'HOME_PROD_SOLD_OUT' | tr }}
          </label>
        </div>

        @if (!isCreating()) {
          <div class="form-check">
            <input formControlName="resetOrderedProducts" class="form-check-input" type="checkbox" id="resetOrderedProducts" />
            <label class="form-check-label" for="resetOrderedProducts">
              {{ 'HOME_PROD_AMOUNT_ORDERED_RESET' | tr }}
            </label>
          </div>
        }
      </div>

      <app-model-edit-save-btn [valid]="isValid()" [creating]="isCreating()" />
    </form>
  `,
  selector: 'app-product-edit-form',
  imports: [ReactiveFormsModule, DfxTr, BiComponent, NgSelectModule, AppModelEditSaveBtn, RouterLink, NgbTooltip],
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

  isValid = injectIsValid(this.form);

  override overrideRawValue = (value: typeof this.form.value): unknown => {
    const match: string[] = s_from(value.price).split(/[,.]/);
    const euro = n_from(match[0] ?? 0);
    const cent = n_from(match[1]?.padEnd(2, '0') ?? 0);
    // @ts-expect-error price is a string
    value.price = euro * 100 + cent;

    this.lumber.log('overrideRawValue', 'Euro to cent', match, value.price);

    return super.overrideRawValue(value);
  };

  @Input()
  set product(it: GetProductMaxResponse | 'CREATE') {
    if (it === 'CREATE') {
      this.isCreating.set(true);
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
}
