import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {NgbModal, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {a_shuffle} from 'dfts-helper';
import {DfxTrackByModule} from 'dfx-helper';
import {DfxTranslateModule} from 'dfx-translate';

import {IconName, IconNamesEnum} from 'ngx-bootstrap-icons';
import {QrCodeService} from '../services/qr-code.service';
import {CopyDirective} from './copy.directive';
import {AppIconsModule} from './icons.module';

export type appDownload = {
  text: string;
  link: string;
  icon?: IconName;
  img?: string;
  img2?: string;
};

@Component({
  template: `
    <div
      *ngFor="let appLink of appDownloadLinks; trackByProperty: 'text'"
      class="btn-group m-1"
      role="group"
      aria-label="App download infos"
    >
      <a class="btn btn-outline-info" [class.customLogo]="appLink.img" target="_blank" rel="noopener" href="{{ appLink.link }}">
        <i-bs *ngIf="appLink.icon" [name]="appLink.icon" />
        <img *ngIf="appLink.img" ngSrc="{{ appLink.img }}" alt="" height="16em;" width="16em;" />
        <img *ngIf="appLink.img2" ngSrc="{{ appLink.img2 }}" alt="" height="16em;" width="16em;" />
        {{ appLink.text }}
      </a>

      <button
        type="button"
        class="btn btn-outline-info"
        (click)="showQRCode(appLink)"
        *ngIf="showQRCodeButton"
        placement="top"
        attr.aria-label="{{ 'ABOUT_APP_QR_CODE_TOOLTIP' | tr }}"
        ngbTooltip="{{ 'ABOUT_APP_QR_CODE_TOOLTIP' | tr }}"
      >
        <i-bs name="upc-scan" />
      </button>

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
        <i-bs name="clipboard" />
      </button>
    </div>
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
  imports: [NgIf, NgForOf, NgbTooltipModule, DfxTranslateModule, DfxTrackByModule, AppIconsModule, CopyDirective, NgOptimizedImage],
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
      icon: IconNamesEnum.Apple,
    },
    {
      text: 'Play Store',
      link: 'https://play.google.com/store/apps/details?id=org.datepollsystems.waiterrobot.android',
      icon: IconNamesEnum.Google,
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
