import {AsyncPipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink} from '@angular/router';

import {NgbNav, NgbNavContent, NgbNavItem, NgbNavLink, NgbNavOutlet} from '@ng-bootstrap/ng-bootstrap';
import {n_from, n_isNumeric} from 'dfts-helper';
import {DfxTr} from 'dfx-translate';
import {combineLatest, filter, map, startWith} from 'rxjs';
import {AppBackButtonComponent} from '../../../_shared/ui/app-back-button.component';
import {AppBtnToolbarComponent} from '../../../_shared/ui/app-btn-toolbar.component';
import {AbstractModelEditComponent} from '../../../_shared/ui/form/abstract-model-edit.component';
import {AppContinuesCreationSwitchComponent} from '../../../_shared/ui/form/app-continues-creation-switch.component';
import {AppIsCreatingDirective} from '../../../_shared/ui/form/app-is-creating.directive';

import {AppIsEditingDirective} from '../../../_shared/ui/form/app-is-editing.directive';
import {AppModelEditSaveBtn} from '../../../_shared/ui/form/app-model-edit-save-btn.component';
import {AppIconsModule} from '../../../_shared/ui/icons.module';
import {AppSpinnerRowComponent} from '../../../_shared/ui/loading/app-spinner-row.component';

import {CreateProductDto, GetProductMaxResponse, UpdateProductDto} from '../../../_shared/waiterrobot-backend';
import {EventsService} from '../../events/_services/events.service';
import {PrintersService} from '../../printers/_services/printers.service';
import {AllergensService} from '../_services/allergens.service';
import {ProductGroupsService} from '../_services/product-groups.service';
import {ProductsService} from '../_services/products.service';
import {AppProductEditFormComponent} from './product-edit-form.component';

@Component({
  template: `
    <div *ngIf="entity$ | async as entity; else loading">
      <h1 *isEditing="entity">{{ 'EDIT_2' | tr }} {{ entity.name }}</h1>
      <h1 *isCreating="entity">{{ 'HOME_PROD_ADD' | tr }}</h1>

      <btn-toolbar>
        <back-button />
        <app-model-edit-save-btn (submit)="form?.submit()" [valid]="valid$ | async" [editing]="entity !== 'CREATE'" />

        <div *isEditing="entity">
          <button class="btn btn-sm btn-outline-danger" (click)="onDelete(entity.id)">
            <i-bs name="trash" />
            {{ 'DELETE' | tr }}
          </button>
        </div>

        <div *isEditing="entity">
          <button class="btn btn-sm btn-outline-primary" routerLink="/home/products/groups/products/{{ entity.group.id }}">
            <i-bs name="diagram-3" />
            {{ 'HOME_PROD_GO_TO_GROUP' | tr }}
          </button>
        </div>
        <div class="d-flex align-items-center" *isCreating="entity">
          <app-continues-creation-switch (continuesCreationChange)="continuesCreation = $event" />
        </div>
      </btn-toolbar>

      <ul ngbNav #nav="ngbNav" [activeId]="activeTab$ | async" class="nav-tabs bg-dark" (navChange)="navigateToTab($event.nextId)">
        <li [ngbNavItem]="'DATA'">
          <a ngbNavLink>{{ 'DATA' | tr }}</a>
          <ng-template ngbNavContent>
            <app-product-edit-form
              *ngIf="vm$ | async as vm"
              #form
              (formValid)="setValid($event)"
              (submitUpdate)="submit('UPDATE', $event)"
              (submitCreate)="submit('CREATE', $event)"
              [allergens]="vm.allergens"
              [printers]="vm.printers"
              [productGroups]="vm.productGroups"
              [selectedEventId]="vm.selectedEvent?.id"
              [selectedProductGroupId]="vm.selectedProductGroupId"
              [product]="entity"
            />
          </ng-template>
        </li>
      </ul>

      <div [ngbNavOutlet]="nav" class="mt-2 bg-dark"></div>
    </div>

    <ng-template #loading>
      <app-spinner-row />
    </ng-template>
  `,
  selector: 'app-product-edit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    DfxTr,
    NgbNav,
    NgbNavOutlet,
    NgbNavItem,
    NgbNavContent,
    NgbNavLink,
    AppIsCreatingDirective,
    AppIsEditingDirective,
    AppProductEditFormComponent,
    AppModelEditSaveBtn,
    AppBtnToolbarComponent,
    AppContinuesCreationSwitchComponent,
    AppIconsModule,
    AppSpinnerRowComponent,
    RouterLink,
    AppBackButtonComponent,
  ],
})
export class ProductEditComponent extends AbstractModelEditComponent<CreateProductDto, UpdateProductDto, GetProductMaxResponse, 'DATA'> {
  defaultTab = 'DATA' as const;
  continuousUsePropertyNames = ['groupId', 'printerId'];

  vm$ = combineLatest([
    this.route.queryParams.pipe(
      map((params) => params.group),
      filter(n_isNumeric),
      map((id) => n_from(id)),
      startWith(undefined),
    ),
    this.productGroupsService.getAll$(),
    this.allergensService.getAll$(),
    this.printersService.getAll$(),
    this.eventsService.getSelected$,
  ]).pipe(
    map(([selectedProductGroupId, productGroups, allergens, printers, selectedEvent]) => ({
      selectedProductGroupId,
      productGroups,
      allergens,
      printers,
      selectedEvent,
    })),
  );

  constructor(
    productsService: ProductsService,
    private allergensService: AllergensService,
    private printersService: PrintersService,
    private eventsService: EventsService,
    private productGroupsService: ProductGroupsService,
  ) {
    super(productsService);
  }
}
