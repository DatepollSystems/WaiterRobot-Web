import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {combineLatest, map} from 'rxjs';

import {NgbNav, NgbNavContent, NgbNavItem, NgbNavLink, NgbNavOutlet} from '@ng-bootstrap/ng-bootstrap';

import {DfxTrackById} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';

import {AppBackButtonComponent} from '../../../_shared/ui/app-back-button.component';
import {AppBtnToolbarComponent} from '../../../_shared/ui/app-btn-toolbar.component';
import {AbstractModelEditComponent} from '../../../_shared/ui/form/abstract-model-edit.component';
import {AppContinuesCreationSwitchComponent} from '../../../_shared/ui/form/app-continues-creation-switch.component';
import {AppIsCreatingDirective} from '../../../_shared/ui/form/app-is-creating.directive';
import {AppIsEditingDirective} from '../../../_shared/ui/form/app-is-editing.directive';
import {AppModelEditSaveBtn} from '../../../_shared/ui/form/app-model-edit-save-btn.component';
import {AppIconsModule} from '../../../_shared/ui/icons.module';
import {AppSpinnerRowComponent} from '../../../_shared/ui/loading/app-spinner-row.component';
import {CreatePrinterDto, GetPrinterResponse, UpdatePrinterDto} from '../../../_shared/waiterrobot-backend';
import {EventsService} from '../../events/_services/events.service';
import {PrintersService} from '../_services/printers.service';
import {AppPrinterEditForm} from './printer-edit-form.component';
import {PrinterEditProductsComponent} from './printer-edit-products.component';

@Component({
  template: `
    <div *ngIf="entity$ | async as entity; else loading">
      <h1 *isEditing="entity">{{ 'EDIT_2' | tr }} {{ entity.name }}</h1>
      <h1 *isCreating="entity">{{ 'ADD_2' | tr }}</h1>

      <btn-toolbar>
        <back-button />

        <app-model-edit-save-btn (submit)="form?.submit()" [valid]="valid$ | async" [editing]="entity !== 'CREATE'" />

        <ng-container *isEditing="entity">
          <div>
            <button class="btn btn-sm btn-outline-danger" (click)="onDelete(entity.id)">
              <i-bs name="trash" />
              {{ 'DELETE' | tr }}
            </button>
          </div>
        </ng-container>

        <div class="d-flex align-items-center" *isCreating="entity">
          <app-continues-creation-switch (continuesCreationChange)="continuesCreation = $event" />
        </div>
      </btn-toolbar>

      <ul ngbNav #nav="ngbNav" [activeId]="activeTab$ | async" class="nav-tabs bg-dark" (navChange)="navigateToTab($event.nextId)">
        <li [ngbNavItem]="'DATA'" [destroyOnHide]="false">
          <a ngbNavLink>{{ 'DATA' | tr }}</a>
          <ng-template ngbNavContent>
            <app-printer-edit-form
              *ngIf="vm$ | async as vm"
              #form
              (formValid)="setValid($event)"
              (submitUpdate)="submit('UPDATE', $event)"
              (submitCreate)="submit('CREATE', $event)"
              [selectedEventId]="vm.selectedEvent?.id"
              [availableFonts]="vm.fonts"
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

      <div [ngbNavOutlet]="nav" class="mt-2 bg-dark"></div>
    </div>

    <ng-template #loading>
      <app-spinner-row />
    </ng-template>
  `,
  selector: 'app-printer-edit',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    AsyncPipe,
    NgIf,
    NgForOf,
    NgbNav,
    NgbNavItem,
    NgbNavLink,
    NgbNavOutlet,
    NgbNavContent,
    DfxTrackById,
    DfxTr,
    AppIconsModule,
    AppBtnToolbarComponent,
    AppSpinnerRowComponent,
    AppIsEditingDirective,
    AppIsCreatingDirective,
    AppModelEditSaveBtn,
    AppPrinterEditForm,
    AppContinuesCreationSwitchComponent,
    AppBackButtonComponent,
    PrinterEditProductsComponent,
  ],
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

  selectedEvent$ = inject(EventsService).getSelected$;

  vm$ = combineLatest([this.selectedEvent$, this.printersService.getAllFonts$()]).pipe(
    map(([selectedEvent, fonts]) => ({selectedEvent, fonts})),
  );

  constructor(private printersService: PrintersService) {
    super(printersService);
  }
}
