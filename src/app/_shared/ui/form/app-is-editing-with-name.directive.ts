import {Directive, inject, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {HasIDAndName, StringOrNumber} from 'dfts-helper';

@Directive({
  selector: '[isEditing]',
  standalone: true,
})
export class AppIsEditingWithNameDirective {
  private viewContainerRef = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef<unknown>);

  @Input() set isEditing(entity: HasIDAndName<StringOrNumber> | 'CREATE') {
    if (entity === 'CREATE') {
      this.viewContainerRef.clear();
      return;
    }
    this.viewContainerRef.createEmbeddedView(this.templateRef);
  }

  static ngTemplateGuard_isEditing(
    dir: AppIsEditingWithNameDirective,
    state: HasIDAndName<StringOrNumber> | 'CREATE'
  ): state is HasIDAndName<StringOrNumber> {
    return true;
  }
}
