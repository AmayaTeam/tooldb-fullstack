export enum LevelName {
    Group,
    Type,
    Module
  };
  
  interface Option {
    optionName: string,
    command: () => void,
  }
  
  export type { Option };
  