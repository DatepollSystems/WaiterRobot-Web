import {AfterViewInit, Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {FlexLayoutModule} from '@angular/flex-layout';
import {BooleanInput, coerceBooleanProperty} from '@angular/cdk/coercion';
import {CdkDragDrop, DragDropModule, moveItemInArray} from '@angular/cdk/drag-drop';

import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {StorageHelper} from 'dfx-helper';
import {DfxTranslateModule} from 'dfx-translate';

import {AppBtnToolbarComponent} from '../app-btn-toolbar/app-btn-toolbar.component';
import {IconsModule} from '../icons.module';

@Component({
  selector: 'app-navbar-scrollable',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DragDropModule,
    FlexLayoutModule,
    DfxTranslateModule,
    NgbTooltipModule,
    IconsModule,
    AppBtnToolbarComponent,
  ],
  templateUrl: './app-navbar-scrollable.component.html',
  styleUrls: ['./app-navbar-scrollable.component.scss'],
})
export class AppNavbarScrollableComponent implements AfterViewInit {
  @Input()
  set justifyContentBetween(value: BooleanInput) {
    this._justifyContentBetween = coerceBooleanProperty(value);
  }

  _justifyContentBetween = false;

  @Input()
  set isMobile(value: BooleanInput) {
    this._isMobile = coerceBooleanProperty(value);
  }

  _isMobile = false;

  @Input()
  set edible(value: BooleanInput) {
    this._edible = coerceBooleanProperty(value);
  }
  _edible = true;

  @Input()
  set preferencesStorageKey(value: string) {
    this._preferencesStorageKey = value;
  }
  _preferencesStorageKey = 'nav_pref';

  @Input()
  set items(value: NavItem[]) {
    this._items = value;
    this._itemsToView = this._items.slice();
    if (this._savedItems) {
      this._savedItems = this._savedItems.filter((it) => {
        for (const newItem of this._items) {
          if (newItem.text === it.text) {
            return true;
          }
        }
        return false;
      });

      this._itemsToView = this._itemsToView.filter((it) => {
        for (const savedItem of this._savedItems!) {
          if (it.text === savedItem.text) {
            return false;
          }
        }
        return true;
      });
    }
  }

  _items!: NavItem[];
  _itemsToView!: NavItem[];
  _itemsCopy!: NavItem[];
  _savedItems?: NavItem[];

  @Output()
  savedPreferencesChange = new EventEmitter<NavItem[]>();

  editMode = false;
  showEditArrow = false;

  constructor() {
    const savedPrefStr = StorageHelper.getString(this._preferencesStorageKey);
    if (savedPrefStr) {
      this._savedItems = JSON.parse(savedPrefStr) as NavItem[];
    }
  }

  ngAfterViewInit(): void {
    const slider = document.getElementById('overflow-container');
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    if (!slider) {
      return;
    }

    slider.addEventListener('mousedown', (e: MouseEvent) => {
      isDown = true;
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener('mouseleave', () => {
      isDown = false;
    });
    slider.addEventListener('mouseup', () => {
      isDown = false;
    });
    slider.addEventListener('mousemove', (e: MouseEvent) => {
      if (!isDown) {
        return;
      }
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = x - startX; // * 2 scroll-fast
      slider.scrollLeft = scrollLeft - walk;
    });
  }

  onMouseEnter(): void {
    if (!this._edible) {
      return;
    }
    this.showEditArrow = true;
  }

  onMouseLeave(): void {
    this.showEditArrow = false;
  }

  onEdit(): void {
    this._itemsCopy = this._itemsToView.slice();
    if (this._savedItems) {
      this._itemsCopy.unshift(...this._savedItems.slice());
    }
    this.showEditArrow = false;
    this.editMode = true;
  }

  onClose(): void {
    this.editMode = false;
  }

  onReset(): void {
    StorageHelper.remove(this._preferencesStorageKey);
    this._savedItems = undefined;
    this.items = this._items.slice();
    this.onClose();
  }

  onSave(): void {
    StorageHelper.set(this._preferencesStorageKey, JSON.stringify(this._itemsCopy));
    this._savedItems = this._itemsCopy.slice();
    this.items = this._items;

    this.savedPreferencesChange.next(this._savedItems);
    this.onClose();
  }

  drop(event: CdkDragDrop<NavItem[]>): void {
    moveItemInArray(this._itemsCopy, event.previousIndex, event.currentIndex);
  }
}

export type NavItem = {
  text: string;
  routerLink: string;
  show: boolean;
};
