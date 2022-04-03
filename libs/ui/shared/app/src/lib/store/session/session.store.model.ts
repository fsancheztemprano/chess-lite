import { User, UserPreferences } from '@app/ui/shared/domain';

export interface SessionProps {
  user?: User;
  userPreferences?: UserPreferences;
}
