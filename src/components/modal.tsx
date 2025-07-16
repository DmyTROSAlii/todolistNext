"use client";

import { CircleX } from "lucide-react";

interface ModalProps {
  children: React.ReactNode;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const Modal = ({ children, visible, setVisible }: ModalProps) => {
  return (
    <div className={`fixed top-0 left-0 bottom-0 right-0 bg-black/50 z-50 justify-center items-center ${visible ? `flex` : `hidden`}`}>
      <div className="p-6 bg-white mw-[250px] relative rounded-lg shadow-lg">
        <CircleX
          size={20}
          className="absolute top-1 right-2 cursor-pointer"
          onClick={() => setVisible(false)}
        ></CircleX>
        {children}
      </div>
    </div>
  );
};

export default Modal;