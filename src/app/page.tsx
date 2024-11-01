'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import WildPokemonAppearModal from '@/components/Modal';
import PokemonType from '@/components/PokemonType';
import PokemonModal from '@/components/PokemonModal';
import AudioPlayer from '@/components/AudioPlayer';
import PokemonCardGrid from '@/components/PokemonCardGrid';

interface Ability {
  name: string;
  description: string;
}

interface Pokemon {
  name: string;
  url: string;
  image: string;
  types: string[];
  base_experience: number;
  weight: number;
  height: number;
  abilities: Ability[];
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
  const observer = useRef<IntersectionObserver | null>(null);

  const handleCardClick = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
    setShowModal(true);
  };

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
            weight: pokemonData.weight,
            height: pokemonData.height,
            abilities: await Promise.all(
              pokemonData.abilities.map(async (abilityObj: { ability: { name: string; url: string } }) => {
                const abilityDetails = await axios.get(abilityObj.ability.url);
                const abilityDescription = abilityDetails.data.effect_entries.find((entry: { language: { name: string; }; }) => entry.language.name === 'en')?.effect || 'No description available';
                return {
                  name: abilityObj.ability.name,
                  description: abilityDescription
                };
              })
            ),
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
            weight: pokemonData.weight,
            height: pokemonData.height,
            abilities: await Promise.all(
              pokemonData.abilities.map(async (abilityObj: { ability: { name: string; url: string } }) => {
                const abilityDetails = await axios.get(abilityObj.ability.url);
                const abilityDescription = abilityDetails.data.effect_entries.find((entry: { language: { name: string; }; }) => entry.language.name === 'en')?.effect || 'No description available';
                return {
                  name: abilityObj.ability.name,
                  description: abilityDescription
                };
              })
            ),
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
          <h1 className="text-3xl font-bold text-white text-shadow">Pokémon Info</h1>
          <AudioPlayer src="/music/ruby_bg_music.mp3" />
          {/* <div className="text-white">
            <p>Unique Visitors: {uniqueVisitorCount}</p>
          </div> */}
        </div>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <PokemonCardGrid pokemonList={pokemonList} handleCardClick={handleCardClick} />

        {loadingMore && pokemonList.length < 2000 && (
          <div className="spinner-overlay">
            <div className="animate-spin h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}

        <WildPokemonAppearModal
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
