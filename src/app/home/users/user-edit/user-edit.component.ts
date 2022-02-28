import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {UsersService} from '../../../_services/models/users.service';
import {AbstractModelEditComponent} from '../../../_helper/abstract-model-edit.component';
import {UserModel} from '../../../_models/user.model';
import {DateHelper} from 'dfx-helper';

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
      this.lumber.info('addCustomAttribute', 'Model is admin detected');
    } else {
      model.role = 'USER';
      this.lumber.info('addCustomAttribute', 'Model is user detected');
    }
    model.birthday = DateHelper.getDateFormatted(model.birthday);

    return super.addCustomAttributesBeforeCreateAndUpdate(model);
  }
}
