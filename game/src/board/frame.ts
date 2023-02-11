import { pipe } from 'ramda'
import { match } from 'ts-pattern'
import { Frame, FrameFlow, GameStatePlaying, NextUseClergy, PlayerColor, StateReducer, Tableau } from '../types'
import { nextFrame4Long } from './frame/nextFrame4Long'
import { nextFrame3Long } from './frame/nextFrame3Long'
import { nextFrameSolo } from './frame/nextFrameSolo'
import { nextFrame3Short } from './frame/nextFrame3Short'
import { nextFrame4Short } from './frame/nextFrame4Short'
import { nextFrame2Long } from './frame/nextFrame2Long'
import { nextFrame2Short } from './frame/nextFrame2Short'

export const withFrame =
  (func: (frame: Frame | undefined) => Frame | undefined) =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
    if (state === undefined) return state
    const frame = func(state.frame)
    if (frame === undefined) return undefined
    return {
      ...state,
      frame,
    }
  }

const runProgression =
  (withFlow: FrameFlow): StateReducer =>
  (state) => {
    const nextFrameIndex = state?.frame.next
    if (nextFrameIndex === undefined) return undefined
    const { upkeep = [], ...frameUpdates } = withFlow[nextFrameIndex] ?? {}
    return pipe(
      // first, with all of the properties on the new frame, overlay them on the current frame
      withFrame((frame) => {
        const newFrame = {
          ...frame,
          activePlayerIndex: frameUpdates.currentPlayerIndex ?? frame?.activePlayerIndex,
          mainActionUsed: false,
          bonusActions: [],
          canBuyLandscape: true,
          unusableBuildings: [],
          usableBuildings: [],
          nextUse: NextUseClergy.Any,
          ...frameUpdates,
        } as Frame
        return newFrame
      }),
      // and then if there are any upkeep reducer functions on the frame, run them
      (state) => {
        return upkeep.reduce((accum: GameStatePlaying | undefined, f) => f(accum), state)
      }
    )(state)
  }
export const nextFrame: StateReducer = (state) =>
  match(state)
    .with({ config: { players: 3, length: 'long' } }, runProgression(nextFrame3Long))
    .with({ config: { players: 4, length: 'long' } }, runProgression(nextFrame4Long))
    .with({ config: { players: 3, length: 'short' } }, runProgression(nextFrame3Short))
    .with({ config: { players: 4, length: 'short' } }, runProgression(nextFrame4Short))
    .with({ config: { players: 2, length: 'long' } }, runProgression(nextFrame2Long))
    .with({ config: { players: 2, length: 'short' } }, runProgression(nextFrame2Short))
    .with({ config: { players: 1 } }, runProgression(nextFrameSolo))
    .with(undefined, () => undefined)
    .exhaustive()
