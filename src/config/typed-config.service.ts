import { ConfigType } from './config.types';
import { ConfigService } from '@nestjs/config';

export class TypedConfigService extends ConfigService<ConfigType> {}
