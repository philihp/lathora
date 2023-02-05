import { initialState } from '../../reducer'
import {
  GameStatePlaying,
  GameStatusEnum,
  NextUseClergy,
  PlayerColor,
  SettlementRound,
  Tableau,
  Tile,
} from '../../types'
import { fellTrees } from '../fellTrees'

describe('commands/fellTrees', () => {
  describe('fellTrees', () => {
    const p0: Tableau = {
      color: PlayerColor.Blue,
      clergy: [],
      settlements: [],
      landscape: [
        [['W'], ['C'], [], [], [], [], [], [], []],
        [['W'], ['C'], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
        [[], [], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
      ] as Tile[][],
      wonders: 0,
      landscapeOffset: 1,
      peat: 0,
      penny: 1,
      clay: 0,
      wood: 0,
      grain: 0,
      sheep: 0,
      stone: 0,
      flour: 0,
      grape: 0,
      nickel: 0,
      hops: 0,
      coal: 0,
      book: 0,
      pottery: 0,
      whiskey: 0,
      straw: 0,
      meat: 0,
      ornament: 0,
      bread: 0,
      wine: 0,
      beer: 0,
      reliquary: 0,
    }
    const s0: GameStatePlaying = {
      ...initialState,
      status: GameStatusEnum.PLAYING,
      activePlayerIndex: 0,
      config: {
        country: 'france',
        players: 3,
        length: 'long',
      },
      rondel: {
        pointingBefore: 2,
        wood: 1,
        joker: 0,
      },
      wonders: 0,
      players: [{ ...p0 }, { ...p0 }, { ...p0 }],
      settling: false,
      extraRound: false,
      moveInRound: 1,
      round: 1,
      startingPlayer: 1,
      settlementRound: SettlementRound.S,
      buildings: [],
      nextUse: NextUseClergy.Any,
      canBuyLandscape: true,
      plotPurchasePrices: [1, 1, 1, 1, 1, 1],
      districtPurchasePrices: [],
      neutralBuildingPhase: false,
      mainActionUsed: false,
      bonusActions: [],
    }

    it('removes the forest', () => {
      const s1 = fellTrees({ row: 0, col: 1, useJoker: false })(s0)!
      expect(s1.players[0]).toMatchObject({
        landscape: [
          [['W'], ['C'], [], [], [], [], [], [], []],
          [['W'], ['C'], ['P', 'LPE'], ['P'], ['P', 'LFO'], ['P'], ['P'], [], []],
          [[], [], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
        ],
      })
    })
    it('wont fell trees where there are no trees', () => {
      const s1 = fellTrees({ row: 0, col: 0, useJoker: false })(s0)!
      expect(s1).toBeUndefined()
    })
    it('moves up the joker', () => {
      const s1 = fellTrees({ row: 0, col: 1, useJoker: true })(s0)!
      expect(s1.rondel.joker).toBe(2)
      expect(s1.rondel.wood).toBe(1)
    })
    it('moves up the wood token', () => {
      const s1 = fellTrees({ row: 0, col: 1, useJoker: false })(s0)!
      expect(s1.rondel.joker).toBe(0)
      expect(s1.rondel.wood).toBe(2)
    })
    it('gives the active player wood', () => {
      const s1 = fellTrees({ row: 0, col: 1, useJoker: false })(s0)!
      expect(s1.players[0].wood).toBe(2)
    })
    it('gives the active player joker-wood', () => {
      const s1 = fellTrees({ row: 0, col: 1, useJoker: true })(s0)!
      expect(s1.players[0].wood).toBe(3)
    })
  })
})
