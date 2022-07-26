import {Component} from '@angular/core';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AbstractModelsListComponent} from '../../../_helper/abstract-models-list.component';
import {UserModel} from '../../../_models/user/user.model';

import {UsersService} from '../../../_services/models/user/users.service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.scss'],
})
export class AllUsersComponent extends AbstractModelsListComponent<UserModel> {
  override columnsToDisplay = ['id', 'name', 'email_address', 'birthday', 'is_admin', 'activated', 'actions'];

  constructor(usersService: UsersService, modal: NgbModal) {
    super(modal, usersService);
  }
}
