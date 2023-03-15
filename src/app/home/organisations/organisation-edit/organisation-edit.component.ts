import {AsyncPipe, NgIf} from '@angular/common';
import {Component, inject, ViewChild} from '@angular/core';
import {FormsModule, ReactiveFormsModule, UntypedFormControl} from '@angular/forms';
import {NgbNav, NgbNavContent, NgbNavItem, NgbNavLink, NgbNavOutlet, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {EntityList, IList} from 'dfts-helper';
import {DfxSortModule, DfxTableModule, NgbSort, NgbTableDataSource} from 'dfx-bootstrap-table';
import {NgSub} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';
import {MyUserService} from '../../../_shared/services/auth/user/my-user.service';

import {AbstractModelEditComponent} from '../../../_shared/ui/form/abstract-model-edit.component';
import {AppBtnModelEditConfirmComponent} from '../../../_shared/ui/form/app-btn-model-edit-confirm.component';
import {AppBtnToolbarComponent} from '../../../_shared/ui/app-btn-toolbar.component';
import {AppSelectableButtonComponent} from '../../../_shared/ui/app-selectable-button.component';
import {AppSpinnerRowComponent} from '../../../_shared/ui/loading/app-spinner-row.component';
import {AppIconsModule} from '../../../_shared/ui/icons.module';
import {QuestionDialogComponent} from '../../../_shared/ui/question-dialog/question-dialog.component';
import {OrganisationSettingsModel} from '../_models/organisation-settings.model';
import {OrganisationUserModel} from '../_models/organisation-user.model';

import {OrganisationModel} from '../_models/organisation.model';
import {OrganisationsSettingsService} from '../_services/organisations-settings.service';
import {OrganisationsUsersService} from '../_services/organisations-users.service';
import {OrganisationsService} from '../_services/organisations.service';
import {OrganisationUserAddModalComponent} from '../organisation-user-add-modal.component';
import {CreateOrganisationDto, GetOrganisationResponse, UpdateOrganisationDto} from '../../../_shared/waiterrobot-backend';
import {AppIsEditingDirective} from '../../../_shared/ui/form/app-is-editing.directive';
import {AppIsCreatingDirective} from '../../../_shared/ui/form/app-is-creating.directive';
import {AppModelEditSaveBtn} from '../../../_shared/ui/form/app-model-edit-save-btn.component';
import {AppOrganisationEditFormComponent} from './organisation-edit-form.component';

@Component({
  template: `
    <div *ngIf="entity$ | async as entity; else loading">
      <h1 *isEditing="entity">{{ 'EDIT_2' | tr }} {{ entity.name }}</h1>
      <h1 *isCreating="entity">{{ 'ADD_2' | tr }}</h1>

      <btn-toolbar>
        <div>
          <button class="btn btn-sm btn-dark text-white" (click)="onGoBack('/home/organisations/all')">{{ 'GO_BACK' | tr }}</button>
        </div>

        <app-model-edit-save-btn (submit)="form?.submit()" [valid]="valid$ | async" [editing]="entity !== 'CREATE'" />

        <ng-container *isEditing="entity">
          <div *ngIf="(myUser$ | async)?.isAdmin">
            <button class="btn btn-sm btn-outline-danger" (click)="onDelete(entity.id)">
              <i-bs name="trash" />
              {{ 'DELETE' | tr }}
            </button>
          </div>
          <div>
            <!--suppress TypeScriptValidateTypes -->
            <selectable-button class="my-2" [entity]="entity" [selectedEntityService]="organisationsService" />
          </div>
        </ng-container>
      </btn-toolbar>

      <ul ngbNav #nav="ngbNav" [activeId]="activeTab$ | async" class="nav-tabs bg-dark" (navChange)="navigateToTab($event.nextId)">
        <li [ngbNavItem]="'DATA'" [destroyOnHide]="false">
          <a ngbNavLink>{{ 'DATA' | tr }}</a>
          <ng-template ngbNavContent>
            <app-organisation-edit-form />
          </ng-template>
        </li>

        <li [ngbNavItem]="2" *isEditing="entity" [destroyOnHide]="true">
          <a ngbNavLink>{{ 'USER' | tr }}</a>
          <ng-template ngbNavContent>
            <div class="d-flex flex-column flex-md-row gap-3 mb-3 justify-content-between">
              <form class="col-12 col-md-6">
                <div class="input-group">
                  <input
                    class="form-control ml-2 bg-dark text-white"
                    type="text"
                    [formControl]="filter"
                    placeholder="{{ 'SEARCH' | tr }}"
                  />
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    ngbTooltip="{{ 'CLEAR' | tr }}"
                    placement="bottom"
                    (click)="filter.reset()"
                    *ngIf="filter?.value?.length > 0"
                  >
                    <i-bs name="x-circle-fill" />
                  </button>
                </div>
              </form>

              <button class="col-12 col-md-3 col-lg-2 btn btn-secondary" type="button" (click)="openAddUserModal()">
                <i-bs name="save" />
                {{ 'ADD_3' | tr }}
              </button>
            </div>

            <div class="table-responsive mt-3">
              <table ngb-table [hover]="true" [dataSource]="dataSource" ngb-sort>
                <ng-container ngbColumnDef="name">
                  <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAME' | tr }}</th>
                  <td *ngbCellDef="let organisationUser" ngb-cell>{{ organisationUser.name }}</td>
                </ng-container>

                <ng-container ngbColumnDef="email">
                  <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'EMAIL' | tr }}</th>
                  <td *ngbCellDef="let organisationUser" ngb-cell>{{ organisationUser.id }}</td>
                </ng-container>

                <ng-container ngbColumnDef="role">
                  <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'ROLE' | tr }}</th>
                  <td *ngbCellDef="let organisationUser" ngb-cell>
                    {{ organisationUser.role }}
                    <a class="btn btn-sm m-1 btn-outline-success text-white" ngbTooltip="{{ 'EDIT' | tr }}">
                      <i-bs name="pencil-square" />
                    </a>
                  </td>
                </ng-container>

                <ng-container ngbColumnDef="actions">
                  <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | tr }}</th>
                  <td *ngbCellDef="let organisationUser" ngb-cell>
                    <button
                      type="button"
                      class="btn btn-sm m-1 btn-outline-danger text-white"
                      ngbTooltip="{{ 'DELETE' | tr }}"
                      (click)="onOrgUserDelete(organisationUser)"
                      *ngIf="myUser?.isAdmin || this.myUser?.emailAddress !== organisationUser.email_address"
                    >
                      <i-bs name="trash" />
                    </button>
                  </td>
                </ng-container>

                <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
                <tr *ngbRowDef="let organisationUser; columns: columnsToDisplay" ngb-row></tr>
              </table>
            </div>
          </ng-template>
        </li>
        <li [ngbNavItem]="3" *isEditing="entity" [destroyOnHide]="true">
          <a ngbNavLink>{{ 'SETTINGS' | tr }}</a>
          <ng-template ngbNavContent>
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                role="switch"
                id="activateWaiterOnSignInViaCreateToken"
                [checked]="settings?.activateWaiterOnSignInViaCreateToken"
                (click)="setActivateWaiterOnSignInViaCreateToken()"
              />
              <label class="form-check-label" for="activateWaiterOnSignInViaCreateToken">
                {{ 'HOME_ORGS_SETTINGS_ACTIVATE_WAITER_ON_SIGN_IN_VIA_CREATE_TOKEN' | tr }}</label
              >
            </div>
          </ng-template>
        </li>
      </ul>

      <div [ngbNavOutlet]="nav" class="mt-2 bg-dark"></div>
    </div>

    <ng-template #loading>
      <app-spinner-row />
    </ng-template>
  `,
  selector: 'app-organisation-edit',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
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
    DfxTableModule,
    DfxSortModule,
    AppBtnToolbarComponent,
    AppBtnModelEditConfirmComponent,
    AppSelectableButtonComponent,
    AppSpinnerRowComponent,
    AsyncPipe,
    AppIsEditingDirective,
    AppIsCreatingDirective,
    AppModelEditSaveBtn,
    AppOrganisationEditFormComponent,
  ],
})
export class OrganisationEditComponent extends AbstractModelEditComponent<
  CreateOrganisationDto,
  UpdateOrganisationDto,
  GetOrganisationResponse,
  'DATA' | 'USERS' | 'SETTINGS'
> {
  defaultTab = 'DATA' as const;
  override redirectUrl = '/home/organisations/all';

  override onlyEditingTabs = ['USERS' as const, 'SETTINGS' as const];

  // User org stuff
  dataSource: NgbTableDataSource<OrganisationUserModel> = new NgbTableDataSource();
  columnsToDisplay = ['name', 'email', 'actions'];
  filter = new UntypedFormControl();
  @ViewChild(NgbSort, {static: true}) sort: NgbSort | undefined;

  settings: OrganisationSettingsModel | undefined;

  myUser$ = inject(MyUserService).getUser$();
  selectedOrganisation: OrganisationModel | undefined;
  organisationUsers: IList<OrganisationUserModel> = new EntityList();

  constructor(
    public organisationsService: OrganisationsService,
    public organisationsSettingsService: OrganisationsSettingsService,
    protected organisationsUsersService: OrganisationsUsersService
  ) {
    super(organisationsService);

    this.selectedOrganisation = this.organisationsService.getSelected();

    this.unsubscribe(this.organisationsService.getSelected$.subscribe((it) => (this.selectedOrganisation = it)));
  }

  override onEntityEdit(model: OrganisationModel): void {
    this.filter.valueChanges.subscribe((value) => {
      this.dataSource.filter = value;
    });

    this.organisationsUsersService.setGetAllParams([{key: 'organisationId', value: model.id}]);
    this.organisationUsers = this.organisationsUsersService.getAll();
    this.settings = this.organisationsSettingsService.getSettings(model.id);
    this.refreshTable();
    this.unsubscribe(
      this.organisationsUsersService.allChange.subscribe((it) => {
        this.organisationUsers = it;
        this.refreshTable();
      }),
      this.organisationsSettingsService.settingsChange.subscribe((it) => (this.settings = it))
    );
  }

  refreshTable(): void {
    this.dataSource = new NgbTableDataSource(this.organisationUsers.clone());
    this.dataSource.sort = this.sort;
  }

  openAddUserModal(): void {
    const modalRef = this.modal.open(OrganisationUserAddModalComponent, {
      ariaLabelledBy: 'modal-title-org-user-add',
      size: 'lg',
    });
    modalRef.componentInstance.entity = this.entity;
  }

  onOrgUserDelete(model: OrganisationUserModel): void {
    const modalRef = this.modal.open(QuestionDialogComponent, {ariaLabelledBy: 'modal-question-title', size: 'lg'});
    modalRef.componentInstance.title = 'DELETE_CONFIRMATION';
    void modalRef.result.then((result) => {
      if (result?.toString().includes(QuestionDialogComponent.YES_VALUE)) {
        this.organisationsUsersService
          ._delete(model.id, [
            {key: 'organisationId', value: model.organisationId},
            {key: 'uEmail', value: model.id},
          ])
          .subscribe({
            next: (response: any) => {
              console.log(response);
              this.organisationsUsersService.fetchAll();
            },
            error: (error) => {
              console.log(error);
            },
          });
      }
    });
  }

  setActivateWaiterOnSignInViaCreateToken(): void {
    if (this.entity) {
      this.organisationsSettingsService.setActivateWaiterOnSignInViaCreateToken(
        this.entity.id,
        !this.settings?.activateWaiterOnSignInViaCreateToken
      );
    }
  }
}
