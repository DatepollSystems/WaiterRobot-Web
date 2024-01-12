import {Component} from '@angular/core';

import {AppSpinnerRowComponent} from '@shared/ui/loading/app-spinner-row.component';

@Component({
  selector: 'app-edit-placeholder',
  template: `
    <div class="d-flex flex-column gap-4">
      <h1 class="mb-0 placeholder-glow">
        <span class="placeholder col-3" style="height: 30px"></span>
      </h1>

      <div class="d-flex gap-2 placeholder-glow" style="height: 30px">
        <span class="placeholder col-2"></span>
        <span class="placeholder col-2"></span>
        <span class="placeholder col-2"></span>
        <span class="placeholder col-2"></span>
      </div>

      <hr />

      <app-spinner-row />

      <div class="d-flex justify-content-end mt-5">
        <span class="placeholder col-2" style="height: 50px"></span>
      </div>
    </div>
  `,
  standalone: true,
  imports: [AppSpinnerRowComponent],
})
export class AppEntityEditPlaceholder {}
