import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../_services/auth/auth.service';
import {OrganisationsModel} from '../_models/organisations';
import {Subscription} from 'rxjs';
import {OrganisationsService} from '../_services/organisations.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy{
  organisations: OrganisationsModel[];
  organisationsSubscription: Subscription;

  selectedOrganisation: OrganisationsModel|undefined;
  selectedOrganisationSubscription;

  constructor(private authService: AuthService, private organisationsService: OrganisationsService) {
    this.organisations = this.organisationsService.getAll().slice(0, 5);
    this.organisationsSubscription = this.organisationsService.allChange.subscribe((value: OrganisationsModel[]) => {
      this.organisations = value.slice(0, 5);
    });

    this.selectedOrganisation = this.organisationsService.getSelected();
    this.selectedOrganisationSubscription = this.organisationsService.selectedChange.subscribe((value: OrganisationsModel) => {
      this.selectedOrganisation = value;
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      if (window.innerWidth < 992) {
        const navContent = document.getElementById('navbarSupportedContent');
        if (navContent != null) {
          navContent.style.display = 'none';
        }
      }
    }, 1);
  }

  ngOnDestroy() {
    this.organisationsSubscription.unsubscribe();
    this.selectedOrganisationSubscription.unsubscribe();
  }

  toggleNav(collapsable: any): void {
    if (collapsable.style.display === 'block') {
      collapsable.style.display = 'none';
    } else {
      collapsable.style.display = 'block';
    }
  }

  logout(): void {
    this.authService.logout();
  }

}
