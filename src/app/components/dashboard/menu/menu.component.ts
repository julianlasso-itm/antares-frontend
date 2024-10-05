import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  Signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { MenuElement, MenuItem } from '../../../menu.struct';
import { MenuService } from '../../../services/menu.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit, OnDestroy {
  private readonly menuService = inject(MenuService);
  private menuObserver: Subscription;
  menu: Signal<MenuElement[]>;

  constructor() {
    this.menu = signal([]);
    this.menuObserver = new Subscription();
  }

  isMenuSeparator(element: MenuElement): boolean {
    return Object.keys(element).length === 0;
  }

  getIcon(element: MenuElement): string {
    if (this.isMenuSeparator(element)) {
      return '';
    }
    return (element as MenuItem).icon;
  }

  getTitle(element: MenuElement): string {
    if (this.isMenuSeparator(element)) {
      return '';
    }
    return (element as MenuItem).title;
  }

  getLink(element: MenuElement): string {
    if (this.isMenuSeparator(element)) {
      return '';
    }
    return (element as MenuItem).path;
  }

  ngOnInit(): void {
    this.menuObserver = this.menuService.menu$.subscribe(
      (menu: MenuElement[]) => {
        this.menu = signal(menu);
      }
    );
  }

  ngOnDestroy(): void {
    this.menuObserver.unsubscribe();
  }
}
