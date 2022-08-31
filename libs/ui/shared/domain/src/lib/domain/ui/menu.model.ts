import { Observable } from 'rxjs';

export interface MenuData {
  id?: string;
  icon?: string;
  title$?: Observable<string>;
  subtitle$?: Observable<string>;
  disabled$?: Observable<boolean>;
  visible$?: Observable<boolean>;
  callback?: (parameters?: { [key: string]: unknown }) => void;
  parameters?: { [key: string]: unknown };
  route?: string[] | string | null;
}
