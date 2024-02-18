import {DatePipe} from '@angular/common';
import {Component, computed, inject, ViewChild, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';

import {AppBackButtonComponent} from '@home-shared/components/button/app-back-button.component';
import {ScrollableToolbarComponent} from '@home-shared/components/scrollable-toolbar.component';
import {NgbNavModule, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';
import {cl_copy} from 'dfts-helper';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxCutPipe} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';
import {PdfJsViewerComponent, PdfJsViewerModule} from 'ng2-pdfjs-viewer';
import {computedFrom} from 'ngxtension/computed-from';
import {injectParams} from 'ngxtension/inject-params';

import {filter, map, pipe, startWith, switchMap} from 'rxjs';

import {TmpNotificationsService} from './tmp-notifications.service';

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

          <ul #nav="ngbNav" ngbNav class="nav-tabs" [activeId]="1">
            <li [ngbNavItem]="1">
              <button type="button" ngbNavLink>Preview</button>
              <ng-template ngbNavContent>
                <div class="json-box">
                  <div class="d-flex justify-content-end">
                    <button type="button" class="ms-auto btn btn-dark btn-sm" ngbTooltip="Copy" (click)="copy(it.bodyHTML)">
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
                    <button type="button" class="ms-auto btn btn-dark btn-sm" ngbTooltip="Copy" (click)="copy(it.bodyHTML)">
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
              <button type="button" class="ms-auto btn btn-dark btn-sm" ngbTooltip="Copy" (click)="copy(it.body)">
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
  styles: [
    `
      .json-box {
        padding: 15px;
        background-color: black;
        border-radius: 5px;
      }
      .json-data {
        margin-bottom: 0;
        white-space: normal; /* Ensures normal text wrapping */
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
  ],
  selector: 'app-tmp-notification-view',
  imports: [
    DfxTr,
    BiComponent,
    ScrollableToolbarComponent,
    AppBackButtonComponent,
    DatePipe,
    AppProgressBarComponent,
    NgbNavModule,
    PdfJsViewerModule,
    NgbTooltip,
    DfxCutPipe,
  ],
  // eslint-disable-next-line @angular-eslint/use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class TmpNotificationViewComponent {
  router = inject(Router);
  tmpNotificationService = inject(TmpNotificationsService);

  tmpNotification = computedFrom(
    [injectParams('id')],
    pipe(
      map(([id]) => id),
      filter((id): id is string => !!id),
      switchMap((id) => this.tmpNotificationService.getSingle$(id)),
      startWith(undefined),
    ),
  );

  tmpNotificationPdf = computed(() => base64ToArrayBuffer(this.tmpNotification()!.body));

  @ViewChild('pdfViewerAutoLoad') pdfViewerAutoLoad!: PdfJsViewerComponent;

  copy(it: string) {
    cl_copy(it);
  }
}

function base64ToArrayBuffer(base64: string): Uint8Array | undefined {
  try {
    if (!/^(?:[A-Za-z0-9+/]{4})*?(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(base64)) {
      return undefined;
    }

    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
  } catch {
    return undefined;
  }
}
