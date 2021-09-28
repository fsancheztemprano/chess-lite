export interface TabLink {
  target: string[];
  label: string;
}

export interface HeaderConfig {
  navigationLink?: string[];
  title?: string;
  titleRation?: number;
  tabs?: TabLink[];
  tabsRation?: number;
  showContextMenu?: boolean;
}
