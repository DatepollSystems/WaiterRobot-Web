import {Component, Input, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {LoggerFactory} from 'dfx-helper';

import {OrganisationsService} from '../../_services/organisations.service';
import {EventsService} from '../../_services/events.service';
import {OrganisationModel} from '../../_models/organisation.model';
import {EventModel} from '../../_models/event.model';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {IsMobileService} from '../../_helper/is-mobile.service';
import {WaiterModel} from '../../_models/waiter.model';

@Component({
  selector: 'app-waiters',
  templateUrl: './waiters.component.html',
  styleUrls: ['./waiters.component.scss']
})
export class WaitersComponent implements OnDestroy {
  selectedEventToShow = 'default';

  selectedOrganisation: OrganisationModel | undefined;
  selectedOrganisationSubscription: Subscription;

  selectedEvent: EventModel | undefined;
  selectedEventSubscription: Subscription;

  allEvents: EventModel[];
  allEventsSubscription: Subscription;

  private log = LoggerFactory.getLogger('WaitersComponent');

  constructor(private organisationService: OrganisationsService, private eventsService: EventsService, private router: Router) {
    this.selectedOrganisation = this.organisationService.getSelected();
    this.selectedOrganisationSubscription = this.organisationService.selectedChange.subscribe(value => {
      this.selectedOrganisation = value;
    });

    this.selectedEvent = this.eventsService.getSelected();
    this.selectedEventSubscription = this.eventsService.selectedChange.subscribe(value => {
      this.selectedEvent = value;
    });

    this.allEvents = this.eventsService.getAll();
    this.allEventsSubscription = this.eventsService.allChange.subscribe(value => {
      this.allEvents = value;
    })
  }

  ngOnDestroy(): void {
    this.selectedOrganisationSubscription.unsubscribe();
    this.selectedEventSubscription.unsubscribe();
    this.allEventsSubscription.unsubscribe();
  }

  showEvent(value: any) {
    this.log.info('showEvent', 'Showing event "' + value + '"');
    this.router.navigateByUrl(value).then();
  }
}

@Component({
  selector: 'ngbd-qrcode-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-qrcode-title">{{'HOME_WAITERS_SHOW_QR_CODE' | tr}} "{{waiter?.name}}"</h4>
      <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body" fxLayout="row" fxLayoutAlign="center">
      <qr-code value="{{waiter?.token}}"
               size="{{isMobile? '340' : '700'}}"
               errorCorrectionLevel="H"
               centerImageSrc="./assets/logo.png"
               centerImageSize="{{isMobile? '70' : '120'}}">
      </qr-code>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close()">{{'CLOSE' | tr}}</button>
    </div>
  `
})
export class QRCodeModal {
  @Input() waiter: WaiterModel | undefined;
  isMobile = false;

  constructor(public activeModal: NgbActiveModal, private isMobileService: IsMobileService) {
    this.isMobile = this.isMobileService.getIsMobile();
  }
}
