import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../../services/auth-google.service';
import { AuthStorageService } from '../../services/auth-storage.service';
import { ButtonHeaderService } from '../../services/button-header.service';
import { MenuService } from '../../services/menu.service';

import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { GlobalProgressBarService } from '../../services/global-progress-bar.service';
import { ModalStateService } from '../../services/modal-state.service';
import { customClassTooltip, tooltipsProps } from '../template/tooltips.props';
import { HeaderComponent } from './header/header.component';
import { MenuIconComponent } from './menu-icon/menu-icon.component';
import { MenuComponent } from './menu/menu.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatProgressBarModule,
    MenuComponent,
    MenuIconComponent,
    NgxTippyModule,
    RouterOutlet,
  ],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly _authService = inject(AuthService);
  private readonly _authStorageService = inject(AuthStorageService);
  private readonly _menuService = inject(MenuService);
  private readonly _router = inject(Router);
  private readonly _modalStateService = inject(ModalStateService);
  private readonly _buttonHeaderService = inject(ButtonHeaderService);
  private readonly _globalProgressBarService = inject(GlobalProgressBarService);
  private readonly _iconRegistry = inject(MatIconRegistry);
  private readonly _sanitizer = inject(DomSanitizer);
  public profile: Record<string, unknown>;
  public title: Signal<string>;
  private storageService: Subscription;
  private titleService: Subscription;
  private buttonAddVisibleService: Subscription;
  private buttonAddActionService: Subscription;
  private buttonAssistantVisibleService: Subscription;
  private buttonAssistantActionService: Subscription;
  private modalStateVisibleService: Subscription;
  private globalProgressBarVisibleService: Subscription;
  readonly buttonAddVisible: WritableSignal<boolean>;
  readonly buttonAddAction: WritableSignal<Function>;
  readonly buttonAssistantVisible: WritableSignal<boolean>;
  readonly buttonAssistantAction: WritableSignal<Function>;
  readonly showProgressBar: WritableSignal<boolean>;
  blurEffect: WritableSignal<boolean>;
  customClassTooltip = customClassTooltip;
  tooltipsProps = tooltipsProps;

  constructor() {
    this.profile = {};
    this.title = signal('');
    this.blurEffect = signal(false);
    this.showProgressBar = signal(false);
    this.storageService = new Subscription();
    this.titleService = new Subscription();
    this.buttonAddVisible = signal(false);
    this.buttonAddAction = signal(() => {});
    this.buttonAddVisibleService = new Subscription();
    this.buttonAddActionService = new Subscription();

    this.buttonAssistantVisible = signal(false);
    this.buttonAssistantAction = signal(() => {});
    this.buttonAssistantVisibleService = new Subscription();
    this.buttonAssistantActionService = new Subscription();

    this.modalStateVisibleService = new Subscription();
    this.globalProgressBarVisibleService = new Subscription();
    this._iconRegistry.addSvgIcon(
      'sparkles',
      this._sanitizer.bypassSecurityTrustResourceUrl('icons/sparkles.svg')
    );
  }

  ngOnInit(): void {
    this.titleService = this._menuService.title$.subscribe((title) => {
      this.title = signal(title);
    });
    this.storageService = this._authStorageService
      .getItemObservable()
      .subscribe({
        next: (data: Map<string, string>) => {
          if (data.has('id_token_claims_obj')) {
            this.showData();
          }
        },
      });
    this.showData();

    this.buttonAddVisibleService =
      this._buttonHeaderService.visibleAdd$.subscribe({
        next: (visible: boolean) => {
          this.buttonAddVisible.set(visible);
        },
      });

    this.buttonAddActionService =
      this._buttonHeaderService.actionAdd$.subscribe({
        next: (action: Function) => {
          this.buttonAddAction.set(action);
        },
      });

    this.buttonAssistantVisibleService =
      this._buttonHeaderService.visibleAssistant$.subscribe({
        next: (visible: boolean) => {
          this.buttonAssistantVisible.set(visible);
        },
      });

    this.buttonAssistantActionService =
      this._buttonHeaderService.actionAssistant$.subscribe({
        next: (action: Function) => {
          this.buttonAssistantAction.set(action);
        },
      });

    this.modalStateVisibleService = this._modalStateService.state$.subscribe({
      next: (visible: boolean) => {
        this.blurEffect.set(visible);
      },
    });

    this.blurEffect.set(this._modalStateService.state);

    this.globalProgressBarVisibleService =
      this._globalProgressBarService.visible$.subscribe({
        next: (visible: boolean) => {
          this.showProgressBar.set(visible);
        },
      });

    this.showProgressBar.set(this._globalProgressBarService.visible);
  }

  ngOnDestroy(): void {
    this.storageService.unsubscribe();
    this.titleService.unsubscribe();
    this.buttonAddVisibleService.unsubscribe();
    this.buttonAddActionService.unsubscribe();
    this.modalStateVisibleService.unsubscribe();
    this.globalProgressBarVisibleService.unsubscribe();
    this.buttonAssistantVisibleService.unsubscribe();
    this.buttonAssistantActionService.unsubscribe();
  }

  showData(): void {
    this.profile = this._authService.getProfile();
  }

  logOut(): void {
    this._authService.logout();
    this._router.navigate(['/login']);
  }
}
