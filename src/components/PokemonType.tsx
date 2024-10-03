// src/components/PokemonType.tsx
import React from 'react';
import { Tooltip } from '@nextui-org/react';

interface PokemonTypeProps {
    type: string;
}

const typeColors: Record<string, string> = {
    fire: 'bg-red-500 text-white',
    water: 'bg-blue-500 text-white',
    grass: 'bg-green-500 text-white',
    electric: 'bg-yellow-400 text-white',
    psychic: 'bg-pink-500 text-white',
    ice: 'bg-sky-400 text-white',
    dragon: 'bg-indigo-600 text-white',
    ghost: 'bg-purple-700 text-white',
    dark: 'bg-gray-800 text-white',
    fairy: 'bg-pink-300 text-white',
    normal: 'bg-gray-300 text-white',
    fighting: 'bg-red-600 text-white',
    bug: 'bg-green-400 text-white',
    rock: 'bg-yellow-700 text-white',
    ground: 'bg-yellow-600 text-white',
    steel: 'bg-gray-400 text-white',
    flying: 'bg-blue-400 text-white',
    poison: 'bg-purple-500 text-white',
};

// Object to define type advantages
const typeStrengths: Record<string, string[]> = {
    fire: ['grass', 'bug', 'ice', 'steel'],
    water: ['fire', 'ground', 'rock'],
    grass: ['water', 'ground', 'rock'],
    electric: ['water', 'flying'],
    psychic: ['fighting', 'poison'],
    ice: ['grass', 'ground', 'flying', 'dragon'],
    dragon: ['dragon'],
    ghost: ['psychic', 'ghost'],
    dark: ['ghost', 'psychic'],
    fairy: ['fighting', 'dragon', 'dark'],
    normal: [],
    fighting: ['normal', 'ice', 'rock', 'dark', 'steel'],
    bug: ['grass', 'psychic', 'dark'],
    rock: ['fire', 'ice', 'flying', 'bug'],
    ground: ['fire', 'electric', 'poison', 'rock'],
    steel: ['ice', 'fairy', 'rock'],
    flying: ['grass', 'fighting', 'bug'],
    poison: ['grass', 'fairy'],
};

const PokemonType: React.FC<PokemonTypeProps> = ({ type }) => {
    const getTypeClass = (type: string) => {
        return typeColors[type] || 'bg-gray-200 text-gray-800'; // Default color if type is unknown
    };

    // Get strong types based on the current type
    const strongAgainst = typeStrengths[type]?.join(', ') || 'none';

    return (
        <Tooltip
            content={`This type is strong against: ${strongAgainst}`}
            placement="top"
            className="bg-white text-black shadow-lg px-2 rounded-md" // Add padding here
        >
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeClass(type)}`}>
                {type}
            </span>
        </Tooltip>
    );
};

export default PokemonType;
