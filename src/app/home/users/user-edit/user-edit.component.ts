import {Component, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';

import {TypeHelper} from 'dfx-helper';

import {UserModel} from '../../../_models/user.model';
import {UsersService} from '../../../_services/users.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnDestroy {
  isEdit = false;
  active = 1;

  user: UserModel | undefined;
  userSubscription: Subscription | undefined;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private usersService: UsersService) {
    this.route.queryParams.subscribe((params => {
      if (params?.tab != null) {
        this.active = TypeHelper.stringToNumber(params?.tab);
      }
    }));

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id != null) {
        if (TypeHelper.isNumeric(id)) {
          console.log('User to open: ' + id);
          this.user = this.usersService.getSingle(TypeHelper.stringToNumber(id));
          this.userSubscription = this.usersService.singleChange.subscribe(value => {
            this.user = value;
          });
          this.isEdit = true;
        } else {
          this.isEdit = false;
          console.log('Create new user');

          // Tab 3 is the statistics tab which does not exist on create organisation
          if (this.active == 3) {
            this.active = 1;
          }
        }
      } else {
        console.log('No user to open');
      }
    });
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  onNavChange($event: any) {
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: {tab: $event.nextId},
        queryParamsHandling: 'merge',
      }).then();
  }

  onSave(f: NgForm) {
    let user = f.form.value
    console.log(user);
    if (this.isEdit && this.user?.id != null) {
      user.id = this.user?.id;
      this.usersService.update(user);
    } else {
      this.usersService.create(user);
    }
    this.router.navigateByUrl('/home/users/all').then();
  }

  delete(organisationId: number) {
    this.usersService.delete(organisationId);
    this.router.navigateByUrl('/home/users/all').then();
  }
}
