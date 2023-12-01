import {HttpClient} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {ActivatedRoute, RouterLink} from '@angular/router';

import {combineLatest, map, shareReplay, switchMap} from 'rxjs';

import {filterNil} from 'ngxtension/filter-nil';
import {AppSpinnerRowComponent} from 'src/app/_shared/ui/loading/app-spinner-row.component';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

import {GetOpenBillResponse, GetTableWithGroupResponse} from '../../_shared/waiterrobot-backend';
import {AppBackDirective} from '../../home/_shared/components/button/app-back-button.component';
import {DfxCurrencyCentPipe} from '../../home/_shared/pipes/currency.pipe';

@Component({
  template: `
    @if (vm$(); as vm) {
      <h1 class="text-center">
        Tisch <b>{{ vm.table.group.name }} - {{ vm.table.number }}</b>
      </h1>

      @if (vm.bill.implodedOrderProducts.length > 0) {
        <h4 class="my-3">Offene Rechnung:</h4>
        <ul class="list-group">
          @for (orderProduct of vm.bill.implodedOrderProducts; track orderProduct.name) {
            <li class="list-group-item">
              <div class="d-flex gap-2 align-items-center">
                <span class="badge bg-secondary rounded-pill">{{ orderProduct.amount }}x</span>
                <div class="fw-bold">{{ orderProduct.name }}</div>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <small>({{ orderProduct.pricePerPiece | currency }} / Stk.)</small>
                <span>{{ orderProduct.priceSum | currency }}</span>
              </div>
            </li>
          }
        </ul>

        <hr />
        <div class="d-flex justify-content-between px-2">
          <span>Gesamt:</span> <span>{{ vm.bill.priceSum | currency }}</span>
        </div>
        <hr />
      } @else {
        <div class="text-center mt-4 mb-5">Alles bezahlt :)</div>
      }

      <div class="mt-3 d-flex flex-column flex-md-row justify-content-between gap-2">
        <button back class="btn btn-secondary btn-sm">{{ 'GO_BACK' | tr }}</button>
        <!--      <div class="d-flex gap-2">-->
        <!--        <a routerLink="./orders" class="btn btn-outline-primary btn-sm">-->
        <!--          <bi name="view-stacked" />-->
        <!--          Bestellungen-->
        <!--        </a>-->
        <!--        <a routerLink="./bills" class="btn btn-primary btn-sm">-->
        <!--          <bi name="cash-stack" />-->
        <!--          Rechnungen-->
        <!--        </a>-->
        <!--      </div>-->
      </div>
    } @else {
      <app-spinner-row />
    }
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-mobile-link-table',
  imports: [DfxTr, DfxCurrencyCentPipe, RouterLink, BiComponent, AppBackDirective, AppSpinnerRowComponent],
})
export class WebLinkTableComponent {
  httpClient = inject(HttpClient);

  publicId$ = inject(ActivatedRoute).paramMap.pipe(
    map((params) => params.get('publicId')),
    filterNil(),
    shareReplay(1),
  );

  vm$ = toSignal(
    combineLatest([
      this.publicId$.pipe(switchMap((publicId) => this.httpClient.get<GetTableWithGroupResponse>(`/public/table/${publicId}`))),
      this.publicId$.pipe(switchMap((publicId) => this.httpClient.get<GetOpenBillResponse>(`/public/table/${publicId}/bill`))),
    ]).pipe(
      map(([table, bill]) => ({
        table,
        bill,
      })),
    ),
  );
}
