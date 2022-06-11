import { ThemePalette } from '@angular/material/core';
import { Template } from '@hal-form-client';

interface ButtonData {
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

export interface TextInputDialogData extends ConfirmationDialogData {
  inputs: TextInputDialogInput[];
  template?: Template | null;
}

export interface TextInputDialogInput {
  key: string;
  value?: string;
  options?: {
    defaultValue?: string;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
  };
}
