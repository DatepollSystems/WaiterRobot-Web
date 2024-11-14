import { ChangeDetectionStrategy, Component, input } from '@angular/core';



import { ShareableLinkPipe, WaiterAuthLinkPipe } from '../../pipes/wr-links.pipe';


@Component({
  selector: 'app-waiter-create-qrcode-btn',
  template: `
    <app-qrcode-button
      [data]="'ml' | shareableLink | waiterAuthLink: 'CREATE' : token()"
      text="HOME_WAITERS_EVENT_CREATE_QR_CODE"
      info="HOME_WAITERS_EDIT_EVENTS_QR_CODE_DESCRIPTION"
    />
  `,
  imports: [ShareableLinkPipe, WaiterAuthLinkPipe],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BtnWaiterCreateQrCodeComponent {
  token = input.required<string>();
}
