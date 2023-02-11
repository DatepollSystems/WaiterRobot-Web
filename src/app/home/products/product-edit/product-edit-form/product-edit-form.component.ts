import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ReactiveFormsModule, Validators} from '@angular/forms';
import {a_pluck, HasNumberIDAndName} from 'dfts-helper';
import {DfxTrackById} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';

import {AbstractModelEditFormComponent} from '../../../../_shared/ui/abstract-model-edit-form.component';
import {ChipInput} from '../../../../_shared/ui/chip-input/chip-input.component';
import {AppIconsModule} from '../../../../_shared/ui/icons.module';
import {CreateProductDto, GetProductMaxResponse, UpdateProductDto} from '../../../../_shared/waiterrobot-backend';

@Component({
  selector: 'app-product-edit-form',
  templateUrl: './product-edit-form.component.html',
  imports: [ReactiveFormsModule, NgIf, NgForOf, AsyncPipe, DfxTr, DfxTrackById, AppIconsModule, ChipInput],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductEditFormComponent extends AbstractModelEditFormComponent<CreateProductDto, UpdateProductDto> {
  override form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(70)]],
    price: [0, [Validators.required, Validators.min(0)]],
    allergenIds: [[-1]],
    eventId: [0, [Validators.required, Validators.min(0)]],
    groupId: [-1, [Validators.required, Validators.min(0)]],
    printerId: [-1, [Validators.required, Validators.min(0)]],
    soldOut: [false, [Validators.required]],
  });

  @Input()
  set product(it: GetProductMaxResponse | 'CREATE') {
    if (it === 'CREATE') {
      super.isEdit = false;
      this.form.controls.allergenIds.setValue([]);
      return;
    }

    this._product = it;

    this.form.setValue({
      name: it.name,
      price: it.price,
      eventId: this._selectedEvent?.id ?? 0,
      allergenIds: a_pluck(it.allergens, 'id'),
      groupId: it.group.id,
      printerId: it.printer.id,
      soldOut: it.soldOut,
    });
  }

  _product?: GetProductMaxResponse;

  @Input()
  set selectedProductGroupId(id: number | undefined | null) {
    if (id) {
      this.form.controls.groupId.setValue(id);
    }
  }

  @Input()
  set selectedEvent(it: HasNumberIDAndName | undefined) {
    this._selectedEvent = it;
    if (this._selectedEvent) {
      this.form.controls.eventId.setValue(this._selectedEvent.id);
    }
  }

  _selectedEvent?: HasNumberIDAndName;

  @Input()
  productGroups!: HasNumberIDAndName[];

  @Input()
  printers!: HasNumberIDAndName[];

  @Input()
  allergens!: HasNumberIDAndName[];

  formatter = (it: unknown): string => (it as HasNumberIDAndName).name;

  allergenChange = (allergens: any[]) => this.form.controls.allergenIds.setValue(allergens.map((a) => a.id));
}
