import { Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingService } from '../../services/loading.service';


@Component({
  selector: 'app-loading-spinner',
  imports: [
    MatProgressSpinnerModule,
  ],
  template: `
    @if (loadingService.loading()) {
    <div class="spinner-overlay">
      <mat-progress-spinner
        mode="indeterminate"
        diameter="70"
        strokeWidth="5">
      </mat-progress-spinner>
    </div>
}
  `,
  styles: `
  .spinner-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }
  `,
})
export class LoadingSpinner {
  loadingService = inject(LoadingService);

}
