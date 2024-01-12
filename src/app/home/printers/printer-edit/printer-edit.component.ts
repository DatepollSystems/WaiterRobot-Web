import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';

import {injectOnSubmit} from '../../../_shared/form';
import {GetPrinterResponse} from '../../../_shared/waiterrobot-backend';
import {AbstractModelEditComponent} from '../../_shared/form/abstract-model-edit.component';
import {AppContinuesCreationSwitchComponent} from '../../_shared/form/app-continues-creation-switch.component';
import {AppEntityEditModule} from '../../_shared/form/app-entity-edit.module';
import {injectContinuousCreation, injectOnDelete} from '../../_shared/form/edit';
import {SelectedEventService} from '../../events/_services/selected-event.service';
import {PrintersService} from '../_services/printers.service';
import {AppPrinterEditForm} from './printer-edit-form.component';
import {PrinterEditProductsComponent} from './printer-edit-products.component';

@Component({
  template: `
    @if (entity(); as entity) {
      <div class="d-flex flex-column gap-2">
        <h1 *isEditing="entity">{{ 'EDIT_2' | tr }} {{ entity.name }}</h1>
        <h1 *isCreating="entity">{{ 'ADD_2' | tr }}</h1>

        <scrollable-toolbar>
          <back-button />

          <ng-container *isEditing="entity">
            <div>
              <button class="btn btn-sm btn-danger" (click)="onDelete(entity.id)">
                <bi name="trash" />
                {{ 'DELETE' | tr }}
              </button>
            </div>
          </ng-container>

          <div class="d-flex align-items-center" *isCreating="entity">
            <app-continues-creation-switch (continuesCreationChange)="continuousCreation.set($event)" />
          </div>
        </scrollable-toolbar>

        <hr />
        <app-printer-edit-form
          #form
          (submitUpdate)="onSubmit('UPDATE', $event)"
          (submitCreate)="onSubmit('CREATE', $event)"
          [selectedEventId]="selectedEvent()"
          [availableFonts]="fonts()"
          [printer]="entity"
        />

        <h2 class="mt-5" *isEditing="entity">{{ 'HOME_PROD_ALL' | tr }}</h2>

        <app-printer-edit-products *isEditing="entity" [products]="entity.products" />
      </div>
    } @else {
      <app-edit-placeholder />
    }
  `,
  selector: 'app-printer-edit',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppEntityEditModule, AppPrinterEditForm, AppContinuesCreationSwitchComponent, PrinterEditProductsComponent],
})
export class PrinterEditComponent extends AbstractModelEditComponent<GetPrinterResponse> {
  onDelete = injectOnDelete((it: number) => this.printersService.delete$(it).subscribe());
  continuousCreation = injectContinuousCreation({
    formComponent: this.form,
    continuousUsePropertyNames: ['eventId', 'font', 'bonWidth', 'bonPadding', 'bonPaddingTop'],
  });
  onSubmit = injectOnSubmit({
    entityService: this.printersService,
    continuousCreation: {
      enabled: this.continuousCreation.enabled,
      patch: this.continuousCreation.patch,
    },
  });

  selectedEvent = inject(SelectedEventService).selectedId;

  fonts = toSignal(this.printersService.getAllFonts$(), {initialValue: []});

  constructor(private printersService: PrintersService) {
    super(printersService);
  }
}
