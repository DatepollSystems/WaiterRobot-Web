import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {UsersService} from '../../../_services/users.service';
import {AbstractModelEditComponent} from '../../../_helper/abstract-model-edit.component';
import {UserModel} from '../../../_models/user.model';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
})
export class UserEditComponent extends AbstractModelEditComponent<UserModel> {
  override redirectUrl = '/home/users/all';

  constructor(route: ActivatedRoute, router: Router, usersService: UsersService, modal: NgbModal) {
    super(route, router, usersService, modal);
  }
}
