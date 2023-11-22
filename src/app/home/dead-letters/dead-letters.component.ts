import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  template: '<router-outlet/>',
  selector: 'app-dead-letters',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  standalone: true,
})
export class DeadLettersComponent {}
