import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export enum LogLevel {
  Info = 'INFO',
  Warn = 'WARN',
  Error = 'ERROR'
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
}

@Injectable({ providedIn: 'root' })
export class LoggerService {
  private _log$ = new Subject<LogEntry>();

  public log$: Observable<LogEntry> = this._log$.asObservable();

  public log(message: string): void {
    this._emit(LogLevel.Info, message);
    console.log('[INFO]', message);
  }

  public warn(message: string): void {
    this._emit(LogLevel.Warn, message);
    console.warn('[WARN]', message);
  }

  public error(message: string): void {
    this._emit(LogLevel.Error, message);
    console.error('[ERROR]', message);
  }

  private _emit(level: LogLevel, message: string): void {
    this._log$.next({ level, message, timestamp: new Date() });
  }
}
