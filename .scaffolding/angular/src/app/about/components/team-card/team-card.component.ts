import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TeamMember } from '../../store/models/team-member.model';

@Component({
  selector: 'app-team-card',
  standalone: true,
  templateUrl: './team-card.component.html',
  styleUrls: ['./team-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamCardComponent {
  // Inputs
  readonly member = input.required<TeamMember>();
}
