import {AsyncPipe, NgIf} from '@angular/common';
import {Component, inject} from '@angular/core';

import {NgbNav, NgbNavContent, NgbNavItem, NgbNavLink, NgbNavOutlet, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {NgSub} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';

import {MyUserService} from '../../../_shared/services/auth/user/my-user.service';
import {AppBackButtonComponent} from '../../../_shared/ui/app-back-button.component';
import {AppBtnToolbarComponent} from '../../../_shared/ui/app-btn-toolbar.component';
import {AppSelectableButtonComponent} from '../../../_shared/ui/app-selectable-button.component';
import {AbstractModelEditComponent} from '../../../_shared/ui/form/abstract-model-edit.component';
import {AppIsCreatingDirective} from '../../../_shared/ui/form/app-is-creating.directive';
import {AppIsEditingDirective} from '../../../_shared/ui/form/app-is-editing.directive';
import {AppModelEditSaveBtn} from '../../../_shared/ui/form/app-model-edit-save-btn.component';
import {AppIconsModule} from '../../../_shared/ui/icons.module';
import {AppSpinnerRowComponent} from '../../../_shared/ui/loading/app-spinner-row.component';
import {CreateOrganisationDto, GetOrganisationResponse, UpdateOrganisationDto} from '../../../_shared/waiterrobot-backend';
import {OrganisationsService} from '../_services/organisations.service';
import {AppOrganisationEditFormComponent} from './organisation-edit-form.component';
import {OrganisationEditSettingsComponent} from './organisation-edit-settings.component';
import {OrganisationEditUsersComponent} from './organisation-edit-users.component';

@Component({
  template: `
    <div *ngIf="entity$ | async as entity; else loading">
      <h1 *isEditing="entity">{{ 'EDIT_2' | tr }} {{ entity.name }}</h1>
      <h1 *isCreating="entity">{{ 'ADD_2' | tr }}</h1>

      <ng-container *ngSub="myUser$ as myUser">
        <btn-toolbar>
          <back-button />

          <app-model-edit-save-btn
            *ngIf="(activeTab$ | async) === 'DATA'"
            (submit)="form?.submit()"
            [valid]="valid$ | async"
            [editing]="entity !== 'CREATE'"
          />

          <ng-container *isEditing="entity">
            <div *ngIf="myUser?.isAdmin">
              <button class="btn btn-sm btn-outline-danger" (click)="onDelete(entity.id)">
                <i-bs name="trash" />
                {{ 'DELETE' | tr }}
              </button>
            </div>
            <div>
              <!--suppress TypeScriptValidateTypes -->
              <selectable-button class="my-2" [entity]="entity" [selectedEntityService]="organisationsService" placement="top" />
            </div>
          </ng-container>
        </btn-toolbar>

        <ul ngbNav #nav="ngbNav" [activeId]="activeTab$ | async" class="nav-tabs bg-dark" (navChange)="navigateToTab($event.nextId)">
          <li [ngbNavItem]="'DATA'" [destroyOnHide]="false">
            <a ngbNavLink>{{ 'DATA' | tr }}</a>
            <ng-template ngbNavContent>
              <app-organisation-edit-form
                #form
                (formValid)="setValid($event)"
                (submitUpdate)="submit('UPDATE', $event)"
                (submitCreate)="submit('CREATE', $event)"
                [formDisabled]="!myUser?.isAdmin"
                [organisation]="entity"
              />
            </ng-template>
          </li>

          <ng-container *ngIf="myUser.isAdmin">
            <li [ngbNavItem]="'USERS'" *isEditing="entity" [destroyOnHide]="true">
              <a ngbNavLink>{{ 'USER' | tr }}</a>
              <ng-template ngbNavContent>
                <!--suppress TypeScriptValidateTypes -->
                <app-organisation-edit-users [organisation]="entity" [myUserEmailAddress]="myUser?.emailAddress" />
              </ng-template>
            </li>
          </ng-container>
          <li [ngbNavItem]="'SETTINGS'" *isEditing="entity" [destroyOnHide]="true">
            <a ngbNavLink>{{ 'SETTINGS' | tr }}</a>
            <ng-template ngbNavContent>
              <app-organisation-edit-settings />
            </ng-template>
          </li>
        </ul>

        <div [ngbNavOutlet]="nav" class="mt-2 bg-dark"></div>
      </ng-container>
    </div>

    <ng-template #loading>
      <app-spinner-row />
    </ng-template>
  `,
  selector: 'app-organisation-edit',
  standalone: true,
  imports: [
    AppIconsModule,
    NgSub,
    NgIf,
    NgbNav,
    NgbNavItem,
    NgbNavContent,
    NgbNavLink,
    NgbTooltip,
    NgbNavOutlet,
    DfxTr,
    AppBtnToolbarComponent,
    AppSelectableButtonComponent,
    AppSpinnerRowComponent,
    AsyncPipe,
    AppIsEditingDirective,
    AppIsCreatingDirective,
    AppOrganisationEditFormComponent,
    OrganisationEditUsersComponent,
    AppModelEditSaveBtn,
    OrganisationEditSettingsComponent,
    AppBackButtonComponent,
  ],
})
export class OrganisationEditComponent extends AbstractModelEditComponent<
  CreateOrganisationDto,
  UpdateOrganisationDto,
  GetOrganisationResponse,
  'DATA' | 'USERS' | 'SETTINGS'
> {
  defaultTab = 'DATA' as const;

  override onlyEditingTabs = ['USERS' as const, 'SETTINGS' as const];

  myUser$ = inject(MyUserService).getUser$();

  constructor(public organisationsService: OrganisationsService) {
    super(organisationsService);
  }
}
