import React from 'react';
import PokemonType from './PokemonType';

interface Pokemon {
    name: string;
    url: string;
    image: string;
    types: string[];
    base_experience: number;
}

interface PokemonType {
    type: {
        name: string;
    };
}

interface PokemonCardGridProps {
    pokemonList: Pokemon[];
    handleCardClick: (pokemon: Pokemon) => void; // Function type for handling clicks
}

const PokemonCardGrid: React.FC<PokemonCardGridProps> = ({ pokemonList, handleCardClick }) => {
    return (
        <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                {pokemonList.map((pokemon, index) => (
                    <div
                        key={index}
                        className="pokemon-card bg-white rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 p-6 flex flex-col items-center custom-width cursor-pointer"
                        onClick={() => handleCardClick(pokemon)} // Open modal on card click
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={pokemon.image}
                            alt={pokemon.name}
                            className="w-32 h-32 object-cover mb-4"
                        />
                        <h2 className="capitalize text-xl font-semibold mb-2">{pokemon.name}</h2>
                        <p className="text-gray-500 mb-2">Base Experience: {pokemon.base_experience}</p>
                        <div className="flex space-x-2 mb-4">
                            {pokemon.types.map((type, typeIndex) => (
                                <PokemonType key={typeIndex} type={type} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PokemonCardGrid;
