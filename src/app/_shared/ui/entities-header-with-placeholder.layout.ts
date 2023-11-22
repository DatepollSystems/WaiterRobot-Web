import {booleanAttribute, ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      @if (loading) {
        <h1 class="mb-0 placeholder-glow">
          <span class="placeholder col-3" style="height: 30px"></span>
        </h1>

        <div class="d-flex gap-2 placeholder-glow" style="height: 30px">
          <span class="placeholder col-2"></span>
          <span class="placeholder col-2"></span>
          <span class="placeholder col-2"></span>
          <span class="placeholder col-2"></span>
        </div>
      } @else {
        <ng-content />
      }
    </div>
  `,
  selector: 'entities-header-with-placeholder-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class EntitiesHeaderWithPlaceholderLayout {
  @Input({transform: booleanAttribute}) loading = false;
}
