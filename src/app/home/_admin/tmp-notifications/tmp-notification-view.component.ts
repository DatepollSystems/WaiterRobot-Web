import {DatePipe} from '@angular/common';
import {Component, ViewEncapsulation, computed} from '@angular/core';

import {filter, map, pipe, startWith, switchMap} from 'rxjs';

import {NgbNavModule, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {cl_copy} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {PdfJsViewerModule} from 'ng2-pdfjs-viewer';
import {derivedFrom} from 'ngxtension/derived-from';
import {injectParams} from 'ngxtension/inject-params';

import {AppBackButtonComponent} from '@home-shared/components/button/app-back-button.component';
import {ScrollableToolbarComponent} from '@home-shared/components/scrollable-toolbar.component';
import {base64ToArrayBuffer} from '@home-shared/services/file.utils';

import {injectAPI} from '@shared/api';

@Component({
  template: `
    @if (tmpNotification(); as it) {
      <div class="d-flex flex-column gap-3">
        <h1 class="my-0">TMP-Notification {{ it.id }}</h1>

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

        @if (it.bodyHTML) {
          <h3 class="my-0">HTML</h3>

          <ul class="nav-tabs" #nav="ngbNav" [activeId]="1" ngbNav>
            <li [ngbNavItem]="1">
              <button type="button" ngbNavLink>Preview</button>
              <ng-template ngbNavContent>
                <div class="json-box">
                  <div class="d-flex justify-content-end">
                    <button class="ms-auto btn btn-dark btn-sm" (mousedown)="copy(it.bodyHTML)" type="button" ngbTooltip="Copy">
                      <bi name="copy" />
                    </button>
                  </div>
                  <pre class="json-data" [innerHTML]="it.bodyHTML"></pre>
                </div>
              </ng-template>
            </li>
            <li [ngbNavItem]="2">
              <button type="button" ngbNavLink>Source</button>
              <ng-template ngbNavContent>
                <div class="json-box">
                  <div class="d-flex justify-content-end mb-2">
                    <button class="ms-auto btn btn-dark btn-sm" (mousedown)="copy(it.bodyHTML)" type="button" ngbTooltip="Copy">
                      <bi name="copy" />
                    </button>
                  </div>
                  <pre class="json-data">{{ it.bodyHTML }}</pre>
                </div>
              </ng-template>
            </li>
          </ul>

          <div [ngbNavOutlet]="nav"></div>

          <hr />
        }

        <h3 class="my-0">Text</h3>

        <div class="d-flex gap-2">
          <div class="json-box" style="width: 50%">
            <div class="d-flex justify-content-end mb-2">
              <button class="ms-auto btn btn-dark btn-sm" (mousedown)="copy(it.body)" type="button" ngbTooltip="Copy">
                <bi name="copy" />
              </button>
            </div>
            <pre class="json-data">{{ it.body }}</pre>
          </div>

          @if (tmpNotificationPdf(); as pdf) {
            <div style="height: 600px; width: 50%">
              <ng2-pdfjs-viewer [pdfSrc]="pdf" [viewBookmark]="false" />
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: `
    .json-box {
      padding: 15px;
      background-color: black;
      border-radius: 5px;
    }
    .json-data {
      margin-bottom: 0;
      white-space: pre-wrap;
      word-wrap: break-word; /* Allows words to break and wrap */
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
  selector: 'app-tmp-notification-view',
  imports: [BiComponent, ScrollableToolbarComponent, AppBackButtonComponent, DatePipe, NgbNavModule, PdfJsViewerModule, NgbTooltip],
  encapsulation: ViewEncapsulation.None,
})
export class TmpNotificationViewComponent {
  #api = injectAPI();

  tmpNotification = derivedFrom(
    [injectParams('id')],
    pipe(
      map(([id]) => id),
      filter((id): id is string => !!id),
      switchMap((id) =>
        this.#api.get('/v1/public/temp-notifications').pipe(map((notifications) => notifications.find((it) => it.id === id))),
      ),
      startWith(undefined),
    ),
  );

  tmpNotificationPdf = computed(() => base64ToArrayBuffer(this.tmpNotification()!.body));

  copy(it: string) {
    cl_copy(it);
  }
}
