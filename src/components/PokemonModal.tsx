import React from 'react';
import PokemonType from './PokemonType'; // Import the PokemonType component

interface Pokemon {
    name: string;
    image: string;
    base_experience: number;
    types: string[];
}

interface PokemonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onContinue: () => void;
    selectedPokemon: Pokemon | null; // Ensure this prop is defined
}

const PokemonModal: React.FC<PokemonModalProps> = ({
    isOpen,
    onClose,
    onContinue,
    selectedPokemon,
}) => {
    if (!isOpen || !selectedPokemon) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-2">{selectedPokemon.name}</h2>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={selectedPokemon.image}
                    alt={selectedPokemon.name}
                    className="w-full h-48 object-contain mb-4"
                />
                <p className="text-gray-500 mb-2">Base Experience: {selectedPokemon.base_experience}</p>
                <div className="flex space-x-2 mb-4">
                    {selectedPokemon.types.map((type, index) => (
                        <PokemonType key={index} type={type} /> // Use PokemonType component here
                    ))}
                </div>
                <div className="flex justify-between">
                    <button className="bg-gray-300 rounded px-4 py-2" onClick={onClose}>
                        Close
                    </button>
                    <button className="bg-blue-500 text-white rounded px-4 py-2" onClick={onContinue}>
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PokemonModal;
