import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { StatCard } from '../models/stat-card.model';

@Injectable({ providedIn: 'root' })
export class HomeApiService {
  getStats(): Observable<StatCard[]> {
    return of([
      { id: '1', label: 'Components', value: '12', icon: '🧩' },
      { id: '2', label: 'Modules', value: '4', icon: '📦' },
      { id: '3', label: 'Lines of Code', value: '1,200+', icon: '📝' },
    ]).pipe(delay(600));
  }
}
