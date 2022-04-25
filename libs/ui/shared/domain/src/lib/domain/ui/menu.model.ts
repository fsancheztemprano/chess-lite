import { Observable } from 'rxjs';

export interface MenuData {
  icon?: string;
  title?: string;
  title$?: Observable<string>;
  subtitle?: string;
  subtitle$?: Observable<string>;
  link?: string;
  canShow?: Observable<boolean>;
  callback?: () => void;
}
