import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {AfterViewInit, ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {NavigationEnd, Router, RouterLink, RouterLinkActive} from '@angular/router';

import {HasIDAndName, StringOrNumber} from 'dfts-helper';
import {DfxTrackById} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';

import {filter, map, Observable, startWith, tap} from 'rxjs';
import {AppIconsModule} from './icons.module';
import {AppListLoadingItemComponent} from './loading/app-list-loading-item.component';

@Component({
  template: `
    <ng-container *ngIf="selected$ | async" />

    <div class="list-group-item d-lg-none">
      <div class="input-group">
        <span class="input-group-text" id="select-nav-addon"><i-bs name="people" /></span>
        <select [formControl]="selectFormControl" class="form-select" id="select-nav" #select (change)="onNavigate(select.value)">
          <option value="default">{{ 'SELECT' | tr }}</option>
          <option value="{{ path }}{{ entity.id }}" *ngFor="let entity of entities; trackById">
            {{ entity.name }}
          </option>
        </select>
      </div>
    </div>

    <ng-container *ngIf="entities; else loading">
      <a
        *ngFor="let entity of entities; trackById"
        class="list-group-item list-group-item-action d-none d-lg-block"
        [routerLink]="path + entity.id"
        routerLinkActive="active">
        {{ entity.name }}
      </a>
    </ng-container>

    <ng-template #loading>
      <app-list-loading-item />
    </ng-template>
  `,
  standalone: true,
  selector: 'app-list-nav-items',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLinkActive,
    NgIf,
    NgForOf,
    DfxTr,
    DfxTrackById,
    AppIconsModule,
    AppListLoadingItemComponent,
    AsyncPipe,
    RouterLink,
    ReactiveFormsModule,
  ],
})
export class AppListNavItemsComponent implements AfterViewInit {
  router = inject(Router);

  @Input() entities: HasIDAndName<StringOrNumber>[] | null = null;

  @Input() path!: string;

  selectFormControl = new FormControl('default');
  selected$?: Observable<string>;

  ngAfterViewInit(): void {
    this.selected$ = this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((select) => (select.url.includes(this.path) ? select.url : 'default')),
      startWith(this.router.url.substring(0, this.router.url.lastIndexOf('/') + 1).includes(this.path) ? this.router.url : 'default'),
      tap((e) => {
        this.selectFormControl.setValue(e);
      })
    );
  }

  onNavigate(value: string): void {
    if (value !== 'default') {
      void this.router.navigateByUrl(value);
    }
  }
}
