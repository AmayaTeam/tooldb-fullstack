import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ModalContextType {
  modalContent: any;
  setModalContent: (content: any) => void;

  isShowingModal: boolean;
  setModal: (show: boolean) => void;
}

const defaultContextValue: ModalContextType = {
  modalContent: null,
  setModalContent: () => { },

  isShowingModal: false,
  setModal: () => { }
};

const ModalContext = createContext<ModalContextType>(defaultContextValue);

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isShowingModal, setModal] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<any>(null);

  return (
    <ModalContext.Provider value={{ isShowingModal, setModal, modalContent, setModalContent }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);