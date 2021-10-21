import {Component, OnDestroy, QueryList, ViewChildren} from '@angular/core';
import {Subscription} from 'rxjs';

import {compare, SortableHeaderDirective, SortEvent} from '../../../_shared/table-sortable';

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

  @ViewChildren(SortableHeaderDirective) headers: QueryList<SortableHeaderDirective> | undefined;

  ngOnDestroy(): void {
    this.sessionsSubscription.unsubscribe();
  }

  onDelete(id: number): void {
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
        const res = compare((a as any)[column], (b as any)[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }
}
