import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';

import {AuthService} from '../_services/auth/auth.service';
import {OrganisationsService} from '../_services/organisations.service';
import {EventsService} from '../_services/events.service';
import {MyUserService} from '../_services/myUser.service';

import {OrganisationModel} from '../_models/organisation.model';
import {EventModel} from '../_models/event.model';
import {UserModel} from '../_models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  adminModeChanged = false;
  myUser: UserModel|null = null;
  myUserSubscription: Subscription;

  selectedOrganisation: OrganisationModel | null;
  selectedOrganisationSubscription;

  selectedEvent!: EventModel | null;
  selectedEventSubscription!: Subscription;

  allEvents: EventModel[] = [];
  allEventsSubscription!: Subscription;

  constructor(private authService: AuthService,
              private myUserService: MyUserService,
              private organisationsService: OrganisationsService,
              private eventsService: EventsService) {
    this.myUser = this.myUserService.getUser();
    this.myUserSubscription = this.myUserService.userChange.subscribe(user => {
      this.myUser = user;
    });

    this.selectedOrganisation = this.organisationsService.getSelected();
    this.selectedOrganisationSubscription = this.organisationsService.selectedChange.subscribe(value => {
      this.selectedOrganisation = value;
      this.onEventInit();
    });

    this.onEventInit();
  }

  onEventInit(): void {
    if (this.selectedOrganisation != null) {
      this.allEvents = this.eventsService.getAll();
      this.allEventsSubscription = this.eventsService.allChange.subscribe(value => {
        this.allEvents = value;
      });

      this.selectedEvent = this.eventsService.getSelected();
      this.selectedEventSubscription = this.eventsService.selectedChange.subscribe((value: EventModel | null) => {
        this.selectedEvent = value;
      });
    } else {
      this.allEvents = [];
      this.selectedEvent = null;
    }
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
    this.myUserSubscription.unsubscribe();
    this.selectedOrganisationSubscription.unsubscribe();
    this.allEventsSubscription?.unsubscribe();
    this.selectedEventSubscription?.unsubscribe();
  }

  toggleNav(collapsable: any): void {
    if (collapsable.style.display === 'block') {
      collapsable.style.display = 'none';
    } else {
      collapsable.style.display = 'block';
    }
  }

  switchAdminMode() {
    if (this.myUser) {
      this.adminModeChanged = !this.adminModeChanged;
      this.myUser.is_admin = !this.myUser.is_admin;
      this.myUserService.setUser(this.myUser);
    }
  }

  logout(): void {
    this.authService.logout();
  }

  onSelectEvent(event: EventModel) {
    this.eventsService.setSelected(event);
  }
}
