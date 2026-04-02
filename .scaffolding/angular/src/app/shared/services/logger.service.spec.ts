import { TestBed } from '@angular/core/testing';
import { LoggerService, LogLevel } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggerService);
    spyOn(console, 'log').and.stub();
    spyOn(console, 'warn').and.stub();
    spyOn(console, 'error').and.stub();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log an info message', () => {
    service.log('test message');
    expect(console.log).toHaveBeenCalledWith('[INFO]', 'test message');
  });

  it('should log a warning message', () => {
    service.warn('watch out');
    expect(console.warn).toHaveBeenCalledWith('[WARN]', 'watch out');
  });

  it('should log an error message', () => {
    service.error('something broke');
    expect(console.error).toHaveBeenCalledWith('[ERROR]', 'something broke');
  });

  it('should emit log entries to the log$ observable', (done) => {
    service.log$.subscribe(entry => {
      expect(entry.level).toBe(LogLevel.Info);
      expect(entry.message).toBe('observable test');
      done();
    });
    service.log('observable test');
  });
});
