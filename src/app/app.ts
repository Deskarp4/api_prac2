import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class AppComponent {
  protected readonly title = signal('api-app');
}
