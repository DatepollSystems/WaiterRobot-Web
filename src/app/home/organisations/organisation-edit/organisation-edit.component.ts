import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {AbstractModelEditComponent} from '../../../_helper/abstract-model-edit.component';

import {OrganisationsService} from '../../../_services/organisations.service';
import {MyUserService} from '../../../_services/my-user.service';

import {OrganisationModel} from '../../../_models/organisation.model';
import {UserModel} from '../../../_models/user.model';

@Component({
  selector: 'app-organisation-edit',
  templateUrl: './organisation-edit.component.html',
  styleUrls: ['./organisation-edit.component.scss'],
})
export class OrganisationEditComponent extends AbstractModelEditComponent<OrganisationModel> {
  override onlyEditingTabs = [3];
  override redirectUrl = '/home/organisations/all';

  myUser: UserModel | undefined;
  selectedOrganisation: OrganisationModel | undefined;

  constructor(
    route: ActivatedRoute,
    router: Router,
    modal: NgbModal,
    protected organisationsService: OrganisationsService,
    private myUserService: MyUserService
  ) {
    super(route, router, organisationsService, modal);

    this.myUser = this.myUserService.getUser();
    this.autoUnsubscribe(
      this.myUserService.userChange.subscribe((user) => {
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

  onSelect(organisation: OrganisationModel | undefined): void {
    this.organisationsService.setSelected(organisation);
  }
}
