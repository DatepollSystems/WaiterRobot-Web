import {Component, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NgbSort, NgbTableDataSource} from 'dfx-bootstrap-table';
import {IList} from 'dfx-helper';

import {AbstractModelEditComponent} from '../../../_helper/abstract-model-edit.component';

import {OrganisationsService} from '../../../_services/models/organisations.service';
import {MyUserService} from '../../../_services/my-user.service';
import {OrganisationsUsersService} from '../../../_services/models/organisations.users.service';

import {OrganisationModel, OrganisationUserModel} from '../../../_models/organisation.model';
import {UserModel} from '../../../_models/user.model';

@Component({
  selector: 'app-organisation-edit',
  templateUrl: './organisation-edit.component.html',
  styleUrls: ['./organisation-edit.component.scss'],
})
export class OrganisationEditComponent extends AbstractModelEditComponent<OrganisationModel> {
  override onlyEditingTabs = [3];
  override redirectUrl = '/home/organisations/all';

  public dataSource: NgbTableDataSource<OrganisationUserModel> = new NgbTableDataSource();
  columnsToDisplay = ['name', 'email', 'role', 'actions'];
  public filter = new FormControl();
  @ViewChild(NgbSort, {static: true}) sort: NgbSort | undefined;

  myUser: UserModel | undefined;
  selectedOrganisation: OrganisationModel | undefined;
  organisationUsers: IList<OrganisationUserModel>;

  constructor(
    route: ActivatedRoute,
    router: Router,
    modal: NgbModal,
    protected organisationsService: OrganisationsService,
    protected organisationsUsersService: OrganisationsUsersService,
    myUserService: MyUserService
  ) {
    super(route, router, organisationsService, modal);

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

  refreshTable() {
    this.dataSource = new NgbTableDataSource(this.organisationUsers.clone());
    this.dataSource.sort = this.sort;
  }

  onSelect(organisation: OrganisationModel | undefined): void {
    this.organisationsService.setSelected(organisation);
  }
}
