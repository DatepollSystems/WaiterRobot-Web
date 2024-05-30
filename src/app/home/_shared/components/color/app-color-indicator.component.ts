import {NgStyle} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  template: `
    {{ '' }}
    <div [ngStyle]="{width: size + 'px', height: size + 'px', backgroundColor: color, borderRadius: '50px'}"></div>
  `,
  standalone: true,
  selector: 'app-color-indicator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgStyle],
})
export class AppColorIndicatorComponent {
  @Input({required: true}) color!: string;

  @Input() size = 20;
}
