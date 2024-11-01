import React, { useState, useEffect } from 'react';
import PokemonType from './PokemonType';

interface Ability {
    name: string;
    description: string;
}

interface Pokemon {
    name: string;
    image: string;
    base_experience: number;
    types: string[];
    weight: number;
    height: number;
    abilities: Ability[];
}

interface PokemonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onContinue: () => void;
    selectedPokemon: Pokemon | null;
}

const PokemonModal: React.FC<PokemonModalProps> = ({
    isOpen,
    onClose,
    onContinue,
    selectedPokemon,
}) => {
    const [visibleAbility, setVisibleAbility] = useState<number | null>(null);

    // Reset visibleAbility when the modal is closed
    useEffect(() => {
        if (!isOpen) {
            setVisibleAbility(null);
        }
    }, [isOpen]);

    if (!isOpen || !selectedPokemon) return null;

    const meters = selectedPokemon.height / 10; // height in meters

    const toggleAbilityDescription = (index: number) => {
        if (visibleAbility === index) {
            setVisibleAbility(null); // Hide the description if already visible
        } else {
            setVisibleAbility(index); // Show the description for the selected ability
        }
    };

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
                <p className="text-gray-500 mb-2">Weight: {selectedPokemon.weight}</p>
                <p className="text-gray-500 mb-2">Height: {meters.toFixed(2)} m</p>

                <div className="mb-4">
                    <h3 className="text-lg font-semibold">Abilities:</h3>
                    <ul className="list-disc list-inside">
                        {selectedPokemon.abilities.map((ability, index) => (
                            <li key={index} className="flex items-center text-gray-500 mb-1">
                                {ability.name}
                                <button
                                    className="ml-2 text-blue-500 hover:underline"
                                    onClick={() => toggleAbilityDescription(index)}
                                    aria-label="Show ability description"
                                >
                                    {visibleAbility === index ? 'Hide' : 'Info'}
                                </button>
                                {visibleAbility === index && (
                                    <p className="text-gray-400 ml-2">{ability.description}</p>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex space-x-2 mb-4">
                    {selectedPokemon.types.map((type, index) => (
                        <PokemonType key={index} type={type} />
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
