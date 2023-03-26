import { useHathoraContext } from '../context/GameContext'

const resetStyle = {
  fontFamily: 'monospace',
  margin: 0,
  padding: 0,
  listStyle: 'none',
  textIndent: 0,
  listStyleType: 'none',
}

export const MoveList = () => {
  const { state } = useHathoraContext()
  return (
    <div>
      <ul style={resetStyle}>
        {state?.moves.map((m) => (
          <li style={resetStyle}>{m}</li>
        ))}
      </ul>
    </div>
  )
}
