import { Injectable } from '@nestjs/common';

@Injectable()
export class MessageFormatterService {
  public format(message: string) {
    return `${new Date().toUTCString()}   ${message}`;
  }
}
