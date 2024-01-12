import {Component, computed, inject} from '@angular/core';

import {NgbNavModule} from '@ng-bootstrap/ng-bootstrap';

import {injectOnSubmit} from '../../../_shared/form';
import {GetOrganisationResponse} from '../../../_shared/waiterrobot-backend';
import {AppSelectableBtnComponent} from '../../_shared/components/button/app-selectable-btn.component';
import {AbstractModelEditComponent} from '../../_shared/form/abstract-model-edit.component';
import {AppEntityEditModule} from '../../_shared/form/app-entity-edit.module';
import {injectOnDelete, injectTabControls} from '../../_shared/form/edit';
import {MyUserService} from '../../_shared/services/user/my-user.service';
import {OrganisationsService} from '../_services/organisations.service';
import {SelectedOrganisationService} from '../_services/selected-organisation.service';
import {AppOrganisationEditFormComponent} from './organisation-edit-form.component';
import {OrganisationEditSettingsComponent} from './organisation-edit-settings.component';
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

        <hr />

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

          @if (myUser()?.isAdmin) {
            <li [ngbNavItem]="'USERS'" *isEditing="entity" [destroyOnHide]="true">
              <a ngbNavLink>{{ 'USER' | tr }}</a>
              <ng-template ngbNavContent>
                <!--suppress TypeScriptValidateTypes -->
                <app-organisation-edit-users [organisation]="entity" [myUserEmailAddress]="myUser()?.emailAddress" />
              </ng-template>
            </li>
          }
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
  ],
})
export class OrganisationEditComponent extends AbstractModelEditComponent<GetOrganisationResponse> {
  onSubmit = injectOnSubmit({entityService: this.organisationsService});
  tabControls = injectTabControls<'DATA' | 'USERS' | 'SETTINGS'>({
    onlyEditingTabs: ['USERS', 'SETTINGS'],
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
