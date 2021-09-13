import {Component, OnDestroy} from '@angular/core';
import {OrganisationModel} from '../../_models/organisation.model';
import {Subscription} from 'rxjs';
import {OrganisationsService} from '../../_services/organisations.service';
import {UserModel} from '../../_models/user.model';
import {MyUserService} from '../../_services/myUser.service';

@Component({
  selector: 'app-organisations',
  templateUrl: './organisations.component.html',
  styleUrls: ['./organisations.component.scss']
})
export class OrganisationsComponent implements OnDestroy {
  myUser: UserModel|null = null;
  myUserSubscription: Subscription;

  organisations: OrganisationModel[];
  organisationsSubscription: Subscription;
  maxOrgsCount = 5;

  selectedOrganisation: OrganisationModel|undefined;
  selectedOrganisationSubscription: Subscription;

  constructor(private myUserService: MyUserService, private organisationsService: OrganisationsService) {
    this.myUser = this.myUserService.getUser();
    this.myUserSubscription = this.myUserService.userChange.subscribe(user => {
      this.myUser = user;
    });

    this.organisations = this.organisationsService.getAll();
    this.organisationsSubscription = this.organisationsService.allChange.subscribe((value: OrganisationModel[]) => {
      this.organisations = value;
    });

    this.selectedOrganisation = this.organisationsService.getSelected();
    this.selectedOrganisationSubscription = this.organisationsService.selectedChange.subscribe(value => {
      this.selectedOrganisation = value;
    });
  }

  ngOnDestroy(): void {
    this.myUserSubscription.unsubscribe();
    this.organisationsSubscription.unsubscribe();
    this.selectedOrganisationSubscription.unsubscribe();
  }

}
