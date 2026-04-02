import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserApiService {
  getUserProfile(): Observable<User> {
    return of({
      id: '1',
      name: 'Jeric Alombro',
      email: 'jeric@example.com',
      avatarUrl: 'https://i.pravatar.cc/40?u=jeric',
    }).pipe(delay(500));
  }
}
