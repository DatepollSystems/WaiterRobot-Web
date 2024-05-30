import {HttpClient} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';

import {NgbActiveModal, NgbNav, NgbNavContent, NgbNavItem, NgbNavLink, NgbNavOutlet} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@ngneat/transloco';
import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';

import {injectWindow} from 'dfx-helper';

import {map} from 'rxjs';

import * as licensesJson from '../../../../assets/licenses.json';
import {EnvironmentHelper} from '../../EnvironmentHelper';

@Component({
  template: `
    <div class="modal-header">
      <h3 class="modal-title" id="modal-title-about">{{ 'ABOUT' | transloco }} kellner.team</h3>
      <button type="button" class="btn-close btn-close-white" aria-label="Close" (mousedown)="modal.dismiss()"></button>
    </div>
    <div class="modal-body">
      <ul #nav="ngbNav" ngbNav class="nav-tabs">
        <li [ngbNavItem]="1">
          <a ngbNavLink>{{ 'ABOUT_MODAL_GENERAL' | transloco }}</a>
          <ng-template ngbNavContent>
            <p>
              Egal ob sich um ein einmaliges Event oder dauerhafte Bewirtung handelt, kellner.team bietet unkomplizierte und zugängliche
              Lösungen, damit du dich auf das Wesentliche konzentrieren kannst - großartigen Service anzubieten.
            </p>

            <h5>{{ 'ABOUT_MODAL_TECHNICAL' | transloco }}</h5>
            <ul class="list-group">
              <li
                class="list-group-item not-selectable"
                (mousedown)="mousedown()"
                (mouseup)="mouseup()"
                (mouseleave)="mouseup()"
                (click)="clicked()"
              >
                {{ 'ABOUT_MODAL_TECHNICAL_WEB_VERSION' | transloco }}: {{ frontendVersion }}
              </li>
            </ul>
          </ng-template>
        </li>
        <li [ngbNavItem]="2">
          <a ngbNavLink>{{ 'ABOUT_MODAL_TECHNICAL_USED_LIBRARIES' | transloco }}</a>
          <ng-template ngbNavContent>
            <div class="list-group">
              @for (license of licenses(); track license.name) {
                <a class="list-group-item list-group-item-action" rel="noreferrer" target="_blank" [href]="license.link">
                  <div class="d-flex w-100 justify-content-between">
                    <h6 class="mb-1">{{ license.name }}</h6>
                    <small>{{ license.licenseType }}</small>
                  </div>
                  @if (license.author !== 'n/a') {
                    <small class="mb-1">by {{ license.author }}</small>
                  }
                  <br />
                  <small>{{ license.installedVersion }}</small>
                </a>
              } @empty {
                <app-progress-bar show />
              }
            </div>
          </ng-template>
        </li>
      </ul>

      <div class="mt-2" [ngbNavOutlet]="nav"></div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-secondary" (mousedown)="modal.close()">{{ 'CLOSE' | transloco }}</button>
    </div>
  `,
  standalone: true,
  selector: 'app-about-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgbNavOutlet, NgbNavContent, TranslocoPipe, NgbNavLink, NgbNavItem, NgbNav, AppProgressBarComponent],
})
export class AboutModalComponent {
  #httpClient = inject(HttpClient);
  #window = injectWindow();

  frontendVersion = EnvironmentHelper.getWebVersion();

  modal = inject(NgbActiveModal);

  licenses = toSignal(
    this.#httpClient.get<typeof licensesJson>('/assets/licenses.json').pipe(
      map((it) =>
        it.map((iit) => {
          iit.link = iit.link.replace('git+', '');
          iit.link = iit.link.replace('git:', 'https:');
          iit.link = iit.link.replace('ssh://git@', 'https:');
          return iit;
        }),
      ),
    ),
    {initialValue: []},
  );

  clicker = 0;
  timeoutHandler: number | undefined;

  mouseup(): void {
    if (this.timeoutHandler) {
      clearTimeout(this.timeoutHandler);
      this.timeoutHandler = undefined;
    }
  }

  mousedown(): void {
    this.timeoutHandler = this.#window?.setTimeout(() => {
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
