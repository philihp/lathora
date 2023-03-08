import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Header } from '../components/Header'
import { Loading } from '../components/Loading'
import { StatePlaying } from '../components/StatePlaying'
import { StateSetup } from '../components/StateSetup'
import { EngineStatus } from '../../../../api/types'

import { useHathoraContext } from '../context/GameContext'

const Game = () => {
  const { gameId } = useParams()
  const { loading, state, token, login, connect } = useHathoraContext()
  useEffect(() => {
    if (!token) {
      login()
    }
  }, [token, login])

  useEffect(() => {
    if (token && gameId) {
      connect(gameId)
    }
  }, [gameId, token, connect])

  return (
    <>
      <Header />
      <hr />
      {loading && <Loading />}
      {state?.status === EngineStatus.SETUP && <StateSetup />}
      {state?.status === EngineStatus.PLAYING && <StatePlaying />}
    </>
  )
}

export default Game
