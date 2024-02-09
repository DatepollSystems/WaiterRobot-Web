import {Component, computed, inject} from '@angular/core';

import {AppSelectableBtnComponent} from '@home-shared/components/button/app-selectable-btn.component';
import {AbstractModelEditComponent} from '@home-shared/form/abstract-model-edit.component';
import {AppEntityEditModule} from '@home-shared/form/app-entity-edit.module';
import {injectOnDelete, injectTabControls} from '@home-shared/form/edit';
import {MyUserService} from '@home-shared/services/user/my-user.service';
import {NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import {injectOnSubmit} from '@shared/form';
import {GetOrganisationResponse} from '@shared/waiterrobot-backend';

import {OrganisationsService} from '../_services/organisations.service';
import {SelectedOrganisationService} from '../_services/selected-organisation.service';
import {AppOrganisationEditFormComponent} from './organisation-edit-form.component';
import {OrganisationEditSettingsComponent} from './organisation-edit-settings.component';
import {OrganisationEditStripeComponent} from './organisation-edit-stripe.component';
import {OrganisationEditUsersComponent} from './organisation-edit-users.component';

@Component({
  template: `
    @if (entity(); as entity) {
      <div class="d-flex flex-column gap-2">
        <h1 *isEditing="entity">{{ 'EDIT_2' | tr }} {{ entity.name }}</h1>
        <h1 *isCreating="entity">{{ 'ADD_2' | tr }}</h1>

        <scrollable-toolbar>
          <back-button />

          <ng-container *isEditing="entity">
            @if (myUser()?.isAdmin) {
              <div>
                <button class="btn btn-sm btn-outline-danger" (click)="onDelete(entity.id)">
                  <bi name="trash" />
                  {{ 'DELETE' | tr }}
                </button>
              </div>
            }
            <div>
              <selectable-button
                [entityId]="entity.id"
                [selectedId]="selectedOrganisationService.selectedId()"
                (selectedChange)="selectedOrganisationService.setSelected($event)"
              />
            </div>
          </ng-container>
        </scrollable-toolbar>

        <div class="mt-1"></div>

        <ul
          ngbNav
          #nav="ngbNav"
          [activeId]="tabControls.activeTab()"
          class="nav-tabs"
          (navChange)="tabControls.navigateToTab($event.nextId)"
        >
          <li [ngbNavItem]="'DATA'" [destroyOnHide]="false">
            <a ngbNavLink>{{ 'DATA' | tr }}</a>
            <ng-template ngbNavContent>
              <app-organisation-edit-form
                #form
                (submitUpdate)="onSubmit('UPDATE', $event)"
                (submitCreate)="onSubmit('CREATE', $event)"
                [formDisabled]="!myUser()?.isAdmin"
                [organisation]="entity"
              />
            </ng-template>
          </li>

          <li [ngbNavItem]="'USERS'" *isEditing="entity" [destroyOnHide]="true">
            <a ngbNavLink>{{ 'USER' | tr }}</a>
            <ng-template ngbNavContent>
              <!--suppress TypeScriptValidateTypes -->
              <app-organisation-edit-users [organisation]="entity" [myUserEmailAddress]="myUser()?.emailAddress" />
            </ng-template>
          </li>

          <li [ngbNavItem]="'STRIPE'" *isEditing="entity" [destroyOnHide]="true">
            <a ngbNavLink>{{ 'STRIPE' | tr }}</a>
            <ng-template ngbNavContent>
              <app-organisation-edit-stripe />
            </ng-template>
          </li>
          <li [ngbNavItem]="'SETTINGS'" *isEditing="entity" [destroyOnHide]="true">
            <a ngbNavLink>{{ 'SETTINGS' | tr }}</a>
            <ng-template ngbNavContent>
              <app-organisation-edit-settings />
            </ng-template>
          </li>
        </ul>

        <div [ngbNavOutlet]="nav"></div>
      </div>
    } @else {
      <app-edit-placeholder />
    }
  `,
  selector: 'app-organisation-edit',
  standalone: true,
  imports: [
    NgbNavModule,
    AppEntityEditModule,
    AppSelectableBtnComponent,
    AppOrganisationEditFormComponent,
    OrganisationEditUsersComponent,
    OrganisationEditSettingsComponent,
    OrganisationEditStripeComponent,
  ],
})
export class OrganisationEditComponent extends AbstractModelEditComponent<GetOrganisationResponse> {
  onSubmit = injectOnSubmit({entityService: this.organisationsService});
  tabControls = injectTabControls<'DATA' | 'USERS' | 'SETTINGS' | 'STRIPE'>({
    onlyEditingTabs: ['USERS', 'SETTINGS', 'STRIPE'],
    defaultTab: 'DATA',
    isCreating: computed(() => this.entity() === 'CREATE'),
  });
  onDelete = injectOnDelete((it: number) => this.organisationsService.delete$(it).subscribe());

  myUser = inject(MyUserService).user;
  selectedOrganisationService = inject(SelectedOrganisationService);

  constructor(private organisationsService: OrganisationsService) {
    super(organisationsService);
  }
}
