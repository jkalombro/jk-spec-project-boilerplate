import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCardComponent {
  // Inputs
  readonly icon = input('');
  readonly value = input('');
  readonly label = input('');
}
