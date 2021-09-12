import {Component} from '@angular/core';

import {TypeHelper} from 'dfx-helper';

import {UsersService} from '../../../_services/users.service';
import {UserModel} from '../../../_models/user.model';
import {AModelsListComponent} from '../../../_helper/a-models-list.component';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.scss']
})
export class AllUsersComponent extends AModelsListComponent<UserModel> {
  constructor(usersService: UsersService) {
    super(usersService);
  }

  protected checkFilterForModel(filter: string, model: UserModel): UserModel | undefined {
    if (TypeHelper.numberToString(model.id) === filter
      || model.firstname.trim().toLowerCase().includes(filter)
      || model.surname.trim().toLowerCase().includes(filter)
      || model.email_address.trim().toLowerCase().includes(filter)
      || TypeHelper.booleanToString(model.is_admin).trim().toLowerCase().includes(filter)) {
      return model;
    }
    return undefined;
  }
}
