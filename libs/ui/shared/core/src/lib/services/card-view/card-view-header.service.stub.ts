import { CardViewHeaderService } from './card-view-header.service';

export const stubCardViewHeaderServiceProvider = {
  provide: CardViewHeaderService,
  useClass: CardViewHeaderService,
};
