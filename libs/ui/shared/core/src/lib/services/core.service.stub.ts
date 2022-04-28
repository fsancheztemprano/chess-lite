import { CoreService } from './core.service';

export const stubCoreServiceProvider = {
  provide: CoreService,
  useClass: CoreService,
};
