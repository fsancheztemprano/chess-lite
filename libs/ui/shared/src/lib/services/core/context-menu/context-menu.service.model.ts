import { Observable } from 'rxjs';

export interface MenuOption {
  callback?: () => void;
  observable?: Observable<unknown>;
  label?: string;
  icon?: string;
  disabled?: Observable<boolean>;
}
