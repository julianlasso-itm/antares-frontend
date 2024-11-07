import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer } from '@angular/platform-browser';
import { ButtonHeaderService } from '../../services/button-header.service';
import { FullViewportContentService } from '../../services/full-viewport-content.service';
import { SearchBarService } from '../../services/search-bar.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly _buttonHeader$ = inject(ButtonHeaderService);
  private readonly _iconRegistry = inject(MatIconRegistry);
  private readonly _sanitizer = inject(DomSanitizer);
  private readonly _fullViewportContent$ = inject(FullViewportContentService);
  private readonly _searchBar$ = inject(SearchBarService);

  constructor() {
    this._fullViewportContent$.fullViewportContent = false;
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
    this._buttonHeader$.visibleAdd = false;
    this._buttonHeader$.visibleAssistant = false;
    this._buttonHeader$.actionAdd = () => {};
    this._searchBar$.placeholder = '';
    this._searchBar$.disabled = true;
  }
}
