import {Component} from '@angular/core';

import {Converter} from 'dfx-helper';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {AbstractModelsListComponent} from '../../../_helper/abstract-models-list.component';
import {UsersService} from '../../../_services/users.service';
import {UserModel} from '../../../_models/user.model';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.scss'],
})
export class AllUsersComponent extends AbstractModelsListComponent<UserModel> {
  columnsToDisplay = ['id', 'name', 'email_address', 'birthday', 'is_admin', 'actions'];

  constructor(usersService: UsersService, modal: NgbModal) {
    super(usersService, modal);
  }
}
