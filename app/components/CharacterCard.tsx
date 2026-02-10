import { Link } from "@tanstack/react-router";

export interface Character {
  id: number | string;
  name: string;
  portrait_path: string;
  occupation?: string;
}

interface CharacterCardProps {
  character: Character;
  variant?: "small" | "medium" | "large";
}

const CharacterCard = ({ character, variant = "medium" }: CharacterCardProps) => {
  const imageUrl = `https://cdn.thesimpsonsapi.com/500${character.portrait_path}`;

  const sizeClasses = {
    small: "w-24",
    medium: "w-48",
    large: "w-64",
  };

  return (
    <Link to="/character/$id" params={{ id: String(character.id) }} className="group block">
      <div className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-transparent hover:border-simpsons-blue transition-all transform hover:-translate-y-1 hover:shadow-xl flex flex-col items-center p-4">
        <div className={`${sizeClasses[variant]} aspect-square overflow-hidden mb-3 relative`}>
          <img
            src={imageUrl}
            alt={character.name}
            className="w-full h-full object-contain transition-transform group-hover:scale-110"
            loading="lazy"
          />
        </div>
        <h3 className="text-center font-bold text-simpsons-blue group-hover:text-simpsons-red line-clamp-2">
          {character.name}
        </h3>
        {character.occupation && (
          <p className="text-xs text-gray-500 text-center mt-1 line-clamp-1">
            {character.occupation}
          </p>
        )}
      </div>
    </Link>
  );
};

export default CharacterCard;
