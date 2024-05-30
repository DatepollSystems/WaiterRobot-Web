import {NgOptimizedImage} from '@angular/common';
import {Component, computed, inject} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {MyUserService} from '@home-shared/services/user/my-user.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@ngneat/transloco';
import {EnvironmentHelper} from '@shared/EnvironmentHelper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxCutPipe} from 'dfx-helper';
import {SelectedEventService} from '../../events/_services/selected-event.service';
import {SelectedOrganisationService} from '../../organisations/_services/selected-organisation.service';
import {s_toColor} from './colors';
import {ProfileMenuComponent} from './profile-menu.component';
import {SwitcherModalComponent} from './switcher.component';

@Component({
  template: `
    <div class="d-flex align-items-center gap-2 pb-3 mb-3 border-bottom">
      <a routerLink="/" class="link-body-emphasis text-decoration-none">
        <img id="brand" width="30" height="30" priority="true" class="align-self-center ms-2" alt="kellner.team logo" [ngSrc]="logoUrl" />
      </a>
      <div class="fs-3 ms-3">/</div>
      <button
        type="button"
        class="btn switcher d-flex flex-lg-grow-1 gap-4 justify-content-between align-items-center"
        style="border-width: 1px"
        [style.border-color]="selectedColor() ?? ''"
        (mousedown)="openSwitcher()"
      >
        <div class="d-flex flex-column align-items-start" style="font-size: 0.875rem">
          @if (selectedOrganisation(); as organisation) {
            <span class="ws-nowrap">{{ organisation.name | s_cut: 14 : '..' }}</span>
            @if (selectedEvent(); as event) {
              <span class="ws-nowrap">{{ event.name | s_cut: 14 : '..' }}</span>
            }
          } @else {
            <span>Organisation auswählen</span>
          }
        </div>
        <bi name="chevron-expand" />
      </button>
    </div>
    <ul class="list-unstyled flex-column ps-0 mb-auto">
      <li class="mb-1">
        <a
          class="nav-heading d-inline-block rounded"
          routerLinkActive="active"
          [routerLink]="'/o/' + selectedOrganisationIdRoute() + '/e/' + selectedEventIdRoute() + '/tables'"
        >
          <div class="d-inline-flex align-items-center gap-2 ">
            <bi name="columns-gap" />
            {{ 'HOME_TABLES' | transloco }}
          </div>
        </a>
        <ul class="nav-sub list-unstyled fw-normal pb-1 small">
          <li>
            <a
              routerLinkActive="active"
              class="d-inline-block rounded"
              [routerLink]="'/o/' + selectedOrganisationIdRoute() + '/e/' + selectedEventIdRoute() + '/table-groups'"
              >{{ 'HOME_TABLE_GROUPS' | transloco }}</a
            >
          </li>
        </ul>
      </li>
      <li class="mb-1">
        <a
          class="nav-heading d-inline-block rounded"
          routerLinkActive="active"
          [routerLink]="'/o/' + selectedOrganisationIdRoute() + '/e/' + selectedEventIdRoute() + '/products'"
        >
          <div class="d-inline-flex align-items-center gap-2 ">
            <bi name="cup-straw" />
            {{ 'HOME_PROD_ALL' | transloco }}
          </div>
        </a>
        <ul class="nav-sub list-unstyled fw-normal pb-1 small">
          <li>
            <a
              routerLinkActive="active"
              class="d-inline-block rounded"
              [routerLink]="'/o/' + selectedOrganisationIdRoute() + '/e/' + selectedEventIdRoute() + '/product-groups'"
              >{{ 'HOME_PROD_GROUPS' | transloco }}</a
            >
          </li>
        </ul>
      </li>
      <li class="mb-1">
        <a
          class="nav-heading d-inline-block rounded"
          routerLinkActive="active"
          [routerLink]="'/o/' + selectedOrganisationIdRoute() + '/e/' + selectedEventIdRoute() + '/waiters'"
        >
          <div class="d-inline-flex align-items-center gap-2 ">
            <bi name="people" />
            {{ 'NAV_WAITERS' | transloco }}
          </div>
        </a>
        <ul class="nav-sub list-unstyled fw-normal pb-1 small">
          <li>
            <a
              routerLinkActive="active"
              class="d-inline-block rounded"
              [routerLink]="'/o/' + selectedOrganisationIdRoute() + '/e/' + selectedEventIdRoute() + '/waiter-duplicates'"
              >Duplikate</a
            >
          </li>
        </ul>
      </li>
      <li class="mb-1">
        <a
          class="nav-heading d-inline-block rounded"
          routerLinkActive="active"
          [routerLink]="'/o/' + selectedOrganisationIdRoute() + '/e/' + selectedEventIdRoute() + '/printers/all'"
        >
          <div class="d-inline-flex align-items-center gap-2 ">
            <bi name="printer" />
            {{ 'NAV_PRINTERS' | transloco }}
          </div>
        </a>
        <ul class="nav-sub list-unstyled fw-normal pb-1 small">
          <li>
            <a
              routerLinkActive="active"
              class="d-inline-block rounded"
              [routerLink]="'/o/' + selectedOrganisationIdRoute() + '/e/' + selectedEventIdRoute() + '/printers/mediators/all'"
              >Mediators</a
            >
          </li>
        </ul>
      </li>
      <li class="mb-1">
        <a
          class="nav-heading d-inline-block rounded"
          routerLinkActive="active"
          [routerLink]="'/o/' + selectedOrganisationIdRoute() + '/e/' + selectedEventIdRoute() + '/orders/all'"
        >
          <div class="d-inline-flex align-items-center gap-2 ">
            <bi name="list-check" />
            {{ 'NAV_ORDERS' | transloco }}
          </div>
        </a>
      </li>
      <li class="mb-1">
        <a
          class="nav-heading d-inline-block rounded"
          routerLinkActive="active"
          [routerLink]="'/o/' + selectedOrganisationIdRoute() + '/e/' + selectedEventIdRoute() + '/bills/all'"
        >
          <div class="d-inline-flex align-items-center gap-2 ">
            <bi name="cash-coin" />
            {{ 'NAV_BILLS' | transloco }}
          </div>
        </a>
        <ul class="nav-sub list-unstyled fw-normal pb-1 small">
          <li>
            <a
              routerLinkActive="active"
              class="d-inline-block rounded"
              [routerLink]="'/o/' + selectedOrganisationIdRoute() + '/e/' + selectedEventIdRoute() + '/bills/reasons/all'"
              >{{ 'HOME_BILL_UNPAID_REASON' | transloco }}</a
            >
          </li>
        </ul>
      </li>
      <li class="mb-1">
        <a
          class="nav-heading d-inline-block rounded"
          routerLinkActive="active"
          [routerLink]="'/o/' + selectedOrganisationIdRoute() + '/e/' + selectedEventIdRoute() + '/statistics'"
        >
          <div class="d-inline-flex align-items-center gap-2 ">
            <bi name="graph-up" />
            {{ 'NAV_STATISTICS' | transloco }}
          </div>
        </a>
      </li>
      <li class="mb-1">
        <a
          class="nav-heading d-inline-block rounded"
          routerLinkActive="active"
          [routerLink]="'/o/' + selectedOrganisationIdRoute() + '/settings'"
        >
          <div class="d-inline-flex align-items-center gap-2 ">
            <bi name="gear" />
            {{ 'SETTINGS' | transloco }}
          </div>
        </a>
      </li>
    </ul>

    @if (myUser(); as user) {
      @if (user.isAdmin) {
        <hr />
        <ul class="list-unstyled flex-column ps-0">
          <li class="mb-1">
            <a class="nav-heading d-inline-block rounded" routerLinkActive="active" routerLink="/organisations">
              <div class="d-inline-flex align-items-center gap-2 ">
                <bi name="buildings" />
                {{ 'NAV_ORGANISATIONS' | transloco }}
              </div>
            </a>
          </li>
          <li class="mb-1">
            <a
              class="nav-heading d-inline-block rounded"
              routerLinkActive="active"
              [routerLink]="'/events/' + selectedOrganisationIdRoute()"
            >
              <div class="d-inline-flex align-items-center gap-2 ">
                <bi name="building" />
                {{ 'NAV_EVENTS' | transloco }}
              </div>
            </a>
          </li>

          <li class="mb-1">
            <a class="nav-heading d-inline-block rounded" routerLinkActive="active" routerLink="/users">
              <div class="d-inline-flex align-items-center gap-2 ">
                <bi name="person-badge" />
                {{ 'NAV_USERS' | transloco }}
              </div>
            </a>
          </li>

          <li class="mb-1">
            <a class="nav-heading d-inline-block rounded" routerLinkActive="active" routerLink="/system-notifications">
              <div class="d-inline-flex align-items-center gap-2 ">
                <bi name="bell" />
                {{ 'NAV_SYSTEM_NOTIFICATIONS' | transloco }}
              </div>
            </a>
          </li>
          <li class="mb-1">
            <a class="nav-heading d-inline-block rounded" routerLinkActive="active" routerLink="/dead-letters">
              <div class="d-inline-flex align-items-center gap-2 ">
                <bi name="braces" />
                {{ 'NAV_DEAD_LETTERS' | transloco }}
              </div>
            </a>
          </li>
          <li class="mb-1">
            <a class="nav-heading d-inline-block rounded" routerLinkActive="active" routerLink="/tmp-notifications">
              <div class="d-inline-flex align-items-center gap-2 ">
                <bi name="braces" />
                {{ 'NAV_TMP_NOTIFICATIONS' | transloco }}
              </div>
            </a>
          </li>
        </ul>
      }
    }

    <hr />

    <app-profile-menu class="mb-3 mt-1" />
  `,
  styles: `
    .nav-heading {
      margin-top: 0.25rem;
      padding: 0.1875rem 0.5rem;
      text-decoration: none;
      color: var(--bs-body-color);
      font-weight: 600;
    }

    a.nav-heading.active,
    a.nav-heading:hover,
    a.nav-heading:focus {
      color: var(--bs-emphasis-color) !important;
      background-color: var(--bd-sidebar-link-bg);
    }

    .nav-sub a {
      color: var(--bs-body-color);
      padding: 0.1875rem 0.5rem;
      text-decoration: none;
      margin-top: 0.125rem;
      margin-left: 1.5rem;
    }

    .nav-sub a.active {
      font-weight: 600;
    }

    .nav-sub a.active,
    .nav-sub a:hover,
    .nav-sub a:focus {
      color: var(--bs-emphasis-color) !important;
      background-color: var(--bd-sidebar-link-bg);
    }

    .switcher:hover,
    .switcher:active {
      border-color: var(--bs-emphasis-color) !important;
    }
  `,
  standalone: true,
  selector: 'app-nav',
  imports: [RouterLink, NgOptimizedImage, BiComponent, RouterLinkActive, TranslocoPipe, ProfileMenuComponent, DfxCutPipe],
})
export class NavComponent {
  modal = inject(NgbModal);
  logoUrl = EnvironmentHelper.getLogoUrl();

  myUser = inject(MyUserService).user;

  #selectedOrganisationService = inject(SelectedOrganisationService);
  #selectedEventService = inject(SelectedEventService);

  selectedOrganisation = this.#selectedOrganisationService.selected;
  selectedEvent = this.#selectedEventService.selected;

  selectedColor = computed(() => {
    const organisation = this.selectedOrganisation();
    const event = this.selectedEvent();

    if (!organisation && !event) {
      return undefined;
    }

    return s_toColor(`${organisation?.name ?? ''}${event?.name ?? ''}`);
  });

  selectedOrganisationIdRoute = computed(() => this.#selectedOrganisationService.selectedId() ?? 'organisationId');
  selectedEventIdRoute = computed(() => this.#selectedEventService.selectedId() ?? 'eventId');

  openSwitcher(): void {
    this.modal.open(SwitcherModalComponent, {ariaLabelledBy: 'modal-switcher-title', size: 'lg'});
  }
}
