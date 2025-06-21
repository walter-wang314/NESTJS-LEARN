import { Injectable } from '@nestjs/common';
import { MessageFormatterService } from 'src/message-formatter/message-formatter.service';

@Injectable()
export class LoggerService {
  constructor(private readonly messageFormatter: MessageFormatterService) {}

  public log(logInfor: string) {
    return this.messageFormatter.format(logInfor);
  }
}
