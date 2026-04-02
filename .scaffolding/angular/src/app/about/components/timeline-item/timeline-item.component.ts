import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-timeline-item',
  standalone: true,
  templateUrl: './timeline-item.component.html',
  styleUrls: ['./timeline-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineItemComponent {
  // Inputs
  readonly emoji = input('');
  readonly title = input('');
  readonly desc = input('');
}
