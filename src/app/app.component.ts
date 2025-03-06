import { ChangeDetectorRef, Component, signal, inject } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { RouterOutlet } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MaterialModule } from './shared/material.module';
import { LayoutModule } from './shared/layout/layout.module';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LayoutModule, MaterialModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  private readonly _mobileQueryListener: () => void;
  title = 'ng-users-crud';
  showFiller = signal<Boolean>(false);
  mobileQuery: MediaQueryList;

  constructor() {
    const changeDetectorRef = inject(ChangeDetectorRef);
    const media = inject(MediaMatcher);
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.addEventListener(this.mobileQuery, this._mobileQueryListener);
  }

  ngOnDestroy() {
    this.removeEventListener(this.mobileQuery, this._mobileQueryListener);
  }

  private addEventListener(mediaQuery: MediaQueryList, listener: () => void) {
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", listener)
    } else {
      mediaQuery.addListener(listener); // https://github.com/mdn/sprints/issues/858 for Safari < 14
    }
  }

  private removeEventListener(mediaQuery: MediaQueryList, listener: () => void) {
    if (typeof mediaQuery.removeEventListener === "function") {
      mediaQuery.removeEventListener("change", listener,)
    } else {
      mediaQuery.removeListener(listener); // https://github.com/mdn/sprints/issues/858 for Safari < 14
    }
  }

  toggleFiller() {
    this.showFiller.set(!this.showFiller());
  }
}
