import { IResource, Resource } from '@hal-form-client';

export interface IThemeModel extends IResource {
  colors?: {
    primary?: string;
    accent?: string;
    warn?: string;
  };
}

export class ThemeModel extends Resource implements IThemeModel {
  colors?: {
    primary?: string;
    accent?: string;
    warn?: string;
  };
}
