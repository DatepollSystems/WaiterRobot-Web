import {Component, OnDestroy} from '@angular/core';
import {OrganisationsModel} from '../../_models/organisations';
import {Subscription} from 'rxjs';
import {OrganisationsService} from '../../_services/organisations.service';

@Component({
  selector: 'app-organisations',
  templateUrl: './organisations.component.html',
  styleUrls: ['./organisations.component.scss']
})
export class OrganisationsComponent implements OnDestroy {
  organisations: OrganisationsModel[];
  organisationsSubscription: Subscription;

  selectedOrganisation: OrganisationsModel|undefined;
  selectedOrganisationSubscription: Subscription;

  constructor(private organisationsService: OrganisationsService) {
    this.organisations = this.organisationsService.getAll().slice(0, 5);
    this.organisationsSubscription = this.organisationsService.allChange.subscribe((value: OrganisationsModel[]) => {
      this.organisations = value.slice(0, 5);
    });

    this.selectedOrganisation = this.organisationsService.getSelected();
    this.selectedOrganisationSubscription = this.organisationsService.selectedChange.subscribe((value: OrganisationsModel) => {
      this.selectedOrganisation = value;
    });
  }

  ngOnDestroy(): void {
    this.organisationsSubscription.unsubscribe();
    this.selectedOrganisationSubscription.unsubscribe();
  }

}
