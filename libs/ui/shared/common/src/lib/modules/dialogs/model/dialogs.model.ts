import { ThemePalette } from '@angular/material/core';
import { Template } from '@hal-form-client';

export enum DialogType {
  INFORMATION = 'information',
  CONFIRMATION = 'confirmation',
  INPUT = 'input',
}

export interface ButtonData {
  text?: string;
  icon?: string;
  color?: ThemePalette;
  disabled?: boolean;
}

export interface InformationDialogData {
  icon?: string;
  title?: string;
  caption?: string;
  dismissButton?: ButtonData;
}

export interface ConfirmationDialogData extends InformationDialogData {
  acceptButton?: ButtonData;
}

export interface InputDialogData extends ConfirmationDialogData {
  inputs: InputDialogInput[];
  template?: Template | null;
}

export enum InputDialogType {
  text = 'text',
  password = 'password',
  email = 'email',
  number = 'number',
  date = 'date',
  time = 'time',
  datetime = 'datetime',
  color = 'color',
  checkbox = 'checkbox',
  toggle = 'toggle',
  textarea = 'textarea',
  hidden = 'hidden',
  file = 'file',
  image = 'image',
}

export interface InputDialogInput {
  id?: string;
  key: string;
  value?: string;
  type?: string | InputDialogType;
  options?: {
    defaultValue?: string;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
  };
}
