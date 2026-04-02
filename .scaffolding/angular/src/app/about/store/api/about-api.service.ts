import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { TeamMember } from '../models/team-member.model';

@Injectable({ providedIn: 'root' })
export class AboutApiService {
  getTeamMembers(): Observable<TeamMember[]> {
    return of([
      {
        id: '1',
        name: 'Jeric Alombro',
        role: 'Lead Engineer',
        bio: 'Architecting scalable frontends with a passion for clean code and great DX.',
      },
      {
        id: '2',
        name: 'Alex Reyes',
        role: 'UI/UX Designer',
        bio: 'Crafting intuitive interfaces that balance aesthetics with usability.',
      },
      {
        id: '3',
        name: 'Dana Cruz',
        role: 'Backend Engineer',
        bio: 'Building robust APIs and ensuring the stack runs smooth end-to-end.',
      },
    ]).pipe(delay(700));
  }
}
