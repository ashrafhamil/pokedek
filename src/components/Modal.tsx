// Modal.tsx
import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onContinue: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onContinue }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
                <h2 className="text-xl font-bold mb-4">A wild Rattata has appeared!</h2>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/rattata.png" alt="Rattata" className="w-32 h-32 mx-auto mb-4" />
                {/* <p className="mb-4">Jauh beno scroll nye. Udoh le tu. Baik le buat roje</p> */}
                <div className="flex justify-between">
                    <button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-4 rounded">
                        Flee
                    </button>
                    <button onClick={onContinue} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
                        Fight
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
