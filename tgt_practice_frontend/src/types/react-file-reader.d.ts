declare module 'react-file-reader' {
  import { Component } from 'react';

  interface ReactFileReaderProps {
    fileTypes?: string[];
    base64?: boolean;
    multipleFiles?: boolean;
    handleFiles: (files: FileList | string[]) => void;
  }

  class ReactFileReader extends Component<ReactFileReaderProps> {}

  export default ReactFileReader;
}
