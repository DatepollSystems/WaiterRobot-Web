import {Component, OnDestroy} from '@angular/core';
import {OrganisationModel} from '../../_models/organisation.model';
import {Subscription} from 'rxjs';
import {OrganisationsService} from '../../_services/organisations.service';

@Component({
  selector: 'app-organisations',
  templateUrl: './organisations.component.html',
  styleUrls: ['./organisations.component.scss']
})
export class OrganisationsComponent implements OnDestroy {
  organisations: OrganisationModel[];
  organisationsSubscription: Subscription;

  selectedOrganisation: OrganisationModel|null;
  selectedOrganisationSubscription: Subscription;

  constructor(private organisationsService: OrganisationsService) {
    this.organisations = this.organisationsService.getAll().slice(0, 5);
    this.organisationsSubscription = this.organisationsService.allChange.subscribe((value: OrganisationModel[]) => {
      this.organisations = value.slice(0, 5);
    });

    this.selectedOrganisation = this.organisationsService.getSelected();
    this.selectedOrganisationSubscription = this.organisationsService.selectedChange.subscribe((value: OrganisationModel|null) => {
      this.selectedOrganisation = value;
    });
  }

  ngOnDestroy(): void {
    this.organisationsSubscription.unsubscribe();
    this.selectedOrganisationSubscription.unsubscribe();
  }

}
