import { PropsWithChildren } from "react";

interface ModalProps {
  children: React.ReactNode;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const Modal = ({ children, visible, setVisible }: ModalProps) => {
  return (
    <div className={`fixed top-0 left-0 bottom-0 right-0 bg-black/50 z-50 justify-center items-center ${visible ? `flex` : `hidden`}`}>
      <div className="p-6 bg-white mw-[250px] relative rounded-lg shadow-lg">
        <span
          className="absolute top-2 right-2 text-black hover:text-gray-700 cursor-pointer"
          onClick={() => setVisible(false)}
        >x</span>
        {children}
      </div>
    </div>
  );
};

export default Modal;