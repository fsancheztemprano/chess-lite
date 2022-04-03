import { Observable } from 'rxjs';

export interface MenuData {
  icon: string;
  title: string;
  subtitle?: string;
  link?: string;
  canShow?: Observable<boolean>;
  callback?: () => void;
}
