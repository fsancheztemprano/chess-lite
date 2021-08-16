import { Subject } from 'rxjs';

export interface MenuOption {
  onClick: () => void;
  label: string;
  icon?: string;
  disabled?: Subject<boolean>;
}
