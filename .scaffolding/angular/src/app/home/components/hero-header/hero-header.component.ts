import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-hero-header',
  standalone: true,
  templateUrl: './hero-header.component.html',
  styleUrls: ['./hero-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroHeaderComponent {
  // Inputs
  readonly icon = input('🏠');
  readonly title = input('');
  readonly subtitle = input('');
}
