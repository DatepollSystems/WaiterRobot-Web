import {AsyncPipe, NgIf} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DfxTr} from 'dfx-translate';
import {filter, map, switchMap} from 'rxjs';
import {GetTableResponse} from '../_shared/waiterrobot-backend';

@Component({
  template: `
    <ng-container *ngIf="table$ | async as table">
      <h2 class="text-center">
        Tisch <b>{{ table.groupName }} - {{ table.number }}</b>
      </h2>
      <h3>Offene Bestellungen</h3>
    </ng-container>
    <div class="mt-3">
      <a href="/home" class="btn btn-light btn-sm">{{ 'GO_BACK' | tr }}</a>
    </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-mobile-link-table',
  imports: [DfxTr, NgIf, AsyncPipe],
})
export class MobileLinkTableComponent {
  httpClient = inject(HttpClient);

  publicId = inject(ActivatedRoute).paramMap.pipe(
    map((params) => params.get('publicId')),
    filter((it): it is string => !!it)
  );

  table$ = this.publicId.pipe(switchMap((publicId) => this.httpClient.get<GetTableResponse>(`/ml/table/${publicId}`)));
}
