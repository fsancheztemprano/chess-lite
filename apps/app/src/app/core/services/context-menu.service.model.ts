import { Observable } from 'rxjs';

export interface MenuOption {
  onClick: () => void;
  label: string;
  icon?: string;
  disabled?: Observable<boolean>;
}
