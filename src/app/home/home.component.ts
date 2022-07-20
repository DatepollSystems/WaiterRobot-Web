import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';

import {AuthService} from '../_services/auth/auth.service';
import {OrganisationsService} from '../_services/models/organisation/organisations.service';
import {EventsService} from '../_services/models/events.service';
import {MyUserService} from '../_services/auth/my-user.service';

import {AComponent, Converter, IsMobileService, LoggerFactory} from 'dfx-helper';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {EnvironmentHelper} from '../_helper/EnvironmentHelper';
import {UserEmailQRCodeModalComponent} from './user-email-qr-code-modal.component';

import {OrganisationModel} from '../_models/organisation/organisation.model';
import {EventModel} from '../_models/event.model';
import {MyUserModel} from '../_models/user/my-user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent extends AComponent implements OnInit {
  environmentType = 'prod';
  showEnvironmentType = true;
  lumber = LoggerFactory.getLogger('HomeComponent');

  adminModeChanged = false;
  myUser?: MyUserModel;
  selectedOrganisation?: OrganisationModel;
  allOrgs: OrganisationModel[] = [];
  selectedEvent?: EventModel;
  allEvents: EventModel[] = [];

  isMobile = false;

  constructor(
    router: Router,
    private modal: NgbModal,
    private authService: AuthService,
    private myUserService: MyUserService,
    private organisationsService: OrganisationsService,
    private eventsService: EventsService,
    private isMobileService: IsMobileService
  ) {
    super();

    this.environmentType = EnvironmentHelper.getType();

    this.isMobile = this.isMobileService.getIsMobile();
    this.autoUnsubscribe(
      this.isMobileService.isMobileChange.subscribe((value) => {
        this.isMobile = value;
      })
    );

    this.myUser = this.myUserService.getUser();
    this.autoUnsubscribe(
      this.myUserService.userChange.subscribe((user) => {
        this.myUser = user;
        if (this.myUser.isAdmin) {
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

    this.allOrgs = this.organisationsService.getAll().slice(0, 5);
    this.autoUnsubscribe(
      this.organisationsService.allChange.subscribe((orgs) => {
        this.allOrgs = orgs.slice(0, 5);
      })
    );

    this.onEventInit();

    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.toggleNav('CLOSE');
      }
    });
  }

  onEventInit(): void {
    if (this.selectedOrganisation != null) {
      this.allEvents = this.eventsService.getAll().slice(0, 5);
      this.autoUnsubscribe(
        this.eventsService.allChange.subscribe((events) => {
          this.allEvents = events.slice(0, 5);
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

  toggleNav(status: 'OPEN' | 'CLOSE' | undefined = undefined): void {
    const collapsable = document.getElementById('navbarSupportedContent');
    if (!collapsable) {
      return;
    }
    if (collapsable.style.display === 'block' || status === 'CLOSE') {
      collapsable.style.display = 'none';
    } else {
      collapsable.style.display = 'block';
    }
  }

  switchAdminMode(): void {
    if (this.myUser) {
      this.adminModeChanged = !this.adminModeChanged;
      this.myUser.isAdmin = !this.myUser.isAdmin;
      this.lumber.info('switchAdminMode', 'Admin mode switched to ' + Converter.toString(this.myUser.isAdmin));
      this.myUserService.setUser(this.myUser);
    }
  }

  logout(): void {
    this.authService.logout();
  }

  onSelectEvent(event: EventModel): void {
    this.eventsService.setSelected(event);
  }

  onSelectOrg(org: OrganisationModel): void {
    this.organisationsService.setSelected(org);
    this.eventsService.setSelected(undefined);
  }

  openUserEmailQRCode(user?: MyUserModel): void {
    if (!user) {
      return;
    }
    const modalRef = this.modal.open(UserEmailQRCodeModalComponent, {
      ariaLabelledBy: 'modal-user-email-qrcode-title',
      size: 'lg',
    });

    modalRef.componentInstance.name = user.name;
    modalRef.componentInstance.token = user.emailAddress;
  }
}
