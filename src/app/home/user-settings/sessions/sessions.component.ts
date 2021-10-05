import {Component, OnDestroy, QueryList, ViewChildren} from '@angular/core';
import {Subscription} from 'rxjs';

import {compare, SortableHeader, SortEvent} from '../../../_helper/table-sortable';

import {SessionsService} from '../../../_services/sessions.service';
import {SessionsModel} from '../../../_models/session.model';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
})
export class SessionsComponent implements OnDestroy {
  constructor(private sessionsService: SessionsService) {
    this.sessions = this.sessionsService.getAll();
    this.sessionsCopy = this.sessions.slice();
    this.sessionsSubscription = this.sessionsService.allChange.subscribe((value: SessionsModel[]) => {
      this.sessions = value;
      this.sessionsCopy = this.sessions.slice();
    });
  }

  sessions: SessionsModel[];
  sessionsCopy: SessionsModel[];
  sessionsSubscription: Subscription;

  @ViewChildren(SortableHeader) headers: QueryList<SortableHeader> | undefined;

  ngOnDestroy(): void {
    this.sessionsSubscription.unsubscribe();
  }

  onDelete(id: number) {
    this.sessionsService.delete(id);
  }

  onSort({column, direction}: SortEvent): boolean | void {
    if (this.headers == null) {
      return;
    }

    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction === '' || column === '') {
      this.sessionsCopy = this.sessions.slice();
    } else {
      this.sessionsCopy = [...this.sessions].sort((a, b) => {
        // @ts-ignore
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }
}
