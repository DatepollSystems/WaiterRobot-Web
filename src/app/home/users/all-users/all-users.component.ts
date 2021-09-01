import {Component, OnDestroy, QueryList, ViewChildren} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Subscription} from 'rxjs';

import {TypeHelper} from 'dfx-helper';

import {compare, SortableHeader, SortEvent} from '../../../_helper/table-sortable';
import {UsersService} from '../../../_services/users.service';
import {UserModel} from '../../../_models/user.model';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.scss']
})
export class AllUsersComponent implements OnDestroy {
  @ViewChildren(SortableHeader) headers: QueryList<SortableHeader> | undefined;
  filter = new FormControl('');

  users: UserModel[];
  usersCopy: UserModel[];
  usersSubscription: Subscription;

  constructor(private usersModel: UsersService) {
    this.users = this.usersModel.getAll();
    this.usersCopy = this.users.slice();
    this.usersSubscription = this.usersModel.allChange.subscribe(value => {
      this.users = value;
      this.usersCopy = this.users.slice();
    });

    this.filter.valueChanges.subscribe(value => {
      if (value == null) {
        this.usersCopy = this.users.slice();
        return;
      }
      value = value.trim().toLowerCase();
      this.usersCopy = [];
      for (const user of this.users) {
        if (user.id == value
          || user.firstname.trim().toLowerCase().includes(value)
          || user.surname.trim().toLowerCase().includes(value)
          || user.email_address.trim().toLowerCase().includes(value)
          || TypeHelper.booleanToString(user.is_admin).trim().toLowerCase().includes(value)) {
          this.usersCopy.push(user);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.usersSubscription.unsubscribe();
  }
  onDelete(id: number) {
    this.usersModel.delete(id);
  }

  onSort({column, direction}: SortEvent): boolean | void {
    if (this.headers == null) {
      return;
    }

    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction === '' || column === '') {
      this.usersCopy = this.users.slice();
    } else {
      this.usersCopy = [...this.users].sort((a, b) => {
        // @ts-ignore
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }
}
