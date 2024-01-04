import {DatePipe} from '@angular/common';
import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';

import {AppBackButtonComponent} from '@home-shared/components/button/app-back-button.component';
import {ScrollableToolbarComponent} from '@home-shared/components/scrollable-toolbar.component';
import {NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

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

        <h3 class="my-0">HTML</h3>

        <ul ngbNav #nav="ngbNav" [activeId]="1" class="nav-tabs">
          <li [ngbNavItem]="1">
            <button ngbNavLink>Preview</button>
            <ng-template ngbNavContent>
              <div class="json-box">
                <pre class="json-data" [innerHTML]="it.bodyHTML"></pre>
              </div>
            </ng-template>
          </li>
          <li [ngbNavItem]="2">
            <button ngbNavLink>Source</button>
            <ng-template ngbNavContent>
              <div class="json-box">
                <pre class="json-data">{{ it.bodyHTML }}</pre>
              </div>
            </ng-template>
          </li>
        </ul>

        <div [ngbNavOutlet]="nav"></div>

        <h3 class="my-0">Text</h3>

        <div class="json-box">
          <pre class="json-data">{{ it.body }}</pre>
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
      .json-data {
        margin-bottom: 0;
      }
      /** Style email **/
      .container {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-top: -100px;
        max-width: unset;
        line-height: unset;
      }

      .container > ul {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .logo-row {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
      }

      .logo {
        max-width: 96px;
        height: auto;
      }
    `,
  ],
  selector: 'app-tmp-notification-view',
  imports: [DfxTr, BiComponent, ScrollableToolbarComponent, AppBackButtonComponent, DatePipe, AppProgressBarComponent, NgbNavModule],
  encapsulation: ViewEncapsulation.None,
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
