import { IResource, Resource } from '@hal-form-client';

export interface IThemeModel extends IResource {
  primaryColor?: string;
  accentColor?: string;
  warnColor?: string;
}

export class ThemeModel extends Resource implements IThemeModel {
  primaryColor?: string;
  accentColor?: string;
  warnColor?: string;
}
