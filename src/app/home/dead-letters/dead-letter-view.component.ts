import {DatePipe} from '@angular/common';
import {Component, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';

import {map, switchMap} from 'rxjs';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

import {injectIdParam$} from '../../_shared/services/injectActivatedRouteIdParam';
import {AppBackButtonComponent} from '../../_shared/ui/button/app-back-button.component';
import {ScrollableToolbarComponent} from '../../_shared/ui/button/scrollable-toolbar.component';
import {AppSpinnerRowComponent} from '../../_shared/ui/loading/app-spinner-row.component';
import {DeadLettersService} from './dead-letters.service';

@Component({
  template: `
    @if (deadLetter(); as deadLetter) {
      <div class="d-flex flex-column gap-2">
        <h1>Dead Letter "{{ deadLetter.id }}"</h1>

        <scrollable-toolbar>
          <back-button />

          <div>
            <button class="btn btn-sm btn-danger" (click)="onDelete(deadLetter.id)">
              <bi name="trash" />
              {{ 'DELETE' | tr }}
            </button>
          </div>
        </scrollable-toolbar>

        <div class="d-flex flex-wrap gap-2 mb-4">
          <span class="badge text-bg-primary">{{ deadLetter.createdAt | date: 'dd.MM.YYYY HH:mm:ss:SSS' }}</span>
          <span class="badge text-bg-secondary">{{ deadLetter.queue }}</span>
          <span class="badge text-bg-secondary">{{ deadLetter.exchange }}</span>
        </div>

        <div class="json-box">
          <pre id="json-data">{{ deadLetter.body }}</pre>
        </div>
      </div>
    } @else {
      <app-spinner-row />
    }
  `,
  styles: [
    `
      .json-box {
        padding: 15px;
        background-color: black;
        border-radius: 5px;
      }
      #json-data {
        margin-bottom: 0;
      }
    `,
  ],
  selector: 'app-dead-letter-view',
  imports: [DfxTr, BiComponent, ScrollableToolbarComponent, AppBackButtonComponent, AppSpinnerRowComponent, DatePipe],
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
