// import {NgIf} from '@angular/common';
// import {Component, inject} from '@angular/core';
// import {FormsModule} from '@angular/forms';
// import {NgbInputDatepicker, NgbNav, NgbNavContent, NgbNavItem, NgbNavLink, NgbNavOutlet} from '@ng-bootstrap/ng-bootstrap';
// import {d_format} from 'dfts-helper';
// import {NgSub} from 'dfx-helper';
// import {DfxTr} from 'dfx-translate';
// import {MyUserService} from '../../../_shared/services/auth/user/my-user.service';
//
// import {AbstractModelEditComponent} from '../../../_shared/ui/form/abstract-model-edit.component';
// import {AppBtnModelEditConfirmComponent} from '../../../_shared/ui/form/app-btn-model-edit-confirm.component';
// import {AppBtnToolbarComponent} from '../../../_shared/ui/app-btn-toolbar.component';
// import {AppSelectableButtonComponent} from '../../../_shared/ui/app-selectable-button.component';
// import {AppSpinnerRowComponent} from '../../../_shared/ui/loading/app-spinner-row.component';
// import {AppIconsModule} from '../../../_shared/ui/icons.module';
// import {OrganisationsService} from '../../organisations/_services/organisations.service';
// import {BtnWaiterCreateQrCodeComponent} from '../../../_shared/ui/btn-waiter-create-qr-code.component';
//
// import {EventModel} from '../_models/event.model';
//
// import {EventsService} from '../_services/events.service';
//
// @Component({
//   selector: 'app-event-edit',
//   templateUrl: './event-edit.component.html',
//   standalone: true,
//   imports: [
//     FormsModule,
//     NgSub,
//     NgIf,
//     NgbNav,
//     NgbNavLink,
//     NgbNavItem,
//     NgbNavContent,
//     NgbInputDatepicker,
//     NgbNavOutlet,
//     DfxTr,
//     AppSpinnerRowComponent,
//     BtnWaiterCreateQrCodeComponent,
//     AppBtnToolbarComponent,
//     AppBtnModelEditConfirmComponent,
//     AppIconsModule,
//     AppSelectableButtonComponent,
//   ],
// })
// export class EventEditComponent extends AbstractModelEditComponent<EventModel> {
//   override redirectUrl = '/home/events/all';
//
//   myUser$ = inject(MyUserService).getUser$();
//   selectedEvent$ = this.eventsService.getSelected$;
//
//   constructor(public eventsService: EventsService, private organisationsService: OrganisationsService) {
//     super(eventsService);
//   }
//
//   override addCustomAttributesBeforeCreateAndUpdate(model: any): any {
//     model.organisationId = this.organisationsService.getSelected()?.id;
//     if (model.updateWaiterCreateToken?.length === 0) {
//       model.updateWaiterCreateToken = false;
//     }
//     model.date = d_format(model.date as Date | null);
//
//     return super.addCustomAttributesBeforeCreateAndUpdate(model);
//   }
// }
