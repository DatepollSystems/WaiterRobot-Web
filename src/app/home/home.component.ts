import {Component, OnInit} from '@angular/core';

import {AuthService} from '../_services/auth/auth.service';
import {OrganisationsService} from '../_services/organisations.service';
import {EventsService} from '../_services/events.service';
import {MyUserService} from '../_services/my-user.service';

import {AbstractComponent, Converter, LoggerFactory} from 'dfx-helper';
import {EnvironmentHelper} from '../_helper/EnvironmentHelper';

import {OrganisationModel} from '../_models/organisation.model';
import {EventModel} from '../_models/event.model';
import {UserModel} from '../_models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent extends AbstractComponent implements OnInit {
  environmentType = 'prod';
  lumber = LoggerFactory.getLogger('HomeComponent');

  adminModeChanged = false;
  myUser: UserModel | undefined;
  selectedOrganisation: OrganisationModel | undefined;
  selectedEvent: EventModel | undefined;
  allEvents: EventModel[] = [];

  constructor(
    private authService: AuthService,
    private myUserService: MyUserService,
    private organisationsService: OrganisationsService,
    private eventsService: EventsService
  ) {
    super();

    this.environmentType = EnvironmentHelper.getType();

    this.myUser = this.myUserService.getUser();
    this.autoUnsubscribe(
      this.myUserService.userChange.subscribe((user) => {
        this.myUser = user;
        if (this.myUser.is_admin) {
          this.lumber.info('const', 'Admin status detected');
        }
      })
    );

    this.selectedOrganisation = this.organisationsService.getSelected();
    this.autoUnsubscribe(
      this.organisationsService.selectedChange.subscribe((value) => {
        this.selectedOrganisation = value;
        this.onEventInit();
      })
    );

    this.onEventInit();
  }

  onEventInit(): void {
    if (this.selectedOrganisation != null) {
      this.allEvents = this.eventsService.getAll();
      this.autoUnsubscribe(
        this.eventsService.allChange.subscribe((events) => {
          this.allEvents = events;
        })
      );

      this.selectedEvent = this.eventsService.getSelected();
      this.autoUnsubscribe(
        this.eventsService.selectedChange.subscribe((event) => {
          this.selectedEvent = event;
        })
      );
    } else {
      this.allEvents = [];
      this.selectedEvent = undefined;
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
      this.lumber.info('switchAdminMode', 'Admin mode switched to ' + Converter.booleanToString(this.myUser.is_admin));
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
