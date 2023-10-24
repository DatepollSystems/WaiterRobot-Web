import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';

import {combineLatest, filter, map, shareReplay, switchMap} from 'rxjs';

import {DfxTr} from 'dfx-translate';

import {AppBackDirective} from '../_shared/ui/button/app-back-button.component';
import {DfxCurrencyCentPipe} from '../_shared/ui/currency.pipe';
import {AppIconsModule} from '../_shared/ui/icons.module';
import {GetOpenBillResponse, GetTableWithGroupResponse} from '../_shared/waiterrobot-backend';

@Component({
  template: `
    <div class="mb-5" *ngIf="vm$ | async as vm">
      <h1 class="text-center">
        Tisch <b>{{ vm.table.group.name }} - {{ vm.table.number }}</b>
      </h1>
      <h4 class="my-3">Offene Rechnung:</h4>

      <ng-container *ngIf="vm.bill.implodedOrderProducts.length > 0; else everythingPaid">
        <ul class="list-group">
          <li class="list-group-item" *ngFor="let orderProduct of vm.bill.implodedOrderProducts">
            <div class="d-flex justify-content-between align-items-center">
              <div class="fw-bold">{{ orderProduct.name }}</div>
              <span class="badge bg-secondary rounded-pill">{{ orderProduct.amount }}x</span>
            </div>
            <div class="d-flex justify-content-between align-items-center">
              <small>({{ orderProduct.pricePerPiece | currency: 'EUR' }} / Stück)</small>
              <span>{{ orderProduct.priceSum | currency: 'EUR' }}</span>
            </div>
          </li>
        </ul>

        <hr />
        <div class="d-flex justify-content-between px-2">
          <span>Gesamt:</span> <span>{{ vm.bill.priceSum | currency: 'EUR' }}</span>
        </div>
        <hr />
      </ng-container>
      <ng-template #everythingPaid>
        <div class="text-center">Alles bezahlt :)</div>
      </ng-template>
    </div>

    <div class="mt-3 d-flex flex-column flex-md-row justify-content-between gap-2">
      <button back class="btn btn-light btn-sm">{{ 'GO_BACK' | tr }}</button>
      <div class="d-flex gap-2" *ngIf="false">
        <a routerLink="./orders" class="btn btn-outline-primary btn-sm">
          <i-bs name="view-stacked" />
          Bestellungen
        </a>
        <a routerLink="./bills" class="btn btn-primary btn-sm">
          <i-bs name="cash-stack" />
          Rechnungen
        </a>
      </div>
    </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-mobile-link-table',
  imports: [NgIf, AsyncPipe, NgForOf, DfxTr, DfxCurrencyCentPipe, RouterLink, AppIconsModule, AppBackDirective],
})
export class WebLinkTableComponent {
  httpClient = inject(HttpClient);

  publicId$ = inject(ActivatedRoute).paramMap.pipe(
    map((params) => params.get('publicId')),
    filter((it): it is string => !!it),
    shareReplay(1),
  );

  vm$ = combineLatest([
    this.publicId$.pipe(switchMap((publicId) => this.httpClient.get<GetTableWithGroupResponse>(`/public/table/${publicId}`))),
    this.publicId$.pipe(switchMap((publicId) => this.httpClient.get<GetOpenBillResponse>(`/public/table/${publicId}/bill`))),
  ]).pipe(
    map(([table, bill]) => ({
      table,
      bill,
    })),
  );
}
