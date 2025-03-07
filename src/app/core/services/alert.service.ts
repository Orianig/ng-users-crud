import { Injectable, inject } from '@angular/core';
import { HttpResponseBase } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Utilities } from '../../shared/utilities';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private messages = new Subject<AlertCommand>();

  private loadingMessageTimeoutId: ReturnType<typeof setTimeout> | undefined;

  showMessage(summary: string): void;
  showMessage(summary: string, detail: string | null, severity: MessageSeverity): void;
  showMessage(summaryAndDetails: string[], summaryAndDetailsSeparator: string, severity: MessageSeverity): void;
  showMessage(data: string | string[], separatorOrDetail?: string | null, severity?: MessageSeverity) {
    if (!severity) {
      severity = MessageSeverity.default;
    }

    if (Array.isArray(data)) {
      for (const message of data) {
        const msgObject = Utilities.splitInTwo(message, separatorOrDetail ?? '');

        this.showMessageHelper(msgObject.firstPart, msgObject.secondPart, severity, false);
      }
    } else {
      this.showMessageHelper(data, separatorOrDetail, severity, false);
    }
  }

  showStickyMessage(summary: string): void;
  showStickyMessage(summary: string, detail: string | null, severity: MessageSeverity, error?: unknown): void;
  showStickyMessage(summary: string, detail: string | null, severity: MessageSeverity, error?: unknown, onRemove?: () => void): void;
  showStickyMessage(summaryAndDetails: string[], summaryAndDetailsSeparator: string, severity: MessageSeverity): void;
  showStickyMessage(data: string | string[], separatorOrDetail?: string | null, severity?: MessageSeverity, error?: unknown, onRemove?: () => void) {

    if (!severity) {
      severity = MessageSeverity.default;
    }

    if (Array.isArray(data)) {
      for (const message of data) {
        const msgObject = Utilities.splitInTwo(message, separatorOrDetail ?? '');

        this.showMessageHelper(msgObject.firstPart, msgObject.secondPart, severity, true);
      }
    } else {
      if (error) {
        const msg = `Severity: "${MessageSeverity[severity]}", Summary: "${data}", Detail: "${separatorOrDetail}", Error: "${Utilities.stringify(error)}"`;

        switch (severity) {
          case MessageSeverity.default:
            this.logInfo(msg);
            break;
          case MessageSeverity.info:
            this.logInfo(msg);
            break;
          case MessageSeverity.success:
            this.logMessage(msg);
            break;
          case MessageSeverity.error:
            this.logError(msg);
            break;
          case MessageSeverity.warn:
            this.logWarning(msg);
            break;
          case MessageSeverity.wait:
            this.logTrace(msg);
            break;
        }
      }

      this.showMessageHelper(data, separatorOrDetail, severity, true, onRemove);
    }
  }

  private showMessageHelper(summary: string, detail: string | null | undefined, severity: MessageSeverity, isSticky: boolean, onRemove?: () => void) {
    if (detail === null)
      detail = undefined;

    const alertCommand: AlertCommand = {
      operation: isSticky ? 'add_sticky' : 'add',
      message: { severity, summary, detail },
      onRemove
    };

    this.messages.next(alertCommand);
  }

  resetStickyMessage() {
    this.messages.next({ operation: 'clear' });
  }

  startLoadingMessage(message = 'Loading...', caption = '') {
    clearTimeout(this.loadingMessageTimeoutId);

    if (!caption) {
      caption = message;
      message = '';
    }

    this.loadingMessageTimeoutId = setTimeout(() => {
      this.showStickyMessage(caption, message, MessageSeverity.wait);
    }, 1000);
  }

  stopLoadingMessage() {
    clearTimeout(this.loadingMessageTimeoutId);
    this.resetStickyMessage();
  }

  showValidationError() {
    this.resetStickyMessage();
    this.showStickyMessage('Error caption', 'Error message', MessageSeverity.error);
  }

  logDebug(msg: unknown) {
    console.debug(msg);
  }

  logError(msg: unknown) {
    console.error(msg);
  }

  logInfo(msg: unknown) {
    console.info(msg);
  }

  logMessage(msg: unknown) {
    console.log(msg);
  }

  logTrace(msg: unknown) {
    console.trace(msg);
  }

  logWarning(msg: unknown) {
    console.warn(msg);
  }

  getMessageEvent(): Observable<AlertCommand> {
    return this.messages.asObservable();
  }
}


export class AlertCommand {
  constructor(
    public operation: 'clear' | 'add' | 'add_sticky',
    public message?: AlertMessage,
    public onRemove?: () => void) { }
}

export class AlertMessage {
  constructor(
    public severity: MessageSeverity,
    public summary: string,
    public detail?: string | undefined) { }
}

export enum MessageSeverity {
  default,
  info,
  success,
  error,
  warn,
  wait
}
