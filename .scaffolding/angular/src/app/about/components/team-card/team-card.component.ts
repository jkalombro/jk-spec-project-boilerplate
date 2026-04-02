import { Component, Input } from '@angular/core';
import { TeamMember } from '../../store/models/team-member.model';

@Component({
  selector: 'app-team-card',
  templateUrl: './team-card.component.html',
  styleUrls: ['./team-card.component.scss'],
})
export class TeamCardComponent {
  @Input() member!: TeamMember;
}
