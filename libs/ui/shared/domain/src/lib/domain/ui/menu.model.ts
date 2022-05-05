import { Observable } from 'rxjs';

export interface MenuData {
  icon?: string;
  title$?: Observable<string>;
  subtitle$?: Observable<string>;
  disabled$?: Observable<boolean>;
  visible$?: Observable<boolean>;
  callback?: (parameters?: never) => void;
  parameters?: never;
  route?: string[] | string | null;
}
