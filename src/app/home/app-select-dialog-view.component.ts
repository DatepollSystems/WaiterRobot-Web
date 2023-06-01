import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Router} from '@angular/router';
import {NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle} from '@ng-bootstrap/ng-bootstrap';
import {combineLatest, map, startWith, tap} from 'rxjs';
import {AuthService} from '../_shared/services/auth/auth.service';
import {GetEventOrLocationResponse, GetOrganisationResponse} from '../_shared/waiterrobot-backend';
import {AppSelectDialogComponent} from './app-select-dialog.component';
import {EventsService} from './events/_services/events.service';
import {OrganisationsService} from './organisations/_services/organisations.service';

@Component({
  template: `
    <div class="d-flex justify-content-center" style="padding-top: 16rem">
      <div class="col-12 col-md-6">
        <div class="card">
          <div class="card-body">
            <h4 class="text-center card-title">Hallo!</h4>
            <p class="text-center">Bitte wähle eine Organisation und ein Event aus um richtig weitergeleitet zu werden.</p>

            <hr class="mb-3" />

            <app-select-dialog
              *ngIf="vm$ | async as vm"
              [selectedOrganisation]="vm.selectedOrganisation"
              [organisations]="vm.organisations"
              [selectedEvent]="vm.selectedEvent"
              [events]="vm.events"
              (selectEvent)="selectEvent($event)"
              (selectOrganisation)="selectOrganisation($event)"
            />
          </div>
          <div class="card-footer">
            <a class="btn btn-sm btn-outline-warning" href="/home">Zurück zur Startseite</a>
          </div>
        </div>
      </div>
    </div>
  `,
  selector: 'app-select-dialog-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem, NgForOf, NgIf, AsyncPipe, AppSelectDialogComponent],
})
export class AppSelectDialogViewComponent {
  constructor(
    private organisationsService: OrganisationsService,
    private eventsService: EventsService,
    private router: Router,
    private authService: AuthService
  ) {}
  selectedOrganisation$ = this.organisationsService.getSelected$;

  vm$ = combineLatest([
    this.organisationsService.getAll$(),
    this.selectedOrganisation$,
    this.eventsService.getAll$().pipe(startWith([])),
    this.eventsService.getSelected$,
  ]).pipe(
    map(([organisations, selectedOrganisation, events, selectedEvent]) => ({organisations, selectedOrganisation, events, selectedEvent})),
    tap((vm) => {
      if (vm.selectedOrganisation && vm.selectedEvent) {
        void this.router.navigateByUrl('/home');
      }
      if (vm.organisations.length === 1) {
        this.selectOrganisation(vm.organisations[0]);
      }
      if (vm.events.length === 1) {
        this.selectEvent(vm.events[0]);
      }
    })
  );

  selectOrganisation(it: GetOrganisationResponse): void {
    this.organisationsService.setSelected(it);
  }

  selectEvent(it: GetEventOrLocationResponse): void {
    this.eventsService.setSelected(it);
    void this.router.navigateByUrl(this.authService.redirectUrl ?? '/home');
  }
}
