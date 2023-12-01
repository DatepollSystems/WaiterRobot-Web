import {NgOptimizedImage} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

import {NgbModal, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

import {a_shuffle} from 'dfts-helper';
import {BiComponent, BiName, BiNamesEnum} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

import {QrCodeService} from '../../home/_shared/services/qr-code.service';
import {CopyDirective} from './copy.directive';

export type appDownload = {
  text: string;
  link: string;
  icon?: BiName;
  img?: string;
  img2?: string;
};

@Component({
  template: `
    @for (appLink of appDownloadLinks; track appLink.link) {
      <div class="btn-group m-1" role="group" aria-label="App download infos">
        <a class="btn btn-outline-info" [class.customLogo]="appLink.img" target="_blank" rel="noopener" href="{{ appLink.link }}">
          @if (appLink.icon) {
            <bi [name]="appLink.icon" />
          }
          @if (appLink.img) {
            <img ngSrc="{{ appLink.img }}" alt="" height="16em;" width="16em;" />
          }
          @if (appLink.img2) {
            <img ngSrc="{{ appLink.img2 }}" alt="" height="16em;" width="16em;" />
          }
          {{ appLink.text }}
        </a>

        @if (showQRCodeButton) {
          <button
            type="button"
            class="btn btn-outline-info"
            (click)="showQRCode(appLink)"
            placement="top"
            attr.aria-label="{{ 'ABOUT_APP_QR_CODE_TOOLTIP' | tr }}"
            ngbTooltip="{{ 'ABOUT_APP_QR_CODE_TOOLTIP' | tr }}"
          >
            <bi name="upc-scan" />
          </button>
        }

        <button
          type="button"
          class="btn btn-outline-info"
          (click)="c.copy(t)"
          aria-label="Copy app link"
          [copyable]="appLink.link"
          #c="copy"
          ngbTooltip="{{ 'COPIED' | tr }}"
          #t="ngbTooltip"
          autoClose="false"
          triggers="manual"
          placement="bottom"
        >
          <bi name="clipboard" />
        </button>
      </div>
    }
  `,
  styles: [
    `
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
  ],
  selector: 'app-download-btn-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgbTooltipModule, BiComponent, CopyDirective, NgOptimizedImage, DfxTr],
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

  @Input() showQRCodeButton = true;

  constructor(
    private modal: NgbModal,
    private qrCodeService: QrCodeService,
  ) {}

  showQRCode(appLink: appDownload): void {
    this.qrCodeService.openQRCodePage({data: appLink.link, text: 'ABOUT_APP_QR_CODE_MODAL_TITLE', info: ''});
  }
}
