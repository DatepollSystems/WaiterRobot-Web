import {AsyncPipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink} from '@angular/router';

import {combineLatest, filter, map, startWith} from 'rxjs';

import {NgbNavModule} from '@ng-bootstrap/ng-bootstrap';

import {n_from, n_isNumeric} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

import {AbstractModelEditComponent} from '../../../_shared/ui/form/abstract-model-edit.component';
import {AppContinuesCreationSwitchComponent} from '../../../_shared/ui/form/app-continues-creation-switch.component';
import {AppDeletedDirectives} from '../../../_shared/ui/form/app-deleted.directives';
import {AppFormModule} from '../../../_shared/ui/form/app-form.module';
import {CreateProductDto, GetProductMaxResponse, UpdateProductDto} from '../../../_shared/waiterrobot-backend';
import {EventsService} from '../../events/_services/events.service';
import {PrintersService} from '../../printers/_services/printers.service';
import {TableEditFormComponent} from '../../tables/table-edit/table-edit-form.component';
import {AllergensService} from '../_services/allergens.service';
import {ProductGroupsService} from '../_services/product-groups.service';
import {ProductsService} from '../_services/products.service';
import {AppProductEditFormComponent} from './product-edit-form.component';

@Component({
  template: `
    <div *ngIf="entity$ | async as entity; else loading">
      <h1 *isCreating="entity">{{ 'HOME_PROD_ADD' | tr }}</h1>
      <h1 *isEditingAndNotDeleted="entity">{{ 'EDIT_2' | tr }} {{ entity.name }}</h1>
      <h1 *isEditingAndDeleted="entity">{{ entity.name }} {{ 'DELETED' | tr }}</h1>

      <btn-toolbar>
        <back-button />
        <app-model-edit-save-btn *isNotDeleted="entity" (submit)="form?.submit()" [valid]="valid()" [editing]="entity !== 'CREATE'" />

        <ng-container *isEditingAndNotDeleted="entity">
          <div>
            <button class="btn btn-sm btn-danger" (click)="onDelete(entity.id)">
              <bi name="trash" />
              {{ 'DELETE' | tr }}
            </button>
          </div>

          <div>
            <button class="btn btn-sm btn-primary" routerLink="/home/products/groups/products/{{ entity.group.id }}">
              <bi name="diagram-3" />
              {{ 'HOME_PROD_GO_TO_GROUP' | tr }}
            </button>
          </div>
        </ng-container>
        <div class="d-flex align-items-center" *isCreating="entity">
          <app-continues-creation-switch (continuesCreationChange)="continuesCreation = $event" />
        </div>
      </btn-toolbar>

      <ul ngbNav #nav="ngbNav" [activeId]="activeTab$ | async" class="nav-tabs bg-dark" (navChange)="navigateToTab($event.nextId)">
        <li [ngbNavItem]="'DATA'">
          <a ngbNavLink>{{ 'DATA' | tr }}</a>
          <ng-template ngbNavContent>
            <ng-container *ngIf="vm$ | async as vm">
              <div class="alert alert-warning" *ngIf="vm.productGroups.length < 1">
                <a routerLink="../groups/create">{{ 'HOME_PROD_ADD_GROUP_FIRST' | tr }}</a>
              </div>
              <app-product-edit-form
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
                [formDisabled]="vm.productGroups.length < 1 || (entity !== 'CREATE' && !!entity.deleted)"
              />
            </ng-container>
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
    RouterLink,
    AsyncPipe,
    DfxTr,
    NgbNavModule,
    AppFormModule,
    BiComponent,
    AppProductEditFormComponent,
    AppContinuesCreationSwitchComponent,
    TableEditFormComponent,
    AppDeletedDirectives,
  ],
})
export class ProductEditComponent extends AbstractModelEditComponent<CreateProductDto, UpdateProductDto, GetProductMaxResponse, 'DATA'> {
  defaultTab = 'DATA' as const;
  continuousUsePropertyNames = ['groupId', 'printerId', 'eventId', 'allergenIds'];

  vm$ = combineLatest([
    this.route.queryParams.pipe(
      map((params) => params.group as string),
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
