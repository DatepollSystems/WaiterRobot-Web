import {Component, computed, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

import {AppSelectableBtnComponent} from '@home-shared/components/button/app-selectable-btn.component';
import {AbstractModelEditComponent} from '@home-shared/form/abstract-model-edit.component';
import {AppEntityEditModule} from '@home-shared/form/app-entity-edit.module';
import {injectOnDelete, injectTabControls} from '@home-shared/form/edit';
import {injectIdParam$} from '@home-shared/services/injectActivatedRouteIdParam';
import {MyUserService} from '@home-shared/services/user/my-user.service';
import {NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import {injectOnSubmit} from '@shared/form';
import {GetOrganisationResponse} from '@shared/waiterrobot-backend';
import {OrganisationsSettingsService} from '../_services/organisations-settings.service';

import {OrganisationsService} from '../_services/organisations.service';
import {SelectedOrganisationService} from '../_services/selected-organisation.service';
import {AppOrganisationEditFormComponent} from './organisation-edit-form.component';
import {OrganisationEditSettingsComponent} from './organisation-edit-settings.component';
import {OrganisationEditStripeComponent} from './organisation-edit-stripe/organisation-edit-stripe.component';
import {OrganisationEditUsersComponent} from './organisation-edit-users/organisation-edit-users.component';

@Component({
  template: `
    @if (entity(); as entity) {
      <div class="d-flex flex-column gap-2">
        <h1 *isEditing="entity">{{ 'EDIT_2' | transloco }} {{ entity.name }}</h1>
        <h1 *isCreating="entity">{{ 'ADD_2' | transloco }}</h1>

        <scrollable-toolbar>
          <back-button />

          <ng-container *isEditing="entity">
            @if (myUser()?.isAdmin) {
              <div>
                <button type="button" class="btn btn-sm btn-outline-danger" (click)="onDelete(entity.id)">
                  <bi name="trash" />
                  {{ 'DELETE' | transloco }}
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
          #nav="ngbNav"
          ngbNav
          class="nav-tabs"
          [activeId]="tabControls.activeTab()"
          (navChange)="tabControls.navigateToTab($event.nextId)"
        >
          <li [ngbNavItem]="'DATA'" [destroyOnHide]="false">
            <a ngbNavLink>{{ 'DATA' | transloco }}</a>
            <ng-template ngbNavContent>
              <app-organisation-edit-form
                #form
                [formDisabled]="!myUser()?.isAdmin"
                [organisation]="entity"
                (submitUpdate)="onSubmit('UPDATE', $event)"
                (submitCreate)="onSubmit('CREATE', $event)"
              />
            </ng-template>
          </li>

          <li *isEditing="entity" [ngbNavItem]="'USERS'" [destroyOnHide]="true">
            <a ngbNavLink>{{ 'USER' | transloco }}</a>
            <ng-template ngbNavContent>
              <!--suppress TypeScriptValidateTypes -->
              <app-organisation-edit-users [organisation]="entity" [myUserEmailAddress]="myUser()?.emailAddress" />
            </ng-template>
          </li>

          @if (settingsState.settings()?.stripeEnabled) {
            <li *isEditing="entity" [ngbNavItem]="'STRIPE'" [destroyOnHide]="true">
              <a ngbNavLink>{{ 'STRIPE' | transloco }}</a>
              <ng-template ngbNavContent>
                <app-organisation-edit-stripe />
              </ng-template>
            </li>
          }
          <li *isEditing="entity" [ngbNavItem]="'SETTINGS'" [destroyOnHide]="true">
            <a ngbNavLink>{{ 'SETTINGS' | transloco }}</a>
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

  settingsState = inject(OrganisationsSettingsService).state;

  constructor(private organisationsService: OrganisationsService) {
    super(organisationsService);

    injectIdParam$()
      .pipe(takeUntilDestroyed())
      .subscribe((id) => void this.settingsState.load(id));
  }
}
