import {NgOptimizedImage} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';

import {TranslocoPipe} from '@jsverse/transloco';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {a_shuffle} from 'dfts-helper';
import {BiComponent, BiName, BiNamesEnum} from 'dfx-bootstrap-icons';

import {QrCodeService} from '@home-shared/services/qr-code.service';

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
        <a class="btn btn-outline-info" [class.customLogo]="appLink.img" [href]="appLink.link" target="_blank" rel="noreferrer">
          @if (appLink.icon) {
            <bi [name]="appLink.icon" />
          }
          @if (appLink.img) {
            <img [ngSrc]="appLink.img" alt="" height="16em;" width="16em;" />
          }
          @if (appLink.img2) {
            <img [ngSrc]="appLink.img2" alt="" height="16em;" width="16em;" />
          }
          {{ appLink.text }}
        </a>

        @if (showQRCodeButton()) {
          <button
            class="btn btn-outline-info"
            [attr.aria-label]="'ABOUT_APP_QR_CODE_TOOLTIP' | transloco"
            [ngbTooltip]="'ABOUT_APP_QR_CODE_TOOLTIP' | transloco"
            (mousedown)="showQRCode(appLink)"
            type="button"
            placement="top"
          >
            <bi name="upc-scan" />
          </button>
        }

        <button
          class="btn btn-outline-info"
          #c="copy"
          #t="ngbTooltip"
          [copyable]="appLink.link"
          [ngbTooltip]="'COPIED' | transloco"
          (mousedown)="c.copy(t)"
          type="button"
          aria-label="Copy app link"
          autoClose="false"
          triggers="manual"
          placement="bottom"
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
    this.#qrCodeService.openQRCodePage({
      data: appLink.link,
      text: 'ABOUT_APP_QR_CODE_MODAL_TITLE',
      info: '',
    });
  }
}
