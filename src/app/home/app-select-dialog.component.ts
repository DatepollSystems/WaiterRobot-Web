import {NgForOf, NgIf} from '@angular/common';
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle} from '@ng-bootstrap/ng-bootstrap';
import {EventModel} from './events/_models/event.model';
import {OrganisationModel} from './organisations/_models/organisation.model';

@Component({
  template: `
    <div class="d-flex flex-column flex-lg-row align-items-center justify-content-between">
      <p class="mb-1 mb-lg-0 text-center">Wähle eine Organisation aus.</p>
      <div ngbDropdown>
        <button
          class="btn btn-outline-secondary"
          (click)="selectOrganisation.emit(organisations[0])"
          *ngIf="organisations.length === 1; else organisationSelectDropdown"
          [disabled]="selectedOrganisation">
          {{ organisations[0].name }} auswählen
        </button>
        <ng-template #organisationSelectDropdown>
          <button type="button" class="btn btn-outline-secondary" id="orgSelect" ngbDropdownToggle [disabled]="selectedOrganisation">
            Organisation auswählen
          </button>
          <div ngbDropdownMenu aria-labelledby="orgSelect">
            <button ngbDropdownItem *ngFor="let org of organisations" (click)="selectOrganisation.emit(org)">{{ org.name }}</button>
          </div>
        </ng-template>
      </div>
    </div>
    <div class="d-flex flex-column flex-lg-row align-items-center justify-content-between mt-3">
      <p class="mb-1 mb-lg-0 text-center">Wähle ein Event aus.</p>
      <button
        class="btn btn-outline-secondary"
        (click)="selectEvent.emit(events[0])"
        *ngIf="!selectedEvent && selectedOrganisation && events.length === 1; else eventSelectDropdown">
        {{ events[0].name }} auswählen
      </button>
      <ng-template #eventSelectDropdown>
        <div ngbDropdown>
          <button type="button" class="btn btn-outline-secondary" id="eventSelect" ngbDropdownToggle [disabled]="!selectedOrganisation">
            Event auswählen
          </button>
          <div ngbDropdownMenu aria-labelledby="eventSelect">
            <button ngbDropdownItem *ngFor="let event of events" (click)="selectEvent.emit(event)">{{ event.name }}</button>
          </div>
        </div>
      </ng-template>
    </div>
  `,
  selector: 'app-select-dialog',
  standalone: true,
  imports: [NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem, NgForOf, NgIf],
})
export class AppSelectDialogComponent {
  @Input()
  organisations!: OrganisationModel[];

  @Input()
  selectedOrganisation?: OrganisationModel;

  @Input()
  events!: EventModel[];

  @Input()
  selectedEvent?: EventModel;

  @Output()
  selectOrganisation = new EventEmitter<OrganisationModel>();

  @Output()
  selectEvent = new EventEmitter<EventModel>();
}
