import {NgIf} from '@angular/common';
import {Component, inject, ViewChild} from '@angular/core';
import {FormsModule, ReactiveFormsModule, UntypedFormControl} from '@angular/forms';
import {NgbNav, NgbNavContent, NgbNavItem, NgbNavLink, NgbNavOutlet, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {EntityList, IList} from 'dfts-helper';
import {DfxSortModule, DfxTableModule, NgbSort, NgbTableDataSource} from 'dfx-bootstrap-table';
import {NgSub} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';
import {MyUserService} from '../../../_shared/services/auth/user/my-user.service';

import {AbstractModelEditComponent} from '../../../_shared/ui/abstract-model-edit.component';
import {AppBtnModelEditConfirmComponent} from '../../../_shared/ui/app-btn-model-edit-confirm.component';
import {AppBtnToolbarComponent} from '../../../_shared/ui/app-btn-toolbar.component';
import {AppSelectableButtonComponent} from '../../../_shared/ui/app-selectable-button.component';
import {AppSpinnerRowComponent} from '../../../_shared/ui/app-spinner-row.component';
import {AppIconsModule} from '../../../_shared/ui/icons.module';
import {QuestionDialogComponent} from '../../../_shared/ui/question-dialog/question-dialog.component';
import {OrganisationSettingsModel} from '../_models/organisation-settings.model';
import {OrganisationUserModel} from '../_models/organisation-user.model';

import {OrganisationModel} from '../_models/organisation.model';
import {OrganisationsSettingsService} from '../_services/organisations-settings.service';
import {OrganisationsUsersService} from '../_services/organisations-users.service';
import {OrganisationsService} from '../_services/organisations.service';
import {OrganisationUserAddModalComponent} from '../organisation-user-add-modal.component';

@Component({
  selector: 'app-organisation-edit',
  templateUrl: './organisation-edit.component.html',
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
  ],
})
export class OrganisationEditComponent extends AbstractModelEditComponent<OrganisationModel> {
  override onlyEditingTabs = [2, 3];
  override redirectUrl = '/home/organisations/all';

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
