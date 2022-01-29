import {Component, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NgbSort, NgbTableDataSource} from 'dfx-bootstrap-table';
import {EntityList, IList} from 'dfx-helper';

import {AbstractModelEditComponent} from '../../../_helper/abstract-model-edit.component';
import {QuestionDialogComponent} from '../../../_shared/question-dialog/question-dialog.component';

import {NotificationService} from '../../../_services/notifications/notification.service';
import {OrganisationsService} from '../../../_services/models/organisations.service';
import {MyUserService} from '../../../_services/my-user.service';
import {OrganisationsUsersService} from '../../../_services/models/organisations.users.service';

import {OrganisationModel, OrganisationUserModel} from '../../../_models/organisation.model';
import {UserModel} from '../../../_models/user.model';
import {OrganisationUserAddModalComponent} from '../organisation-user-add-modal/organisation-user-add-modal.component';

@Component({
  selector: 'app-organisation-edit',
  templateUrl: './organisation-edit.component.html',
  styleUrls: ['./organisation-edit.component.scss'],
})
export class OrganisationEditComponent extends AbstractModelEditComponent<OrganisationModel> {
  override onlyEditingTabs = [2, 3];
  override redirectUrl = '/home/organisations/all';

  // User org stuff
  dataSource: NgbTableDataSource<OrganisationUserModel> = new NgbTableDataSource();
  columnsToDisplay = ['name', 'email', 'actions'];
  filter = new FormControl();
  @ViewChild(NgbSort, {static: true}) sort: NgbSort | undefined;

  myUser: UserModel | undefined;
  selectedOrganisation: OrganisationModel | undefined;
  organisationUsers: IList<OrganisationUserModel> = new EntityList();

  constructor(
    router: Router,
    route: ActivatedRoute,
    modal: NgbModal,
    myUserService: MyUserService,
    public organisationsService: OrganisationsService,
    protected organisationsUsersService: OrganisationsUsersService,
    protected notificationsService: NotificationService
  ) {
    super(router, route, modal, organisationsService);

    this.myUser = myUserService.getUser();
    this.autoUnsubscribe(
      myUserService.userChange.subscribe((user) => {
        this.myUser = user;
      })
    );

    this.selectedOrganisation = this.organisationsService.getSelected();
    this.autoUnsubscribe(
      this.organisationsService.selectedChange.subscribe((value) => {
        this.selectedOrganisation = value;
      })
    );
  }

  protected onEntityLoaded(): void {
    if (this.isEditing && this.entity && this.organisationsUsersService) {
      this.organisationsUsersService.setGetAllParams([{key: 'organisation_id', value: this.entity.id}]);
      this.organisationUsers = this.organisationsUsersService.getAll();
      this.refreshTable();
      this.autoUnsubscribe(
        this.organisationsUsersService.allChange.subscribe((value) => {
          this.organisationUsers = value;
          this.refreshTable();
        })
      );

      this.filter.valueChanges.subscribe((value) => {
        this.dataSource.filter = value;
      });
    }
  }

  refreshTable(): void {
    this.dataSource = new NgbTableDataSource(this.organisationUsers.clone());
    this.dataSource.sort = this.sort;
  }

  onSelect(organisation: OrganisationModel | undefined): void {
    this.organisationsService.setSelected(organisation);
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
            {key: 'organisationId', value: model.organisation_id},
            {key: 'uEmail', value: model.id},
          ])
          .subscribe(
            (response: any) => {
              console.log(response);
              this.organisationsUsersService.fetchAll();
            },
            (error) => {
              console.log(error);
            }
          );
      }
    });
  }
}
