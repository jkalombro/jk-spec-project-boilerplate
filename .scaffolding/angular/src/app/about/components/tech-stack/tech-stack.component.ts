import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-tech-stack',
  standalone: true,
  templateUrl: './tech-stack.component.html',
  styleUrls: ['./tech-stack.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechStackComponent {
  // Inputs
  readonly technologies = input<string[]>([]);
}
