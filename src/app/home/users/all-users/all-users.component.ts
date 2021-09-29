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
  constructor(usersService: UsersService, modal: NgbModal) {
    super(usersService, modal);
  }

  protected checkFilterForModel(filter: string, model: UserModel): UserModel | undefined {
    if (
      Converter.numberToString(model.id) === filter ||
      model.firstname.trim().toLowerCase().includes(filter) ||
      model.surname.trim().toLowerCase().includes(filter) ||
      model.email_address.trim().toLowerCase().includes(filter) ||
      Converter.booleanToString(model.is_admin).trim().toLowerCase().includes(filter)
    ) {
      return model;
    }
    return undefined;
  }
}
