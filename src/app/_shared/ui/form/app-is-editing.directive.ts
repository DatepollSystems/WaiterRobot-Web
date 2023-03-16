import {Directive, inject, Input, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[isEditing]',
  standalone: true,
})
export class AppIsEditingDirective {
  private viewContainerRef = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef<unknown>);

  @Input() set isEditing(entity: unknown | 'CREATE') {
    if (entity === 'CREATE') {
      this.viewContainerRef.clear();
      return;
    }
    this.viewContainerRef.clear();
    this.viewContainerRef.createEmbeddedView(this.templateRef);
  }

  static ngTemplateGuard_isEditing<T>(dir: AppIsEditingDirective, state: T): state is Exclude<T, 'CREATE'> {
    return true;
  }
}
