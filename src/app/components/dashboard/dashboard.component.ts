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
import { DomSanitizer } from '@angular/platform-browser';
import { Router, RouterOutlet } from '@angular/router';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { Subscription } from 'rxjs';

import { AuthService } from '../../services/auth-google.service';
import { AuthStorageService } from '../../services/auth-storage.service';
import { ButtonHeaderService } from '../../services/button-header.service';
import { FullViewportContentService } from '../../services/full-viewport-content.service';
import { GlobalProgressBarService } from '../../services/global-progress-bar.service';
import { MenuService } from '../../services/menu.service';
import { ModalStateService } from '../../services/modal-state.service';

import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

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
  private readonly _auth$ = inject(AuthService);
  private readonly _authStorage$ = inject(AuthStorageService);
  private readonly _menu$ = inject(MenuService);
  private readonly _router = inject(Router);
  private readonly _modalState$ = inject(ModalStateService);
  private readonly _buttonHeader$ = inject(ButtonHeaderService);
  private readonly _globalProgressBar$ = inject(GlobalProgressBarService);
  private readonly _iconRegistry = inject(MatIconRegistry);
  private readonly _sanitizer = inject(DomSanitizer);
  private readonly _fullViewportContent$ = inject(FullViewportContentService);
  public profile: Record<string, unknown>;
  public title: Signal<string>;
  private storageService: Subscription;
  private titleService: Subscription;
  private buttonAddVisibleService: Subscription;
  private buttonPartialSaveService: Subscription;
  private buttonSaveAndFinishService: Subscription;
  private buttonAddActionService: Subscription;
  private buttonPartialSaveActionService: Subscription;
  private buttonSaveAndFinishActionService: Subscription;
  private buttonAssistantVisibleService: Subscription;
  private buttonAssistantActionService: Subscription;
  private modalStateVisibleService: Subscription;
  private globalProgressBarVisibleService: Subscription;
  private fullViewportContentService: Subscription;
  readonly buttonAddVisible: WritableSignal<boolean>;
  readonly buttonPartialSaveVisible: WritableSignal<boolean>;
  readonly buttonSaveAndFinishVisible: WritableSignal<boolean>;
  readonly buttonAddAction: WritableSignal<Function>;
  readonly buttonAssistantVisible: WritableSignal<boolean>;
  readonly buttonAssistantAction: WritableSignal<Function>;
  readonly buttonPartialSaveAction: WritableSignal<Function>;
  readonly buttonSaveAndFinishAction: WritableSignal<Function>;
  readonly showProgressBar: WritableSignal<boolean>;
  readonly fullViewportContent: WritableSignal<boolean>;
  readonly buttonPartialSaveEnabled: WritableSignal<boolean>;
  readonly buttonSaveAndFinishEnabled: WritableSignal<boolean>;
  private buttonPartialSaveEnabledService: Subscription;
  private buttonSaveAndFinishEnabledService: Subscription;
  blurEffect: WritableSignal<boolean>;
  customClassTooltip = customClassTooltip;
  tooltipsProps = tooltipsProps;

  constructor() {
    this.profile = {};
    this.title = signal('');
    this.blurEffect = signal(false);
    this.showProgressBar = signal(false);
    this.fullViewportContent = signal(false);
    this.storageService = new Subscription();
    this.titleService = new Subscription();
    this.buttonAddVisible = signal(false);
    this.buttonAddAction = signal(() => {});
    this.buttonAddVisibleService = new Subscription();
    this.buttonAddActionService = new Subscription();
    this.buttonPartialSaveEnabled = signal(false);
    this.buttonSaveAndFinishEnabled = signal(false);
    this.buttonPartialSaveEnabledService = new Subscription();
    this.buttonSaveAndFinishEnabledService = new Subscription();

    this.buttonAssistantVisible = signal(false);
    this.buttonPartialSaveVisible = signal(false);
    this.buttonSaveAndFinishVisible = signal(false);
    this.buttonAssistantAction = signal(() => {});
    this.buttonPartialSaveAction = signal(() => {});
    this.buttonSaveAndFinishAction = signal(() => {});
    this.buttonAssistantVisibleService = new Subscription();
    this.buttonPartialSaveService = new Subscription();
    this.buttonPartialSaveActionService = new Subscription();
    this.buttonSaveAndFinishService = new Subscription();
    this.buttonSaveAndFinishActionService = new Subscription();
    this.buttonAssistantActionService = new Subscription();

    this.modalStateVisibleService = new Subscription();
    this.globalProgressBarVisibleService = new Subscription();
    this.fullViewportContentService = new Subscription();
    this._iconRegistry.addSvgIcon(
      'sparkles',
      this._sanitizer.bypassSecurityTrustResourceUrl('icons/sparkles.svg')
    );

    this._fullViewportContent$.fullViewportContent = true;
  }

  ngOnInit(): void {
    this.titleService = this._menu$.title$.subscribe((title) => {
      this.title = signal(title);
    });
    this.storageService = this._authStorage$.getItemObservable().subscribe({
      next: (data: Map<string, string>) => {
        if (data.has('id_token_claims_obj')) {
          this.showData();
        }
      },
    });
    this.showData();

    this.buttonAddVisibleService = this._buttonHeader$.visibleAdd$.subscribe({
      next: (visible: boolean) => {
        this.buttonAddVisible.set(visible);
      },
    });

    this.buttonAddActionService = this._buttonHeader$.actionAdd$.subscribe({
      next: (action: Function) => {
        this.buttonAddAction.set(action);
      },
    });

    this.buttonPartialSaveService =
      this._buttonHeader$.visiblePartialSave$.subscribe({
        next: (visible: boolean) => {
          this.buttonPartialSaveVisible.set(visible);
        },
      });

    this.buttonPartialSaveActionService =
      this._buttonHeader$.actionPartialSave$.subscribe({
        next: (action: Function) => {
          this.buttonPartialSaveAction.set(action);
        },
      });

    this.buttonSaveAndFinishService =
      this._buttonHeader$.visibleSaveAndFinish$.subscribe({
        next: (visible: boolean) => {
          this.buttonSaveAndFinishVisible.set(visible);
        },
      });

    this.buttonSaveAndFinishActionService =
      this._buttonHeader$.actionSaveAndFinish$.subscribe({
        next: (action: Function) => {
          this.buttonSaveAndFinishAction.set(action);
        },
      });

    this.buttonAssistantVisibleService =
      this._buttonHeader$.visibleAssistant$.subscribe({
        next: (visible: boolean) => {
          this.buttonAssistantVisible.set(visible);
        },
      });

    this.buttonAssistantActionService =
      this._buttonHeader$.actionAssistant$.subscribe({
        next: (action: Function) => {
          this.buttonAssistantAction.set(action);
        },
      });

    this.modalStateVisibleService = this._modalState$.state$.subscribe({
      next: (visible: boolean) => {
        this.blurEffect.set(visible);
      },
    });

    this.blurEffect.set(this._modalState$.state);

    this.globalProgressBarVisibleService =
      this._globalProgressBar$.visible$.subscribe({
        next: (visible: boolean) => {
          this.showProgressBar.set(visible);
        },
      });

    this.showProgressBar.set(this._globalProgressBar$.visible);

    this.fullViewportContentService =
      this._fullViewportContent$.fullViewportContent$.subscribe({
        next: (fullViewportContent: boolean) => {
          this.fullViewportContent.set(fullViewportContent);
        },
      });

    this.buttonPartialSaveEnabledService =
      this._buttonHeader$.enabledPartialSave$.subscribe({
        next: (enabled: boolean) => {
          console.log('enabledPartialSave', enabled);
          this.buttonPartialSaveEnabled.set(enabled);
        },
      });

    this.buttonSaveAndFinishEnabledService =
      this._buttonHeader$.enabledSaveAndFinish$.subscribe({
        next: (enabled: boolean) => {
          console.log('enabledSaveAndFinish', enabled);
          this.buttonSaveAndFinishEnabled.set(enabled);
        },
      });
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
    this.fullViewportContentService.unsubscribe();
    this.buttonPartialSaveService.unsubscribe();
    this.buttonPartialSaveActionService.unsubscribe();
    this.buttonSaveAndFinishService.unsubscribe();
    this.buttonSaveAndFinishActionService.unsubscribe();
    this.buttonPartialSaveEnabledService.unsubscribe();
    this.buttonSaveAndFinishEnabledService.unsubscribe();
  }

  showData(): void {
    this.profile = this._auth$.getProfile();
  }

  logOut(): void {
    this._auth$.logout();
    this._router.navigate(['/login']);
  }
}
