import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer } from '@angular/platform-browser';
import { ButtonHeaderService } from '../../services/button-header.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly _buttonHeaderService = inject(ButtonHeaderService);
  private readonly _iconRegistry = inject(MatIconRegistry);
  private readonly _sanitizer = inject(DomSanitizer);

  constructor() {
    this._iconRegistry.addSvgIcon(
      'angular',
      this._sanitizer.bypassSecurityTrustResourceUrl('icons/angular.svg')
    );
    this._iconRegistry.addSvgIcon(
      'nodejs',
      this._sanitizer.bypassSecurityTrustResourceUrl('icons/node-js.svg')
    );
    this._iconRegistry.addSvgIcon(
      'mongodb',
      this._sanitizer.bypassSecurityTrustResourceUrl('icons/mongodb.svg')
    );
  }

  ngOnInit(): void {
    this._buttonHeaderService.visibleAdd = false;
    this._buttonHeaderService.visibleAssistant = false;
    this._buttonHeaderService.actionAdd = () => {};
  }
}
