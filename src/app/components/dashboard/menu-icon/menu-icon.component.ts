import { CommonModule } from '@angular/common';
import {
  Component,
  HostBinding,
  inject,
  OnInit,
  signal,
  Signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import {
  MenuElement,
  MenuItem,
  MenuStruct,
  menuStruct,
} from '../../../menu.struct';
import { MenuService } from '../../../services/menu.service';

@Component({
  selector: 'app-menu-icon',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './menu-icon.component.html',
  styleUrl: './menu-icon.component.scss',
})
export class MenuIconComponent implements OnInit {
  @HostBinding('class.menu-visible') isMenuVisible = true;
  @HostBinding('class.menu-hidden') isMenuHidden = false;

  private readonly menuService = inject(MenuService);
  private readonly router = inject(Router);
  menu: Signal<MenuStruct[]>;

  constructor() {
    this.menu = signal(menuStruct);
  }

  ngOnInit(): void {
    this.menuService.menu = menuStruct[0].children;

    const url = this.router.url.slice(1);
    const matchingMenu = this.menu().find((menu) =>
      menu.children.some((element) => {
        if ((element as MenuItem).path === url) {
          return true;
        }
        return false;
      })
    );

    if (matchingMenu) {
      this.menuService.menu = matchingMenu.children;
    }
  }

  menuToggle(): void {
    this.isMenuVisible = !this.isMenuVisible;
    this.isMenuHidden = !this.isMenuHidden;
  }

  changeMenu(menu: MenuElement[]): void {
    this.menuService.menu = menu;
  }
}
