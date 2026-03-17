export default function PokemonTrait({ sprite, name, height, weight, stats }) {
    return (
      <div className="pokemon-trait">
        {sprite && <img src={sprite} alt={name} />}
        <h2>{name}</h2>
  
        <h3>Base Stats</h3>
        <ul>
          {stats.map((s) => (
            <li key={s.name}>
              <span>{s.name}</span>
              <span>{s.base}</span>
            </li>
          ))}
        </ul>
  
        <h3>Physical Traits</h3>
        <p>Height: {height / 10} m</p>
        <p>Weight: {weight / 10} kg</p>
      </div>
    );
  }