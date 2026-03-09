export default function PokemonCard({ sprite, name }) {
  return (
    <div className="pokemon-card">
      <h3>{name}</h3>
      <img src={sprite} alt={name} />
    </div>
  );
}