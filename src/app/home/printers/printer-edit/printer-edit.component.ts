import {AsyncPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';

import {AbstractModelEditComponent} from '../../../_shared/ui/form/abstract-model-edit.component';
import {AppContinuesCreationSwitchComponent} from '../../../_shared/ui/form/app-continues-creation-switch.component';
import {AppFormModule} from '../../../_shared/ui/form/app-form.module';
import {CreatePrinterDto, GetPrinterResponse, UpdatePrinterDto} from '../../../_shared/waiterrobot-backend';
import {PrintersService} from '../_services/printers.service';
import {AppPrinterEditForm} from './printer-edit-form.component';
import {PrinterEditProductsComponent} from './printer-edit-products.component';
import {SelectedEventService} from '../../events/_services/selected-event.service';

@Component({
  template: `
    @if (entity$ | async; as entity) {
      <h1 *isEditing="entity">{{ 'EDIT_2' | tr }} {{ entity.name }}</h1>
      <h1 *isCreating="entity">{{ 'ADD_2' | tr }}</h1>

      <scrollable-toolbar>
        <back-button />

        <app-model-edit-save-btn (submit)="form?.submit()" [valid]="valid()" [creating]="entity !== 'CREATE'" />

        <ng-container *isEditing="entity">
          <div>
            <button class="btn btn-sm btn-danger" (click)="onDelete(entity.id)">
              <bi name="trash" />
              {{ 'DELETE' | tr }}
            </button>
          </div>
        </ng-container>

        <div class="d-flex align-items-center" *isCreating="entity">
          <app-continues-creation-switch (continuesCreationChange)="continuesCreation = $event" />
        </div>
      </scrollable-toolbar>

      <ul ngbNav #nav="ngbNav" [activeId]="activeTab$ | async" class="nav-tabs" (navChange)="navigateToTab($event.nextId)">
        <li [ngbNavItem]="'DATA'" [destroyOnHide]="false">
          <a ngbNavLink>{{ 'DATA' | tr }}</a>
          <ng-template ngbNavContent>
            <app-printer-edit-form
              #form
              (formValid)="setValid($event)"
              (submitUpdate)="submit('UPDATE', $event)"
              (submitCreate)="submit('CREATE', $event)"
              [selectedEventId]="selectedEvent()"
              [availableFonts]="fonts()"
              [printer]="entity"
            />
          </ng-template>
        </li>
        <li [ngbNavItem]="'PRODUCTS'" *isEditing="entity" [destroyOnHide]="true">
          <a ngbNavLink>{{ 'HOME_PROD_ALL' | tr }}</a>
          <ng-template ngbNavContent>
            <app-printer-edit-products [products]="entity.products" />
          </ng-template>
        </li>
      </ul>

      <div [ngbNavOutlet]="nav" class="mt-2"></div>
    } @else {
      <app-spinner-row />
    }
  `,
  selector: 'app-printer-edit',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, AppFormModule, AppPrinterEditForm, AppContinuesCreationSwitchComponent, PrinterEditProductsComponent],
})
export class PrinterEditComponent extends AbstractModelEditComponent<
  CreatePrinterDto,
  UpdatePrinterDto,
  GetPrinterResponse,
  'DATA' | 'PRODUCTS'
> {
  defaultTab = 'DATA' as const;
  onlyEditingTabs = ['PRODUCTS' as const];

  override continuousUsePropertyNames = ['eventId'];

  selectedEvent = inject(SelectedEventService).selectedId;

  fonts = toSignal(this.printersService.getAllFonts$(), {initialValue: []});

  constructor(private printersService: PrintersService) {
    super(printersService);
  }
}
