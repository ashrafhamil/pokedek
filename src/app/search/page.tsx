'use client';

import { useState } from 'react';

interface PokemonData {
    name: string;
    image: string;
    height: number;
    weight: number;
    types: string;
    abilities: string; // Add this for abilities
    hp: number | undefined; // Add this for HP
    attack: number | undefined; // Add this for Attack
    defense: number | undefined; // Add this for Defense
    speed: number | undefined; // Add this for Speed
}

const PokemonSearchPage = () => {
    const [pokemonName, setPokemonName] = useState<string>('');
    const [pokemonData, setPokemonData] = useState<PokemonData | null>(null);
    const [error, setError] = useState<string>('');

    const getPokemon = async () => {
        const name = pokemonName.toLowerCase();
        if (!name) {
            setError('Please enter a Pokémon name');
            setPokemonData(null);
            return;
        }

        const url = `https://pokeapi.co/api/v2/pokemon/${name}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Pokémon not found');
            }
            const data = await response.json();
            setPokemonData({
                name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
                image: data.sprites.front_default,
                height: data.height / 10,
                weight: data.weight / 10,
                types: data.types.map((typeInfo: { type: { name: string } }) => typeInfo.type.name).join(', '),
                abilities: data.abilities.map((ability: { ability: { name: string } }) => ability.ability.name).join(', '),
                hp: data.stats.find((stat: { stat: { name: string } }) => stat.stat.name === 'hp')?.base_stat,
                attack: data.stats.find((stat: { stat: { name: string } }) => stat.stat.name === 'attack')?.base_stat,
                defense: data.stats.find((stat: { stat: { name: string } }) => stat.stat.name === 'defense')?.base_stat,
                speed: data.stats.find((stat: { stat: { name: string } }) => stat.stat.name === 'speed')?.base_stat,
            });
            setError('');
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred');
            }
            setPokemonData(null);
        }
    };

    return (
        <div
            style={{
                textAlign: 'center',
                backgroundImage: 'url(/images/grass_sky.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
                display: 'flex', // Use flexbox to center content vertically
                flexDirection: 'column', // Stack elements vertically
                justifyContent: 'center', // Center content vertically
                alignItems: 'center',
                padding: '15px',
            }}
        >
            <h1
                style={{
                    color: '#FFFFFF',
                    marginBottom: '20px',
                    fontWeight: 500,
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                }} className='text-3xl sm:text-4xl'
            >
                Search Pokémon
            </h1>

            <div
                onClick={() => window.history.back()}
                onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'black'; // 'old' color on hover
                    e.currentTarget.style.fontWeight = 'bold'; // Make text bold on hover
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#7f8c8d'; // Reset color on mouse leave
                    e.currentTarget.style.fontWeight = 'normal'; // Reset font weight on mouse leave
                }}
                style={{
                    position: 'fixed',
                    top: '20px',
                    left: '20px',
                    cursor: 'pointer',
                    color: '#7f8c8d', // Initial color
                    fontSize: '20px',
                }}
            >
                Back
            </div>

            <input
                type="text"
                value={pokemonName}
                onChange={(e) => setPokemonName(e.target.value)}
                placeholder="Enter Pokémon name"
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        getPokemon(); // Trigger the search when the Enter key is pressed
                    }
                }}
                style={{
                    padding: '12px 20px',
                    fontSize: '18px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    width: '80%',
                    maxWidth: '400px',
                    marginBottom: '20px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    transition: 'border-color 0.3s ease',
                }}
            />
            <button
                onClick={getPokemon}
                style={{
                    padding: '12px 24px',
                    fontSize: '18px',
                    borderRadius: '8px',
                    backgroundColor: '#ffcc00',
                    border: 'none',
                    cursor: 'pointer',
                    width: '100%',
                    maxWidth: '200px',
                    marginBottom: '20px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    transition: 'background-color 0.3s ease',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#ffaa00')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#ffcc00')}
            >
                Search
            </button>

            <div>
                {pokemonData && (
                    <div
                        style={{
                            backgroundColor: '#fff',
                            padding: '20px',
                            borderRadius: '12px',
                            display: 'inline-block',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.4)',
                            transition: 'border-color 0.3s ease',
                            margin: '10px 20px',
                            textAlign: 'center',
                        }}
                    >
                        <h2
                            style={{
                                fontSize: '28px',
                                color: '#2c3e50',
                                marginBottom: '10px',
                            }}
                        >
                            {pokemonData.name}
                        </h2>
                        <img
                            src={pokemonData.image}
                            alt="Pokémon"
                            style={{
                                width: '100%',
                                height: '200px',
                                objectFit: 'contain',
                                borderBottom: '1px solid lightgray',
                                marginBottom: '20px',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                            }}
                        />
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap', // Ensure content wraps on smaller screens
                                justifyContent: 'center', // Center the columns
                                gap: '20px', // Add some space between columns
                                textAlign: 'left', // Align text to the left
                            }}
                        >
                            <div
                                style={{
                                    flex: '1 1 45%', // Makes each column take 45% width
                                    minWidth: '250px', // Ensures columns don’t get too narrow on small screens
                                }}
                            >
                                <p
                                    style={{
                                        fontSize: '18px',
                                        color: '#34495e',
                                    }}
                                >
                                    <strong>Height:</strong> {pokemonData.height} m
                                </p>
                                <p
                                    style={{
                                        fontSize: '18px',
                                        color: '#34495e',
                                    }}
                                >
                                    <strong>Weight:</strong> {pokemonData.weight} kg
                                </p>
                                <p
                                    style={{
                                        fontSize: '18px',
                                        color: '#34495e',
                                    }}
                                >
                                    <strong>Type:</strong> {pokemonData.types}
                                </p>
                                <p
                                    style={{
                                        fontSize: '18px',
                                        color: '#34495e',
                                    }}
                                >
                                    <strong>Abilities:</strong> {pokemonData.abilities}
                                </p>
                            </div>

                            <div
                                style={{
                                    flex: '1 1 45%', // Makes each column take 45% width
                                    minWidth: '250px', // Ensures columns don’t get too narrow on small screens
                                }}
                            >
                                <p
                                    style={{
                                        fontSize: '18px',
                                        color: '#34495e',
                                    }}
                                >
                                    <strong>HP:</strong> {pokemonData.hp} <br />
                                    <strong>Attack:</strong> {pokemonData.attack} <br />
                                    <strong>Defense:</strong> {pokemonData.defense} <br />
                                    <strong>Speed:</strong> {pokemonData.speed}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <p
                        id="error"
                        style={{
                            color: '#e74c3c',
                            marginTop: '20px',
                            fontSize: '18px',
                        }}
                    >
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
};

export default PokemonSearchPage;
