import { ChangeDetectorRef, Component, signal, inject, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { RouterOutlet } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastaService, ToastaConfig, ToastOptions, ToastData, ToastaModule } from 'ngx-toasta';
import { MaterialModule } from './shared/material.module';
import { LayoutModule } from './shared/layout/layout.module';
import { AlertCommand, AlertService, MessageSeverity } from './core/services/alert.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LayoutModule, MaterialModule, ToastaModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  private toastaService = inject(ToastaService);
  private toastaConfig = inject(ToastaConfig);
  private alertService = inject(AlertService);
  private readonly _mobileQueryListener: () => void;
  title = 'ng-users-crud';
  mobileQuery: MediaQueryList;
  stickyToasties: number[] = [];

  constructor() {
    const changeDetectorRef = inject(ChangeDetectorRef);
    const media = inject(MediaMatcher);
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.addEventListener(this.mobileQuery, this._mobileQueryListener);
    this.initToastaConfig();
  }

  ngOnInit() {
    this.alertService.getMessageEvent().subscribe(message => this.showToast(message));
    setTimeout(() => {
      this.alertService.resetStickyMessage();
      this.alertService.showMessage('Nueva sesión', 'Bienvenido de vuelta', MessageSeverity.default);
    }, 1000)
  }

  ngOnDestroy() {
    this.removeEventListener(this.mobileQuery, this._mobileQueryListener);
  }

  initToastaConfig() {
    this.toastaConfig.theme = 'material';
    this.toastaConfig.position = 'top-right';
    this.toastaConfig.limit = 100;
    this.toastaConfig.showClose = true;
    this.toastaConfig.showDuration = false;
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

  showToast(alert: AlertCommand) {
    if (alert.operation === 'clear') {
      for (const id of this.stickyToasties.slice(0)) {
        this.toastaService.clear(id);
      }
      return;
    }

    const toastOptions: ToastOptions = {
      title: alert.message?.summary,
      msg: alert.message?.detail,
    };

    if (alert.operation === 'add_sticky') {
      toastOptions.timeout = 0;

      toastOptions.onAdd = (toast: ToastData) => {
        this.stickyToasties.push(toast.id);
      };

      toastOptions.onRemove = (toast: ToastData) => {
        const index = this.stickyToasties.indexOf(toast.id, 0);

        if (index > -1) {
          this.stickyToasties.splice(index, 1);
        }

        if (alert.onRemove) {
          alert.onRemove();
        }

        toast.onAdd = undefined;
        toast.onRemove = undefined;
      };
    } else {
      toastOptions.timeout = 4000;
    }

    switch (alert.message?.severity) {
      case MessageSeverity.default: this.toastaService.default(toastOptions); break;
      case MessageSeverity.info: this.toastaService.info(toastOptions); break;
      case MessageSeverity.success: this.toastaService.success(toastOptions); break;
      case MessageSeverity.error: this.toastaService.error(toastOptions); break;
      case MessageSeverity.warn: this.toastaService.warning(toastOptions); break;
      case MessageSeverity.wait: this.toastaService.wait(toastOptions); break;
    }
  }
}
