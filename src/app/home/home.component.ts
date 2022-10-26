import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {AComponent, Converter, IsMobileService, loggerOf} from 'dfx-helper';

import {EnvironmentHelper} from '../_shared/EnvironmentHelper';
import {EventModel} from './events/_models/event.model';

import {OrganisationModel} from './organisations/_models/organisation.model';
import {MyUserModel} from '../_shared/services/auth/user/my-user.model';

import {AuthService} from '../_shared/services/auth/auth.service';
import {MyUserService} from '../_shared/services/auth/user/my-user.service';
import {EventsService} from './events/_services/events.service';
import {OrganisationsService} from './organisations/_services/organisations.service';
import {NavItem} from '../_shared/ui/navbar-scrollable/app-navbar-scrollable.component';
import {UserEmailQRCodeModalComponent} from './user-email-qr-code-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent extends AComponent implements OnInit {
  environmentType = 'prod';
  showEnvironmentType = true;
  lumber = loggerOf('HomeComponent');

  adminModeChanged = false;
  myUser?: MyUserModel;
  selectedOrganisation?: OrganisationModel;
  allOrgs: OrganisationModel[] = [];
  selectedEvent?: EventModel;
  allEvents: EventModel[] = [];

  isMobile = false;

  navItems!: NavItem[];

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

    this.isMobile = this.isMobileService.isMobile;
    this.myUser = this.myUserService.getUser();
    this.selectedOrganisation = this.organisationsService.getSelected();
    this.allOrgs = this.organisationsService.getAll().slice(0, 5);

    this.unsubscribe(
      this.isMobileService.isMobileChange.subscribe((value) => (this.isMobile = value)),
      this.myUserService.userChange.subscribe((user) => {
        this.myUser = user;
        if (this.myUser.isAdmin) {
          this.lumber.info('const', 'Admin status detected');
        }
        this.setNavItems();
      }),
      this.organisationsService.selectedChange.subscribe((value) => {
        this.selectedOrganisation = value;
        this.onEventInit();
        this.setNavItems();
      }),
      this.organisationsService.allChange.subscribe((it) => (this.allOrgs = it.slice(0, 5)))
    );

    this.onEventInit();

    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.toggleNav('CLOSE');
      }
    });

    this.setNavItems();
  }

  onEventInit(): void {
    if (this.selectedOrganisation != null) {
      this.allEvents = this.eventsService.getAll().slice(0, 5);
      this.unsubscribe(
        this.eventsService.allChange.subscribe((events) => {
          this.allEvents = events.slice(0, 5);
        })
      );

      this.selectedEvent = this.eventsService.getSelected();
      this.unsubscribe(
        this.eventsService.selectedChange.subscribe((event) => {
          this.selectedEvent = event;
          this.setNavItems();
        })
      );
    } else {
      this.allEvents = [];
      this.selectedEvent = undefined;
    }
  }

  ngOnInit(): void {
    this.clearTimeout(
      window.setTimeout(() => {
        if (window.innerWidth < 992) {
          const navContent = document.getElementById('navbarSupportedContent');
          if (navContent != null) {
            navContent.style.display = 'none';
          }
        }
      }, 1)
    );
  }

  setNavItems(): void {
    this.navItems = [
      {text: 'NAV_TABLES', routerLink: 'tables', show: !!this.selectedEvent},
      {text: 'NAV_PRODUCTS', routerLink: 'products', show: !!this.selectedEvent},
      {text: 'NAV_PRINTERS', routerLink: 'printers', show: !!this.myUser?.isAdmin},
      {text: 'NAV_WAITERS', routerLink: 'waiters', show: true},
      {text: 'NAV_ORDERS', routerLink: 'orders', show: !!this.selectedEvent},
      {text: 'NAV_STATISTICS', routerLink: 'statistics', show: !!this.selectedEvent},
    ];
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
