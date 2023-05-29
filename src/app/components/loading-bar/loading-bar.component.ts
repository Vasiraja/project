import { Component, Input } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-loading-bar',
  templateUrl: './loading-bar.component.html',
  styleUrls: ['./loading-bar.component.scss'],
  animations: [
    trigger('loadingAnimation', [
      state('idle', style({ width: '0%' })),
      state('loading', style({ width: '100%' })),
      transition('idle <=> loading', animate('1s ease-in-out'))
    ])
  ]
})
export class LoadingBarComponent {
  @Input() isLoading: boolean | undefined;
}
