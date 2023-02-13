import {AsyncPipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';

import {NgbNav, NgbNavContent, NgbNavItem, NgbNavLink, NgbNavOutlet} from '@ng-bootstrap/ng-bootstrap';
import {n_from, n_isNumeric} from 'dfts-helper';
import {DfxTr} from 'dfx-translate';
import {combineLatest, filter, map, startWith, tap} from 'rxjs';
import {AppBtnToolbarComponent} from '../../../_shared/ui/app-btn-toolbar.component';
import {AbstractModelEditComponentV2} from '../../../_shared/ui/form/abstract-model-edit.component-v2';
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
        <div>
          <button class="btn btn-sm btn-dark text-white" (click)="onGoBack()">{{ 'GO_BACK' | tr }}</button>
        </div>

        <app-model-edit-save-btn (submit)="form?.submit()" [editing]="entity === 'CREATE'"></app-model-edit-save-btn>

        <div *isEditing="entity">
          <button class="btn btn-sm btn-outline-danger" (click)="onDelete(entity.id)">
            <i-bs name="trash"></i-bs>
            {{ 'DELETE' | tr }}
          </button>
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
              [selectedEvent]="vm.selectedEvent"
              [selectedProductGroupId]="vm.selectedProductGroupId"
              [product]="entity"></app-product-edit-form>

            <app-continues-creation-switch
              *isCreating="entity"
              (continuesCreationChange)="continuesCreation = $event"></app-continues-creation-switch>
          </ng-template>
        </li>
      </ul>

      <div [ngbNavOutlet]="nav" class="mt-2 bg-dark"></div>
    </div>

    <ng-template #loading>
      <app-spinner-row></app-spinner-row>
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
  ],
})
export class ProductEditComponent extends AbstractModelEditComponentV2<CreateProductDto, UpdateProductDto, GetProductMaxResponse, 'DATA'> {
  defaultTab = 'DATA' as const;
  redirectUrl = '/home/products/all';
  continuousUsePropertyNames = ['groupId', 'printerId'];

  vm$ = combineLatest([
    this.route.queryParams.pipe(
      map((params) => params.group),
      filter(n_isNumeric),
      map((id) => n_from(id)),
      tap((id) => this.lumber.info('constructor', 'Selected product group: ' + id)),
      startWith(undefined)
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
    }))
  );

  constructor(
    productsService: ProductsService,
    private allergensService: AllergensService,
    private printersService: PrintersService,
    private eventsService: EventsService,
    private productGroupsService: ProductGroupsService
  ) {
    super(productsService);
  }
}
