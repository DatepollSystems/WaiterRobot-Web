import {HttpClient} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {WINDOW} from 'dfx-helper';
import {map} from 'rxjs';

import * as licensesJson from '../../../../assets/licenses.json';
import {EnvironmentHelper} from '../../EnvironmentHelper';

@Component({
  template: `
    <!-- Button trigger modal -->
    <a (click)="open(content)">{{ 'ABOUT' | tr }}</a>

    <ng-template #content let-modal>
      <div class="modal-header">
        <h3 class="modal-title" id="modal-basic-title">{{ 'ABOUT' | tr }} kellner.team</h3>
        <button type="button" class="btn-close btn-close-white" aria-label="Close" (click)="modal.dismiss()"></button>
      </div>
      <div class="modal-body">
        <ul ngbNav #nav="ngbNav" class="nav-tabs">
          <li [ngbNavItem]="1">
            <a ngbNavLink>{{ 'ABOUT_MODAL_GENERAL' | tr }}</a>
            <ng-template ngbNavContent>
              <p>
                Egal ob sich um ein einmaliges Event oder dauerhafte Bewirtung handelt, kellner.team bietet unkomplizierte und zugängliche
                Lösungen, damit du dich auf das Wesentliche konzentrieren kannst - großartigen Service anzubieten.
              </p>

              <h5>{{ 'ABOUT_MODAL_TECHNICAL' | tr }}</h5>
              <ul class="list-group">
                <li
                  (mousedown)="mousedown()"
                  (mouseup)="mouseup()"
                  (mouseleave)="mouseup()"
                  (click)="clicked()"
                  class="list-group-item not-selectable"
                >
                  {{ 'ABOUT_MODAL_TECHNICAL_WEB_VERSION' | tr }}: {{ frontendVersion }}
                </li>
              </ul>
            </ng-template>
          </li>
          <li [ngbNavItem]="2">
            <a ngbNavLink>{{ 'ABOUT_MODAL_TECHNICAL_USED_LIBRARIES' | tr }}</a>
            <ng-template ngbNavContent>
              <div class="list-group" *ngIf="licenses$ | async as licenses">
                <a
                  *ngFor="let license of licenses"
                  class="list-group-item list-group-item-action"
                  [href]="license.link"
                  rel="noopener"
                  target="_blank"
                >
                  <div class="d-flex w-100 justify-content-between">
                    <h6 class="mb-1">{{ license.name }}</h6>
                    <small>{{ license.licenseType }}</small>
                  </div>
                  <small class="mb-1" *ngIf="license.author !== 'n/a'">by {{ license.author }}</small>
                  <br />
                  <small>{{ license.installedVersion }}</small>
                </a>
              </div>
            </ng-template>
          </li>
        </ul>

        <div [ngbNavOutlet]="nav" class="mt-2"></div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" (click)="modal.close()">{{ 'CLOSE' | tr }}</button>
      </div>
    </ng-template>
  `,
  selector: 'app-about-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutModalComponent {
  frontendVersion = EnvironmentHelper.getWebVersion();

  licenses$ = this.httpClient.get<typeof licensesJson>('/assets/licenses.json').pipe(
    map((it) =>
      it.map((iit) => {
        iit.link = iit.link.replace('git+', '');
        iit.link = iit.link.replace('git:', 'https:');
        iit.link = iit.link.replace('ssh://git@', 'https:');
        return iit;
      }),
    ),
  );

  clicker = 0;
  timeoutHandler: any | undefined;

  constructor(
    private httpClient: HttpClient,
    private modal: NgbModal,
    @Inject(WINDOW) private window: Window | undefined,
  ) {}

  open(content: any): void {
    this.modal.open(content, {ariaLabelledBy: 'About modal'});
  }

  mouseup(): void {
    if (this.timeoutHandler) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      clearTimeout(this.timeoutHandler);
      this.timeoutHandler = undefined;
    }
  }

  mousedown(): void {
    this.timeoutHandler = this.window?.setTimeout(() => {
      this.timeoutHandler = undefined;
      console.log(
        '                      /^--^\\     /^--^\\     /^--^\\\n' +
          '                      \\____/     \\____/     \\____/\n' +
          '                     /      \\   /      \\   /      \\\n' +
          '                    |        | |        | |        |\n' +
          '                     \\__  __/   \\__  __/   \\__  __/\n' +
          '|^|^|^|^|^|^|^|^|^|^|^|^\\ \\^|^|^|^/ /^|^|^|^|^\\ \\^|^|^|^|^|^|^|^|^|^|^|^|\n' +
          '| | | | | | | | | | | | |\\ \\| | |/ /| | | | | | \\ \\ | | | | | | | | | | |\n' +
          '########################/ /######\\ \\###########/ /#######################\n' +
          '| | | | | | | | | | | | \\/| | | | \\/| | | | | |\\/ | | | | | | | | | | | |\n' +
          '|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|\n',
      );
      console.log('Secret source cats love you!');
    }, 1000 * 5);
  }

  clicked(): void {
    this.clicker++;
    setTimeout(() => {
      this.clicker = 0;
    }, 1000 * 3);
    if (this.clicker > 6) {
      document.getElementById('body')?.classList.add('tilt');
    }
  }
}
