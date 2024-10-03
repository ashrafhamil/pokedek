'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Modal from '@/components/Modal';
import PokemonType from '@/components/PokemonType';
import PokemonModal from '@/components/PokemonModal';


interface Pokemon {
  name: string;
  url: string;
  image: string; // Always a string, fallback handled in the fetching function
  types: string[];
  base_experience: number;
}

interface PokemonType {
  type: {
    name: string;
  };
}

const Home = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null); // Reference for audio element
  const observer = useRef<IntersectionObserver | null>(null);
  const [isPlaying, setIsPlaying] = useState(false); // State to track if audio is playing

  const handleCardClick = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
    setShowModal(true);
  };

  useEffect(() => {
    // Create and play audio on component mount
    audioRef.current = new Audio('/music/ruby_bg_music.mp3'); // Correct path
    audioRef.current.loop = true; // Optional: Loop the audio
    audioRef.current.volume = 0.1; // Set the volume to 50%
    audioRef.current.play().catch((error) => console.error('Error playing audio:', error)); // Handle errors

    return () => {
      audioRef.current?.pause(); // Pause audio on component unmount
      audioRef.current = null; // Clean up reference
    };
  }, []); // Empty dependency array to run only once on mount

  useEffect(() => {
    const fetchPokemon = async () => {
      setError(null);
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`);
        const fetchedPokemon = response.data.results;

        if (fetchedPokemon.length === 0) {
          setLoadingMore(false);
          return;
        }

        const detailedPokemonPromises = fetchedPokemon.map(async (pokemon: { name: string; url: string }) => {
          const details = await axios.get(pokemon.url);
          const pokemonData = details.data;

          return {
            name: pokemonData.name,
            url: pokemon.url,
            image: pokemonData.sprites.front_default || 'default_image_url.png',
            types: pokemonData.types.map((typeObj: PokemonType) => typeObj.type.name),
            base_experience: pokemonData.base_experience,
          };
        });

        const detailedPokemon = await Promise.all(detailedPokemonPromises);
        setPokemonList((prev) => [...prev, ...detailedPokemon]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Pokémon:', error);
        setError('Failed to fetch Pokémon. Please try again later.');
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [offset]);

  useEffect(() => {
    if (loading || loadingMore) return;

    const lastPokemonElement = document.querySelector('.pokemon-card:last-child');
    if (!lastPokemonElement) return;

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (pokemonList.length === 2000) {
          setShowModal(true);
          setLoadingMore(false);
        } else {
          setLoadingMore(true);
          setOffset((prev) => prev + 20);
        }
      }
    });

    if (lastPokemonElement) {
      observer.current.observe(lastPokemonElement);
    }

    return () => {
      if (lastPokemonElement && observer.current) {
        observer.current.unobserve(lastPokemonElement);
      }
    };
  }, [loading, loadingMore, pokemonList]);

  useEffect(() => {
    if (!loadingMore) return;

    const fetchMorePokemon = async () => {
      setError(null);
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`);
        const fetchedPokemon = response.data.results;

        if (fetchedPokemon.length === 0) {
          setLoadingMore(false);
          return;
        }

        const detailedPokemonPromises = fetchedPokemon.map(async (pokemon: { name: string; url: string }) => {
          const details = await axios.get(pokemon.url);
          const pokemonData = details.data;

          return {
            name: pokemonData.name,
            url: pokemon.url,
            image: pokemonData.sprites.front_default || 'default_image_url.png',
            types: pokemonData.types.map((typeObj: PokemonType) => typeObj.type.name),
            base_experience: pokemonData.base_experience,
          };
        });

        const detailedPokemon = await Promise.all(detailedPokemonPromises);
        setPokemonList((prev) => [...prev, ...detailedPokemon]);
      } catch (error) {
        console.error('Error fetching more Pokémon:', error);
        setError('Failed to fetch more Pokémon. Please try again later.');
      } finally {
        setLoadingMore(false);
      }
    };

    fetchMorePokemon();
  }, [offset, loadingMore]);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause(); // Pause audio
    } else {
      audioRef.current?.play().catch((error) => console.error('Error playing audio:', error)); // Play audio
    }
    setIsPlaying(!isPlaying); // Toggle the playing state
  };

  const handleContinue = () => {
    setShowModal(false);
    setLoadingMore(true);
  };

  const handleStopLoading = () => {
    setShowModal(false);
  };

  if (loading && pokemonList.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className='bg-gradient-to-b from-blue-300 to-green-300'>
      <div className="container mx-auto p-6">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold text-white text-shadow">Pokémon Cards</h1>
          <button
            onClick={handlePlayPause}
            className="bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-700 transition duration-200 mt-4"
          >
            {isPlaying ? 'Pause  Music' : 'Back to Littleroot Town'}
          </button>
          {/* <div className="text-white">
            <p>Unique Visitors: {uniqueVisitorCount}</p>
          </div> */}
        </div>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}



        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {pokemonList.map((pokemon, index) => (
              <div
                key={index}
                className="pokemon-card bg-white rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 p-6 flex flex-col items-center custom-width"
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

        {loadingMore && pokemonList.length < 2000 && (
          <div className="spinner-overlay">
            <div className="animate-spin h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}

        <Modal
          isOpen={showModal}
          onClose={handleStopLoading}
          onContinue={handleContinue}
        />

        <PokemonModal
          isOpen={showModal}
          onClose={handleStopLoading}
          onContinue={handleContinue}
          selectedPokemon={selectedPokemon}
        />
      </div>
    </div>
  );
};

export default Home;