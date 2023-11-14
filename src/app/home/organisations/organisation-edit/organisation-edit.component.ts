import {AsyncPipe, NgIf} from '@angular/common';
import {Component, inject} from '@angular/core';

import {NgbNavModule} from '@ng-bootstrap/ng-bootstrap';

import {BiComponent} from 'dfx-bootstrap-icons';
import {NgSub} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';

import {MyUserService} from '../../../_shared/services/auth/user/my-user.service';
import {AppSelectableBtnComponent} from '../../../_shared/ui/button/app-selectable-btn.component';
import {AbstractModelEditComponent} from '../../../_shared/ui/form/abstract-model-edit.component';
import {AppFormModule} from '../../../_shared/ui/form/app-form.module';
import {CreateOrganisationDto, GetOrganisationResponse, UpdateOrganisationDto} from '../../../_shared/waiterrobot-backend';
import {OrganisationsService} from '../_services/organisations.service';
import {SelectedOrganisationService} from '../_services/selected-organisation.service';
import {AppOrganisationEditFormComponent} from './organisation-edit-form.component';
import {OrganisationEditSettingsComponent} from './organisation-edit-settings.component';
import {OrganisationEditUsersComponent} from './organisation-edit-users.component';

@Component({
  template: `
    <div *ngIf="entity$ | async as entity; else loading">
      <h1 *isEditing="entity">{{ 'EDIT_2' | tr }} {{ entity.name }}</h1>
      <h1 *isCreating="entity">{{ 'ADD_2' | tr }}</h1>

      <ng-container *ngSub="myUser$ as myUser">
        <scrollable-toolbar>
          <back-button />

          <app-model-edit-save-btn
            *ngIf="(activeTab$ | async) === 'DATA'"
            (submit)="form?.submit()"
            [valid]="valid()"
            [editing]="entity !== 'CREATE'"
          />

          <ng-container *isEditing="entity">
            <div *ngIf="myUser?.isAdmin">
              <button class="btn btn-sm btn-outline-danger" (click)="onDelete(entity.id)">
                <bi name="trash" />
                {{ 'DELETE' | tr }}
              </button>
            </div>
            <div>
              <selectable-button
                class="my-2"
                [entityId]="entity.id"
                [selectedId]="selectedOrganisationService.selectedId()"
                (selectedChange)="selectedOrganisationService.setSelected($event)"
              />
            </div>
          </ng-container>
        </scrollable-toolbar>

        <ul ngbNav #nav="ngbNav" [activeId]="activeTab$ | async" class="nav-tabs" (navChange)="navigateToTab($event.nextId)">
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

        <div [ngbNavOutlet]="nav" class="mt-2"></div>
      </ng-container>
    </div>

    <ng-template #loading>
      <app-spinner-row />
    </ng-template>
  `,
  selector: 'app-organisation-edit',
  standalone: true,
  imports: [
    AsyncPipe,
    NgSub,
    NgIf,
    NgbNavModule,
    DfxTr,
    AppFormModule,
    BiComponent,
    AppSelectableBtnComponent,
    AppOrganisationEditFormComponent,
    OrganisationEditUsersComponent,
    OrganisationEditSettingsComponent,
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

  selectedOrganisationService = inject(SelectedOrganisationService);

  constructor(public organisationsService: OrganisationsService) {
    super(organisationsService);
  }
}
