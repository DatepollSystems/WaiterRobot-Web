import {Directive, inject, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {StringOrNumber} from 'dfts-helper';
import {HasIdAndNumber} from '../../services/abstract-entity.service';

@Directive({
  selector: '[isEditing]',
  standalone: true,
})
export class AppIsEditingWithNumberDirective {
  private viewContainerRef = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef<unknown>);

  @Input() set isEditing(entity: HasIdAndNumber<StringOrNumber> | 'CREATE') {
    if (entity === 'CREATE') {
      this.viewContainerRef.clear();
      return;
    }
    this.viewContainerRef.createEmbeddedView(this.templateRef);
  }

  static ngTemplateGuard_isEditing(
    dir: AppIsEditingWithNumberDirective,
    state: HasIdAndNumber<StringOrNumber> | 'CREATE'
  ): state is HasIdAndNumber<StringOrNumber> {
    return true;
  }
}
