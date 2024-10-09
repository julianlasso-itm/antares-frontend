import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, signal, ViewChild, WritableSignal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { SearchBarService } from '../../../../services/search-bar.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  @ViewChild('searchInput') searchInput!: ElementRef;
  private readonly _searchBarService = inject(SearchBarService);
  private _searchSubscription: Subscription;
  private _clearSubscription: Subscription;
  readonly placeholder: WritableSignal<string>;

  constructor() {
    this.placeholder = signal('');
    this._searchSubscription = new Subscription();
    this._clearSubscription = new Subscription();
  }

  ngOnInit(): void {
    this._searchSubscription = this._searchBarService.placeholder$.subscribe({
      next: (placeholder) => this.placeholder.set(placeholder),
    });
    this._clearSubscription = this._searchBarService.clear$.subscribe({
      next: (clear) => {
        if (clear) {
          this.searchInput.nativeElement.value = '';
        }
      },
    });
  }

  ngOnDestroy(): void {
    this._searchSubscription.unsubscribe();
    this._clearSubscription.unsubscribe();
  }

  onSearch(search: string): void {
    this._searchBarService.search = search;
  }
}
