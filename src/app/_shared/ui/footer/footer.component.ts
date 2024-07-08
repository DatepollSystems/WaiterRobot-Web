import {LowerCasePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {TranslocoPipe} from '@jsverse/transloco';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AppLogoWithTextComponent} from '@outside-shared/app-logo-with-text.component';
import {EnvironmentHelper} from '@shared/EnvironmentHelper';
import {AboutModalComponent} from '@shared/ui/footer/about-modal.component';

import {a_shuffle} from 'dfts-helper';

@Component({
  template: `
    <footer class="container-fluid border-top py-3">
      <div [class]="'my-container ' + container">
        <div class="d-flex flex-column flex-xxl-row justify-content-between gap-2">
          <div
            class="d-flex flex-column flex-sm-row gap-2 text-body-secondary align-items-center justify-content-center justify-content-sm-between"
          >
            <a href="https://kellner.team" rel="noreferrer" target="_blank" style="padding-bottom: 2px;">
              <app-logo-with-text hideLogo textHeight="23" textWidthScale="0.7" />
            </a>
            <div class="d-inline-flex align-items-center gap-1">
              <span>made with</span>
              <span class="heart fs-3" (click)="heart()">♥</span>
              <span>by</span>

              @for (name of names; track name; let index = $index) {
                <span>
                  <span [class]="'text-decoration-underline name ' + name | lowercase">{{ name }}</span>
                  @if (index < 1) {
                    <span>,</span>
                  }
                  @if (index === 1) {
                    <span class="ms-1">&</span>
                  }
                </span>
              }
            </div>
          </div>
          <div class="d-flex flex-wrap align-items-center gap-2 text-body-emphasis justify-content-center justify-content-lg-end">
            <div>
              <a routerLink="/info/privacypolicy">
                {{ 'ABOUT_PRIVACY_POLICY' | transloco }}
              </a>
            </div>
            <div>
              <a routerLink="/info/imprint">
                {{ 'ABOUT_IMPRINT' | transloco }}
              </a>
            </div>
            <div>
              <button type="button" class="btn btn-link px-0" (mousedown)="openAbout()">
                {{ 'ABOUT' | transloco }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: `
    .heart {
      color: red;
      margin-top: -5px;
    }

    .heart:hover {
      transform: scale(1.4);
    }

    .name:hover {
      cursor: pointer;
      position: relative;
      font-weight: 500;
    }
    .name:hover:after {
      transform: scale(0.3);
      width: 128px;
      height: 128px;
      display: block;
      position: absolute;
      left: -90px;
      top: -196px; /* change this value to one that suits you */
    }

    .dominik:hover:after {
      content: url('/assets/people/dominik.png');
    }

    .alex:hover:after {
      content: url('/assets/people/alex.png');
    }

    .fabian:hover:after {
      content: url('/assets/people/fabian.png');
    }
  `,
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [LowerCasePipe, RouterLink, TranslocoPipe, AppLogoWithTextComponent],
})
export class FooterComponent {
  modal = inject(NgbModal);

  logoUrl = EnvironmentHelper.getLogoUrl();

  names = a_shuffle(['Alex', 'Dominik', 'Fabian']);

  @Input()
  container = 'container-xxxl';

  openAbout(): void {
    this.modal.open(AboutModalComponent, {ariaLabelledBy: 'modal-title-about', size: 'lg'});
  }

  heart(): void {
    document.getElementById('brand')?.classList.add('spin');
  }
}
