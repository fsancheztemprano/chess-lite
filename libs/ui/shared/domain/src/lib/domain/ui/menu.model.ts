import { Observable } from 'rxjs';

export interface MenuData {
  icon?: string;
  title?: string;
  title$?: Observable<string>;
  subtitle?: string;
  subtitle$?: Observable<string>;
  disabled$?: Observable<boolean>;
  canShow?: Observable<boolean>;
  callback?: (parameters?: never) => void;
  parameters?: never;
  route?: string;
}
