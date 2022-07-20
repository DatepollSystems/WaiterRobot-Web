import {Component} from '@angular/core';
import {OrganisationModel} from '../../_models/organisation/organisation.model';
import {EventModel} from '../../_models/event.model';
import {OrganisationsService} from '../../_services/models/organisation/organisations.service';
import {EventsService} from '../../_services/models/events.service';
import {Router} from '@angular/router';
import {AComponent} from 'dfx-helper';
import {AbstractModelsComponent} from '../../_helper/abstract-models.component';

@Component({
  selector: 'app-printers',
  templateUrl: './printers.component.html',
  styleUrls: ['./printers.component.scss'],
})
export class PrintersComponent extends AbstractModelsComponent<EventModel> {
  selectedOrganisation: OrganisationModel | undefined;
  selectedEvent: EventModel | undefined;

  constructor(private organisationService: OrganisationsService, eventsService: EventsService, router: Router) {
    super(router, eventsService);

    this.selectedOrganisation = this.organisationService.getSelected();
    this.autoUnsubscribe(
      this.organisationService.selectedChange.subscribe((organisation) => {
        this.selectedOrganisation = organisation;
      })
    );

    this.selectedEvent = eventsService.getSelected();
    this.autoUnsubscribe(
      eventsService.selectedChange.subscribe((event) => {
        this.selectedEvent = event;
      })
    );
  }
}
