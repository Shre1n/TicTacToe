import { ExceptionSource } from './exceptionSource';

export class ExceptionObject {
  source: ExceptionSource;
  message: string;

  constructor(source: ExceptionSource, message: string) {
    this.source = source;
    this.message = message;
  }
}
