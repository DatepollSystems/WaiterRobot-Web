import {Directive, inject, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {HasIDAndName, StringOrNumber} from 'dfts-helper';

@Directive({
  selector: '[isCreating]',
  standalone: true,
})
export class AppIsCreatingWithNameDirective {
  private viewContainerRef = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef<unknown>);

  @Input() set isCreating(entity: HasIDAndName<StringOrNumber> | 'CREATE') {
    if (entity !== 'CREATE') {
      this.viewContainerRef.clear();
      return;
    }
    this.viewContainerRef.createEmbeddedView(this.templateRef);
  }

  static ngTemplateGuard_isEditing(
    dir: AppIsCreatingWithNameDirective,
    state: HasIDAndName<StringOrNumber> | 'CREATE'
  ): state is HasIDAndName<StringOrNumber> {
    return true;
  }
}
