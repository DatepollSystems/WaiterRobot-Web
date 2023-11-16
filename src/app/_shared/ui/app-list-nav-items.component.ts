import {NgTemplateOutlet} from '@angular/common';
import {ChangeDetectionStrategy, Component, ContentChild, Directive, Input, TemplateRef} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';

import {NgbCollapse} from '@ng-bootstrap/ng-bootstrap';

import {HasIDAndName, StringOrNumber} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
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
    <div class="d-none d-lg-block">
      @if (titleTr && (entities?.length ?? 0) > 0) {
        <h6 class="fw-bold">{{ titleTr | tr }}</h6>
      }
      <div class="list-group">
        @if (entities) {
          @for (entity of entities; track entity.id) {
            <a class="list-group-item list-group-item-action " [routerLink]="path + entity.id" routerLinkActive="active">
              <ng-container *ngTemplateOutlet="navItemRef || emptyRef; context: {$implicit: entity}"></ng-container>

              <ng-template #emptyRef>{{ entity.name }}</ng-template>
            </a>
          }
        } @else {
          <div class="list-group-item d-flex justify-content-between align-items-center">
            {{ 'LOADING' | tr }}

            <div class="spinner-border spinner-border-sm">
              <span class="visually-hidden">{{ 'LOADING' | tr }}</span>
            </div>
          </div>
        }
      </div>
    </div>

    <button
      class="btn w-100 btn-link p-md-0 mb-2 mb-md-0 text-decoration-none bd-toc-toggle
        d-flex justify-content-between align-items-center"
      type="button"
      (click)="collapse.toggle()"
      [attr.aria-expanded]="!isCollapsed"
      aria-controls="collapseExample"
    >
      {{ selectTr | tr }}
      <bi name="chevron-expand" />
    </button>

    <div #collapse="ngbCollapse" [(ngbCollapse)]="isCollapsed">
      <div class="list-group">
        @if (entities) {
          @for (entity of entities; track entity.id) {
            <a class="list-group-item list-group-item-action " [routerLink]="path + entity.id" routerLinkActive="active">
              <ng-container *ngTemplateOutlet="navItemRef || emptyRef; context: {$implicit: entity}"></ng-container>

              <ng-template #emptyRef>{{ entity.name }}</ng-template>
            </a>
          }
        } @else {
          <div class="list-group-item d-flex justify-content-between align-items-center">
            {{ 'LOADING' | tr }}

            <div class="spinner-border spinner-border-sm">
              <span class="visually-hidden">{{ 'LOADING' | tr }}</span>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: `
  .bd-toc-toggle {
    color: var(--bs-body-color);
    border: 1px solid var(--bs-border-color);
    border-radius: var(--bs-border-radius);
  }

    .bd-toc-toggle[aria-expanded="true"] {
    box-shadow: 0 0 0 3px rgba(var(--bd-violet-rgb), 0.25);
  }

   .bd-toc-toggle[aria-expanded="true"] {
    color: var(--bd-violet);
    background-color: var(--bs-body-bg);
    border-color: var(--bd-violet);
  }
   `,
  standalone: true,
  selector: 'app-list-nav-items',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, DfxTr, BiComponent, NgTemplateOutlet, NgbCollapse],
})
export class AppListNavItemsComponent {
  @Input() entities: HasIDAndName<StringOrNumber>[] | null = null;

  @Input() path!: string;

  @Input() selectTr = 'SELECT';

  @Input() titleTr?: string;

  @ContentChild(AppListNavItemDirective, {read: TemplateRef})
  navItemRef?: TemplateRef<unknown>;

  isCollapsed = true;
}
