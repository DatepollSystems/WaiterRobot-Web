import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {UserModel} from '../../../_models/user.model';
import {UsersService} from '../../../_services/users.service';
import {AModelEditComponent} from '../../../_helper/a-model-edit.component';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent extends AModelEditComponent<UserModel>{
  override redirectUrl = '/home/users/all'

  constructor(route: ActivatedRoute,
              router: Router,
              usersService: UsersService) {
    super(route, router, usersService)
  }
}
