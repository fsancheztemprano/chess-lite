export interface TabLink {
  target: string[];
  label: string;
}

export interface HeaderConfig {
  navigationLink?: string[];
  title?: string;
  titleRatio?: number;
  tabs?: TabLink[];
  tabsRatio?: number;
  showContextMenu?: boolean;
}
