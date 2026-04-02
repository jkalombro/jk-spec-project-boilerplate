import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger';

@Component({
  selector: 'app-badge',
  standalone: true,
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent {
  // Inputs
  readonly label = input('');
  readonly variant = input<BadgeVariant>('primary');
}
