import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DfxTr} from 'dfx-translate';
import {combineLatest, filter, map, shareReplay, switchMap} from 'rxjs';
import {GetBillForTableResponse, GetTableResponse} from '../_shared/waiterrobot-backend';

@Component({
  template: `
    <ng-container *ngIf="vm$ | async as vm">
      <h2 class="text-center">
        Tisch <b>{{ vm.table.groupName }} - {{ vm.table.number }}</b>
      </h2>
      <h4 class="my-3">Offene Bestellungen:</h4>

      <div class="d-flex justify-content-between" *ngFor="let product of vm.bill.products">
        <span>
          {{ product.amount }}x {{ product.name }}
          <small>({{ product.pricePerPiece / 100 }}€ / Stück)</small>
        </span>
        <span>{{ product.price / 100 }}€</span>
      </div>

      <hr />
      <div class="text-end">Gesamt: {{ vm.bill.priceSum / 100 }}€</div>
    </ng-container>
    <div class="mt-3">
      <a href="/home" class="btn btn-light btn-sm">{{ 'GO_BACK' | tr }}</a>
    </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-mobile-link-table',
  imports: [NgIf, AsyncPipe, NgForOf, DfxTr],
})
export class MobileLinkTableComponent {
  httpClient = inject(HttpClient);

  publicId$ = inject(ActivatedRoute).paramMap.pipe(
    map((params) => params.get('publicId')),
    filter((it): it is string => !!it),
    shareReplay(1)
  );

  vm$ = combineLatest([
    this.publicId$.pipe(switchMap((publicId) => this.httpClient.get<GetTableResponse>(`/ml/table/${publicId}`))),
    this.publicId$.pipe(switchMap((publicId) => this.httpClient.get<GetBillForTableResponse>(`/ml/table/${publicId}/bills`))),
  ]).pipe(
    map(([table, bill]) => ({
      table,
      bill,
    }))
  );
}
