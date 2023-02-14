import {AsyncPipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {NgbNav, NgbNavContent, NgbNavItem, NgbNavLink, NgbNavOutlet} from '@ng-bootstrap/ng-bootstrap';
import {DfxTr} from 'dfx-translate';
import {combineLatest, map} from 'rxjs';
import {AppBtnToolbarComponent} from '../../../_shared/ui/app-btn-toolbar.component';
import {AbstractModelEditComponentV2} from '../../../_shared/ui/form/abstract-model-edit.component-v2';
import {AppContinuesCreationSwitchComponent} from '../../../_shared/ui/form/app-continues-creation-switch.component';
import {AppIsCreatingWithNameDirective} from '../../../_shared/ui/form/app-is-creating-with-name.directive';
import {AppIsEditingWithNameDirective} from '../../../_shared/ui/form/app-is-editing-with-name.directive';
import {AppModelEditSaveBtn} from '../../../_shared/ui/form/app-model-edit-save-btn.component';
import {AppIconsModule} from '../../../_shared/ui/icons.module';
import {AppSpinnerRowComponent} from '../../../_shared/ui/loading/app-spinner-row.component';
import {CreateProductGroupDto, GetProductGroupResponse, UpdateProductGroupDto} from '../../../_shared/waiterrobot-backend';

import {EventsService} from '../../events/_services/events.service';
import {PrintersService} from '../../printers/_services/printers.service';
import {ProductGroupsService} from '../_services/product-groups.service';
import {AppProductEditFormComponent} from './product-group-edit-form.component';

@Component({
  template: `
    <div *ngIf="entity$ | async as entity; else loading">
      <h1 *isEditing="entity">{{ 'EDIT_2' | tr }} "{{ entity.name }}"</h1>
      <h1 *isCreating="entity">{{ 'HOME_PROD_GROUPS_ADD' | tr }}</h1>

      <btn-toolbar>
        <div>
          <button class="btn btn-sm btn-dark text-white" (click)="onGoBack()">{{ 'GO_BACK' | tr }}</button>
        </div>

        <app-model-edit-save-btn (submit)="form?.submit()" [editing]="entity !== 'CREATE'"></app-model-edit-save-btn>

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
            <app-product-group-edit-form
              #form
              *ngIf="vm$ | async as vm"
              (formValid)="setValid($event)"
              (submitUpdate)="submit('UPDATE', $event)"
              (submitCreate)="submit('CREATE', $event)"
              [productGroup]="entity"
              [printers]="vm.printers"
              [selectedEventId]="vm.selectedEvent?.id"></app-product-group-edit-form>

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
  selector: 'app-product-group-edit',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    AsyncPipe,
    DfxTr,
    NgbNav,
    NgbNavItem,
    NgbNavLink,
    NgbNavContent,
    NgbNavOutlet,
    AppBtnToolbarComponent,
    AppSpinnerRowComponent,
    AppIconsModule,
    AppIsEditingWithNameDirective,
    AppIsCreatingWithNameDirective,
    AppModelEditSaveBtn,
    AppProductEditFormComponent,
    AppContinuesCreationSwitchComponent,
  ],
})
export class ProductGroupEditComponent extends AbstractModelEditComponentV2<
  CreateProductGroupDto,
  UpdateProductGroupDto,
  GetProductGroupResponse,
  'DATA'
> {
  defaultTab = 'DATA' as const;

  override redirectUrl = '/home/products/groups/all';

  vm$ = combineLatest([this.printersService.getAll$(), this.eventsService.getSelected$]).pipe(
    map(([printers, selectedEvent]) => ({
      printers,
      selectedEvent,
    }))
  );

  constructor(groupsService: ProductGroupsService, private printersService: PrintersService, private eventsService: EventsService) {
    super(groupsService);
  }
}
