import {DatePipe} from '@angular/common';
import {Component, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';

import {AppBackButtonComponent} from '@home-shared/components/button/app-back-button.component';
import {ScrollableToolbarComponent} from '@home-shared/components/scrollable-toolbar.component';
import {injectIdParam$} from '@home-shared/services/injectActivatedRouteIdParam';
import {TranslocoPipe} from '@jsverse/transloco';
import {AppSpinnerRowComponent} from '@shared/ui/loading/app-spinner-row.component';

import {BiComponent} from 'dfx-bootstrap-icons';

import {map, switchMap} from 'rxjs';

import {DeadLettersService} from './dead-letters.service';

@Component({
  template: `
    @if (deadLetter(); as deadLetter) {
      <div class="d-flex flex-column gap-3">
        <h1 class="my-0">Dead Letter "{{ deadLetter.id }}"</h1>

        <scrollable-toolbar>
          <back-button />

          <div>
            <button type="button" class="btn btn-sm btn-danger" (mousedown)="onDelete(deadLetter.id)">
              <bi name="trash" />
              {{ 'DELETE' | transloco }}
            </button>
          </div>
        </scrollable-toolbar>

        <div class="d-flex flex-wrap gap-2 mb-4">
          <span class="badge text-bg-primary">{{ deadLetter.createdAt | date: 'dd.MM.YYYY HH:mm:ss:SSS' }}</span>
          <span class="badge text-bg-secondary">{{ deadLetter.queue }}</span>
          <span class="badge text-bg-secondary">{{ deadLetter.exchange }}</span>
        </div>

        <hr />

        <div class="json-box">
          <pre id="json-data">{{ deadLetter.body }}</pre>
        </div>
      </div>
    } @else {
      <app-spinner-row />
    }
  `,
  styles: `
    .json-box {
      padding: 15px;
      background-color: black;
      border-radius: 5px;
    }
    #json-data {
      margin-bottom: 0;
    }
  `,
  selector: 'app-dead-letter-view',
  imports: [TranslocoPipe, BiComponent, ScrollableToolbarComponent, AppBackButtonComponent, AppSpinnerRowComponent, DatePipe],
  standalone: true,
})
export class DeadLetterViewComponent {
  deadLettersService = inject(DeadLettersService);
  idParam$ = injectIdParam$();

  deadLetter = toSignal(
    this.idParam$.pipe(
      switchMap((id) => this.deadLettersService.getSingle$(id)),
      map((deadLetter) => ({...deadLetter, body: JSON.stringify(JSON.parse(deadLetter.body), null, 2)})),
    ),
  );

  onDelete(id: number): void {
    this.deadLettersService.delete$(id).subscribe();
  }
}
