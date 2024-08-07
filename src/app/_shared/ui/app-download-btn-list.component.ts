import {NgOptimizedImage} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';

import {QrCodeService} from '@home-shared/services/qr-code.service';

import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@jsverse/transloco';

import {a_shuffle} from 'dfts-helper';
import {BiComponent, BiName, BiNamesEnum} from 'dfx-bootstrap-icons';
import {CopyDirective} from './copy.directive';

export interface appDownload {
  text: string;
  link: string;
  icon?: BiName;
  img?: string;
  img2?: string;
}

@Component({
  template: `
    @for (appLink of appDownloadLinks; track appLink.link) {
      <div class="btn-group m-1" role="group" aria-label="App download infos">
        <a class="btn btn-outline-info" target="_blank" rel="noreferrer" [class.customLogo]="appLink.img" [href]="appLink.link">
          @if (appLink.icon) {
            <bi [name]="appLink.icon" />
          }
          @if (appLink.img) {
            <img alt="" height="16em;" width="16em;" [ngSrc]="appLink.img" />
          }
          @if (appLink.img2) {
            <img alt="" height="16em;" width="16em;" [ngSrc]="appLink.img2" />
          }
          {{ appLink.text }}
        </a>

        @if (showQRCodeButton()) {
          <button
            type="button"
            class="btn btn-outline-info"
            placement="top"
            [attr.aria-label]="'ABOUT_APP_QR_CODE_TOOLTIP' | transloco"
            [ngbTooltip]="'ABOUT_APP_QR_CODE_TOOLTIP' | transloco"
            (mousedown)="showQRCode(appLink)"
          >
            <bi name="upc-scan" />
          </button>
        }

        <button
          #c="copy"
          #t="ngbTooltip"
          type="button"
          class="btn btn-outline-info"
          aria-label="Copy app link"
          autoClose="false"
          triggers="manual"
          placement="bottom"
          [copyable]="appLink.link"
          [ngbTooltip]="'COPIED' | transloco"
          (mousedown)="c.copy(t)"
        >
          <bi name="clipboard" />
        </button>
      </div>
    }
  `,
  styles: `
    .customLogo img:last-child {
      display: none;
    }

    .customLogo:hover img:last-child {
      display: inline-block;
    }

    .customLogo:hover img:first-child {
      display: none;
    }
  `,
  selector: 'app-download-btn-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgbTooltipModule, BiComponent, CopyDirective, NgOptimizedImage, TranslocoPipe],
})
export class AppDownloadBtnListComponent {
  appDownloadLinks: appDownload[] = a_shuffle([
    // {
    //   text: 'F-Droid',
    //   link: 'https://f-droid.org',
    //   img: 'assets/store_logos/fdroidLogo.svg',
    //   img2: 'assets/store_logos/fdroidLogo_black.svg',
    // },
    // {
    //   text: 'AppGallery',
    //   link: 'https://appgallery.huawei.com',
    //   img: 'assets/store_logos/appGallery.svg',
    //   img2: 'assets/store_logos/appGallery_black.svg',
    // },
    {
      text: 'App Store',
      link: 'https://apps.apple.com/at/app/waiterrobot/id1610157234',
      icon: BiNamesEnum.apple,
    },
    {
      text: 'Play Store',
      link: 'https://play.google.com/store/apps/details?id=org.datepollsystems.waiterrobot.android',
      icon: BiNamesEnum.google,
    },
  ]);

  showQRCodeButton = input(true);

  #qrCodeService = inject(QrCodeService);

  showQRCode(appLink: appDownload): void {
    this.#qrCodeService.openQRCodePage({data: appLink.link, text: 'ABOUT_APP_QR_CODE_MODAL_TITLE', info: ''});
  }
}
