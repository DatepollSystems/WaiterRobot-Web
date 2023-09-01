import {NgForOf, NgIf} from '@angular/common';
import {Component, EventEmitter, Input, Output} from '@angular/core';

import {NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle} from '@ng-bootstrap/ng-bootstrap';

import {GetEventOrLocationResponse, GetOrganisationResponse} from '../_shared/waiterrobot-backend';

@Component({
  template: `
    <div class="d-flex flex-column flex-lg-row align-items-center justify-content-between">
      <p class="mb-1 mb-lg-0 text-center">Wähle eine Organisation aus</p>
      <div
        class="btn-group d-flex flex-wrap"
        role="group"
        aria-label="Select organisation"
        *ngIf="selectedOrganisation === undefined; else organisationSelected"
      >
        <button
          class="btn btn-outline-primary btn-sm"
          type="button"
          (click)="selectOrganisation.emit(organisations[0])"
          *ngIf="organisations.length === 1; else organisationSelectDropdown"
        >
          {{ organisations[0].name }} auswählen
        </button>
        <ng-template #organisationSelectDropdown>
          <button
            type="button"
            class="btn btn-sm btn-outline-primary"
            *ngFor="let org of organisations"
            (click)="selectOrganisation.emit(org)"
          >
            {{ org.name }}
          </button>
        </ng-template>
      </div>
      <ng-template #organisationSelected>
        <span>{{ selectedOrganisation?.name }}</span>
      </ng-template>
    </div>
    <div class="d-flex flex-column flex-lg-row align-items-center justify-content-between mt-3">
      <p class="mb-1 mb-lg-0 text-center">Wähle ein Event aus</p>

      <div class="btn-group d-flex flex-wrap" role="group" aria-label="Select event">
        <button
          class="btn btn-sm btn-outline-secondary"
          (click)="selectEvent.emit(events[0])"
          *ngIf="!selectedEvent && selectedOrganisation && events.length === 1; else eventSelectDropdown"
        >
          {{ events[0].name }} auswählen
        </button>
        <ng-template #eventSelectDropdown>
          <button type="button" class="btn btn-sm btn-outline-warning" disabled *ngIf="!selectedOrganisation">
            Wähle zuerst eine Organisation aus
          </button>
          <button type="button" class="btn btn-sm btn-outline-secondary" *ngFor="let event of events" (click)="selectEvent.emit(event)">
            {{ event.name }}
          </button>
        </ng-template>
      </div>
    </div>
  `,
  selector: 'app-select-dialog',
  standalone: true,
  imports: [NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem, NgForOf, NgIf],
})
export class AppSelectDialogComponent {
  @Input()
  organisations!: GetOrganisationResponse[];

  @Input()
  selectedOrganisation?: GetOrganisationResponse;

  @Input()
  events!: GetEventOrLocationResponse[];

  @Input()
  selectedEvent?: GetEventOrLocationResponse;

  @Output()
  selectOrganisation = new EventEmitter<GetOrganisationResponse>();

  @Output()
  selectEvent = new EventEmitter<GetEventOrLocationResponse>();
}
