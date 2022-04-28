import 'jest-preset-angular/setup-jest';

const style = global.document.createElement('style');
style.innerHTML = `
  .mat-theme-loaded-marker {
    display: none;
  }
`;
global.document.head.appendChild(style);
