import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle} from '@ng-bootstrap/ng-bootstrap';
import {catchError, combineLatest, map, of, switchMap} from 'rxjs';
import {tap} from 'rxjs/operators';
import {AuthService} from '../_shared/services/auth/auth.service';
import {AppSelectDialogComponent} from './app-select-dialog.component';
import {EventModel} from './events/_models/event.model';
import {EventsService} from './events/_services/events.service';
import {OrganisationModel} from './organisations/_models/organisation.model';
import {OrganisationsService} from './organisations/_services/organisations.service';

@Component({
  template: `
    <div class="row justify-content-center" style="padding-top: 16rem">
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
              (selectOrganisation)="selectOrganisation($event)" />
          </div>
          <div class="card-footer">
            <a class="btn btn-sm btn-outline-warning" href="/home">Zurück zur Startseite</a>
          </div>
        </div>
      </div>
    </div>
  `,
  selector: 'app-select-dialog-view',
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
    this.selectedOrganisation$.pipe(switchMap(() => this.eventsService.getAll$().pipe(catchError(() => of([]))))),
    this.eventsService.getSelected$,
  ]).pipe(
    map(([organisations, selectedOrganisation, events, selectedEvent]) => ({organisations, selectedOrganisation, events, selectedEvent})),
    tap((vm) => {
      if (vm.selectedOrganisation && vm.selectedEvent) {
        void this.router.navigateByUrl('/home');
      }
    })
  );

  selectOrganisation(it: OrganisationModel): void {
    this.organisationsService.setSelected(it);
  }

  selectEvent(it: EventModel): void {
    this.eventsService.setSelected(it);
    void this.router.navigateByUrl(this.authService.redirectUrl ?? '/home');
  }
}
