import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { SearchBarService } from '../../../../services/search-bar.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatRippleModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  @ViewChild('searchInput') searchInput!: ElementRef;
  private readonly _searchBar$ = inject(SearchBarService);
  private _searchSubscription: Subscription;
  private _clearSubscription: Subscription;
  private _disabledSubscription: Subscription;
  readonly placeholder: WritableSignal<string>;
  readonly disabled: WritableSignal<boolean>;

  constructor() {
    this.placeholder = signal('');
    this._searchSubscription = new Subscription();
    this._clearSubscription = new Subscription();
    this._disabledSubscription = new Subscription();
    this.disabled = signal(this._searchBar$.disabled);
  }

  ngOnInit(): void {
    this._searchSubscription = this._searchBar$.placeholder$.subscribe({
      next: (placeholder) => this.placeholder.set(placeholder),
    });
    this._clearSubscription = this._searchBar$.clear$.subscribe({
      next: (clear) => {
        if (clear) {
          this.searchInput.nativeElement.value = '';
        }
      },
    });
    this._disabledSubscription = this._searchBar$.disabled$.subscribe({
      next: (disabled) => this.disabled.set(disabled),
    });
  }

  ngOnDestroy(): void {
    this._searchSubscription.unsubscribe();
    this._clearSubscription.unsubscribe();
    this._disabledSubscription.unsubscribe();
  }

  onSearch(search: string): void {
    this._searchBar$.search = search;
  }

  clearSearch(): void {
    this._searchBar$.clear = true;
    this.onSearch('');
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.clearSearch();
    }
  }
}
