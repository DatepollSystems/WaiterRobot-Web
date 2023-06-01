import {BooleanInput, coerceBooleanProperty} from '@angular/cdk/coercion';
import {CdkDragDrop, DragDropModule, moveItemInArray} from '@angular/cdk/drag-drop';
import {NgForOf, NgIf} from '@angular/common';
import {AfterViewInit, Component, EventEmitter, Input, Output, TemplateRef} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';

import {NgbModal, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {s_fromStorage, st_remove, st_set} from 'dfts-helper';
import {DfxTranslateModule} from 'dfx-translate';

import {AppBtnToolbarComponent} from '../app-btn-toolbar.component';
import {AppIconsModule} from '../icons.module';

@Component({
  selector: 'app-navbar-scrollable',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    RouterLink,
    RouterLinkActive,
    DragDropModule,
    DfxTranslateModule,
    AppIconsModule,
    NgbTooltipModule,
    AppBtnToolbarComponent,
    FormsModule,
  ],
  templateUrl: './app-navbar-scrollable.component.html',
  styleUrls: ['./app-navbar-scrollable.component.css'],
})
export class AppNavbarScrollableComponent implements AfterViewInit {
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
  set allowBookmarks(value: BooleanInput) {
    this._allowBookmarks = coerceBooleanProperty(value);
  }

  _allowBookmarks = true;

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
          if (it.bookmark || newItem.text === it.text) {
            return true;
          }
        }
        return false;
      });

      this._itemsToView = this._itemsToView.filter((it) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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

  constructor(public router: Router, private modalService: NgbModal) {
    const savedPrefStr = s_fromStorage(this._preferencesStorageKey);
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
    st_remove(this._preferencesStorageKey);
    this._savedItems = undefined;
    this.items = this._items.slice();
    this.onClose();
  }

  onSave(): void {
    st_set(this._preferencesStorageKey, JSON.stringify(this._itemsCopy));
    this._savedItems = this._itemsCopy.slice();
    this.items = this._items;

    this.savedPreferencesChange.next(this._savedItems);
    this.onClose();
  }

  drop(event: CdkDragDrop<NavItem[]>): void {
    moveItemInArray(this._itemsCopy, event.previousIndex, event.currentIndex);
  }

  openModal(content: TemplateRef<any>): void {
    void this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result?.then((result) => {
      if (result) {
        this._itemsCopy.push({text: result as string, routerLink: this.router.url, show: true, bookmark: true});
      }
    });
  }

  removeBookmark(item: NavItem): void {
    this._itemsCopy.splice(this._itemsCopy.indexOf(item), 1);
  }
}

export type NavItem = {
  text: string;
  routerLink: string;
  show?: boolean;
  bookmark?: boolean;
};
