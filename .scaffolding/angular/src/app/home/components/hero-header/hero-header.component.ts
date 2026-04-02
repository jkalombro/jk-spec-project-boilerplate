import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hero-header',
  templateUrl: './hero-header.component.html',
  styleUrls: ['./hero-header.component.scss'],
})
export class HeroHeaderComponent {
  @Input() icon = '🏠';
  @Input() title = '';
  @Input() subtitle = '';
}
