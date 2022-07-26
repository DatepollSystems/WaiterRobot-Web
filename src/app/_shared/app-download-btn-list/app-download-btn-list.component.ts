import {Component, Input} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ClipboardHelper, IList, List} from 'dfx-helper';

import {IconName, IconNamesEnum} from 'ngx-bootstrap-icons';
import {AppDownloadQrCodeModalComponent} from './app-download-qr-code-modal.component';

export type appDownload = {
  text: string;
  link: string;
  icon?: IconName;
  img?: string;
  img2?: string;
};

@Component({
  selector: 'app-download-btn-list',
  templateUrl: './app-download-btn-list.component.html',
  styleUrls: ['./app-download-btn-list.component.scss'],
})
export class AppDownloadBtnListComponent {
  appDownloadLinks: IList<appDownload> = new List([
    {
      text: 'F-Droid',
      link: 'https://f-droid.org',
      img: 'assets/store_logos/fdroidLogo.svg',
      img2: 'assets/store_logos/fdroidLogo_black.svg',
    },
    {
      text: 'App Store',
      link: 'https://store.apple.com',
      icon: IconNamesEnum.Apple,
    },
    {
      text: 'AppGallery',
      link: 'https://appgallery.huawei.com',
      img: 'assets/store_logos/appGallery.svg',
      img2: 'assets/store_logos/appGallery_black.svg',
    },
    {
      text: 'Play Store',
      link: 'https://play.google.com',
      icon: IconNamesEnum.Google,
    },
  ]).shuffle();

  @Input() showQRCodeButton = true;

  constructor(private modal: NgbModal) {}

  showQRCode(appLink: appDownload): void {
    const modalRef = this.modal.open(AppDownloadQrCodeModalComponent, {
      ariaLabelledBy: 'app-download-modal-title',
      size: 'lg',
    });
    modalRef.componentInstance.appLink = appLink;
  }

  copyStoreLink(link: string): void {
    ClipboardHelper.copy(link);
  }
}
