import {Component, EventEmitter, Input, Output} from '@angular/core';

import {GetEventOrLocationResponse, GetOrganisationResponse} from '../_shared/waiterrobot-backend';

@Component({
  template: `
    <div class="d-flex flex-column flex-lg-row align-items-center justify-content-between">
      <p class="mb-1 mb-lg-0 text-center">Wähle eine Organisation aus</p>
      @if (selectedOrganisation === undefined) {
        <div class="btn-group d-flex flex-wrap" role="group" aria-label="Select organisation">
          @for (organisation of organisations; track organisation.id) {
            <button type="button" class="btn btn-sm btn-outline-primary" (click)="selectOrganisation.emit(organisation)">
              {{ organisation.name }}
            </button>
          }
        </div>
      } @else {
        <span>{{ selectedOrganisation?.name }}</span>
      }
    </div>
    <div class="d-flex flex-column flex-lg-row align-items-center justify-content-between mt-3">
      <p class="mb-1 mb-lg-0 text-center">Wähle ein Event aus</p>

      <div class="btn-group d-flex flex-wrap" role="group" aria-label="Select event">
        @for (event of events; track event.id) {
          <button type="button" class="btn btn-sm btn-outline-secondary" (click)="selectEvent.emit(event)">
            {{ event.name }}
          </button>
        } @empty {
          <button type="button" class="btn btn-sm btn-outline-warning" disabled>Wähle zuerst eine Organisation aus</button>
        }
      </div>
    </div>
  `,
  selector: 'app-select-dialog',
  standalone: true,
  imports: [],
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
