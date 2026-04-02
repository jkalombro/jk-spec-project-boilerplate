import { Component, Input } from '@angular/core';

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss']
})
export class BadgeComponent {
  @Input() public label = '';
  @Input() public variant: BadgeVariant = 'primary';
}
