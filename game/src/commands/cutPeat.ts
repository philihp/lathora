import { pipe } from 'ramda'
import { match } from 'ts-pattern'
import { getCost, withActivePlayer } from '../board/player'
import { GameCommandCutPeatParams, GameStatePlaying, Tile, BuildingEnum } from '../types'
import { take } from '../board/wheel'
import { consumeMainAction } from '../board/state'
import { updateRondel, withRondel } from '../board/rondel'

const checkStateAllowsUse = (state: GameStatePlaying | undefined) => {
  return match(state)
    .with(undefined, () => undefined)
    .with({ frame: { mainActionUsed: false } }, () => state)
    .with({ frame: { mainActionUsed: true } }, () => undefined)
    .exhaustive()
}

const removePeatAt = (row: number, col: number) =>
  withActivePlayer((player) => {
    const tile = player.landscape[row + player.landscapeOffset][col + 2]
    const [land, building] = tile
    if (building !== BuildingEnum.Peat) return undefined
    const landscape = [
      ...player.landscape.slice(0, row + player.landscapeOffset),
      [
        ...player.landscape[row + player.landscapeOffset].slice(0, col + 2),
        // the tile in question
        [land] as Tile,
        ...player.landscape[row + player.landscapeOffset].slice(col + 2 + 1),
      ],
      ...player.landscape.slice(row + player.landscapeOffset + 1),
    ]
    return {
      ...player,
      landscape,
    }
  })

const givePlayerPeat =
  (useJoker: boolean) =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
    if (state === undefined) return undefined
    const { joker, peat, pointingBefore } = state.rondel
    const amount = take(pointingBefore, (useJoker ? joker : peat) ?? pointingBefore, state.config)
    return withActivePlayer(getCost({ peat: amount }))(state)
  }

export const cutPeat = ({ row, col, useJoker }: GameCommandCutPeatParams) =>
  pipe(
    //
    checkStateAllowsUse,
    consumeMainAction,
    givePlayerPeat(useJoker),
    removePeatAt(row, col),
    withRondel(updateRondel(useJoker ? 'joker' : 'peat'))
  )
