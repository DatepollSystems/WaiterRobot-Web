import {AsyncPipe, NgForOf, NgIf, NgTemplateOutlet} from '@angular/common';
import {AfterViewInit, ChangeDetectionStrategy, Component, ContentChild, Directive, inject, Input, TemplateRef} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {NavigationEnd, Router, RouterLink, RouterLinkActive} from '@angular/router';

import {filter, map, Observable, startWith, tap} from 'rxjs';

import {HasIDAndName, StringOrNumber} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTrackById} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';

interface AppListNavItemContext {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $implicit: any;
}

@Directive({
  selector: 'ng-template[appListNavItem]',
  standalone: true,
})
export class AppListNavItemDirective {
  static ngTemplateContextGuard(dir: AppListNavItemDirective, ctx: unknown): ctx is AppListNavItemContext {
    return true;
  }
}

@Component({
  template: `
    <ng-container *ngIf="selected$ | async" />

    <div class="d-none d-lg-block">
      <h6 class="fw-bold" *ngIf="titleTr && (entities?.length ?? 0) > 0">{{ titleTr | tr }}</h6>
      <div class="list-group">
        <ng-container *ngIf="entities; else loading">
          <a
            *ngFor="let entity of entities; trackById"
            class="list-group-item list-group-item-action "
            [routerLink]="path + entity.id"
            routerLinkActive="active"
          >
            <ng-container *ngTemplateOutlet="navItemRef || emptyRef; context: {$implicit: entity}"></ng-container>

            <ng-template #emptyRef>{{ entity.name }}</ng-template>
          </a>
        </ng-container>
      </div>
    </div>

    <div class="list-group d-lg-none">
      <div class="input-group">
        <span class="input-group-text" id="select-nav-addon"><bi name="people" /></span>
        <select [formControl]="selectFormControl" class="form-select" id="select-nav" #select (change)="onNavigate(select.value)">
          <option value="default">{{ selectTr | tr }}</option>
          <option value="{{ path }}{{ entity.id }}" *ngFor="let entity of entities; trackById">
            {{ entity.name }}
          </option>
        </select>
      </div>

      <ng-template #loading>
        <div class="list-group-item d-flex justify-content-between align-items-center">
          {{ 'LOADING' | tr }}

          <div class="spinner-border spinner-border-sm">
            <span class="visually-hidden">{{ 'LOADING' | tr }}</span>
          </div>
        </div>
      </ng-template>
    </div>
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
    BiComponent,
    AsyncPipe,
    RouterLink,
    ReactiveFormsModule,
    NgTemplateOutlet,
  ],
})
export class AppListNavItemsComponent implements AfterViewInit {
  router = inject(Router);

  @Input() entities: HasIDAndName<StringOrNumber>[] | null = null;

  @Input() path!: string;

  @Input() selectTr = 'SELECT';

  @Input() titleTr?: string;

  @ContentChild(AppListNavItemDirective, {read: TemplateRef})
  navItemRef?: TemplateRef<unknown>;

  selectFormControl = new FormControl('default');
  selected$?: Observable<string>;

  ngAfterViewInit(): void {
    this.selected$ = this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((select) => (select.url.includes(this.path) && !select.url.includes('all') ? select.url : 'default')),
      startWith(
        this.router.url.substring(0, this.router.url.lastIndexOf('/') + 1).includes(this.path) && !this.router.url.includes('all')
          ? this.router.url
          : 'default',
      ),
      tap((e) => {
        this.selectFormControl.setValue(e);
      }),
    );
  }

  onNavigate(value: string): void {
    if (value !== 'default') {
      void this.router.navigateByUrl(value);
    }
  }
}
