import { Injectable } from '@nestjs/common';

@Injectable()
export class CatsService {
  getCatsMeow(): string {
    return 'Cats Meow';
  }
}
