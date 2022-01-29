import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {UsersService} from '../../../_services/models/users.service';
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
    super(router, route, modal, usersService);
  }

  override addCustomAttributesBeforeCreateAndUpdate(model: any): any {
    if (model.is_admin) {
      model.role = 'ADMIN';
      this.lumber.info('addCustomAttribute', 'Model is admin detected', model);
    } else {
      model.role = 'USER';
      this.lumber.info('addCustomAttribute', 'Model is user detected', model);
    }

    if (model.activated?.length === 0) {
      model.activated = false;
    }

    if (model.force_password_change?.length === 0) {
      model.force_password_change = false;
    }

    return super.addCustomAttributesBeforeCreateAndUpdate(model);
  }
}
