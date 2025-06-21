import { Controller, Get } from '@nestjs/common';
import { CatsService } from './cats.service';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  getAllCats(): string[] {
    return ['Cat Lucy', 'Cat Author'];
  }

  @Get()
  getCatAction(): string {
    return this.catsService.getCatsMeow();
  }
}
