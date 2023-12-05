import {DatePipe} from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

import {AppProgressBarComponent} from '../../../_shared/ui/loading/app-progress-bar.component';
import {AppBackButtonComponent} from '../../_shared/components/button/app-back-button.component';
import {ScrollableToolbarComponent} from '../../_shared/components/scrollable-toolbar.component';
import {TmpNotificationsService} from './tmp-notifications.service';

@Component({
  template: `
    @if (tmpNotification(); as it) {
      <div class="d-flex flex-column gap-3">
        <h1 class="my-0">TMP-Notification</h1>

        <scrollable-toolbar>
          <back-button />
          <div>
            <span class="badge text-bg-primary">{{ it.createdAt | date: 'dd.MM.YYYY HH:mm:ss:SSS' }}</span>
          </div>
          <div>
            <span class="badge text-bg-secondary">{{ it.to }}</span>
          </div>
          <div>
            <span class="badge text-bg-secondary">{{ it.subject }}</span>
          </div>
        </scrollable-toolbar>

        <hr />

        <div class="json-box">
          <pre id="json-data">{{ it.body }}</pre>
        </div>

        <div class="json-box">
          <pre id="json-data">{{ it.bodyHTML }}</pre>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .json-box {
        padding: 15px;
        background-color: black;
        border-radius: 5px;
      }
      #json-data {
        margin-bottom: 0;
      }
    `,
  ],
  selector: 'app-tmp-notification-view',
  imports: [DfxTr, BiComponent, ScrollableToolbarComponent, AppBackButtonComponent, DatePipe, AppProgressBarComponent],
  standalone: true,
})
export class TmpNotificationViewComponent implements OnInit {
  router = inject(Router);
  tmpNotification = inject(TmpNotificationsService).single;

  ngOnInit(): void {
    if (!this.tmpNotification()) {
      void this.router.navigateByUrl('/tmp-notifications');
    }
  }
}
