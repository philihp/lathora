import { initialState } from '../../state'
import {
  GameStatePlaying,
  GameStatusEnum,
  NextUseClergy,
  PlayerColor,
  SettlementRound,
  Tableau,
  Tile,
} from '../../types'
import { malthouse } from '../malthouse'

describe('buildings/malthouse', () => {
  describe('malthouse', () => {
    const p0: Tableau = {
      color: PlayerColor.Blue,
      clergy: [],
      settlements: [],
      landscape: [
        [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
        [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
      ] as Tile[][],
      wonders: 0,
      landscapeOffset: 0,
      peat: 0,
      penny: 100,
      clay: 0,
      wood: 0,
      grain: 0,
      sheep: 0,
      stone: 0,
      flour: 0,
      grape: 0,
      nickel: 0,
      malt: 0,
      coal: 0,
      book: 0,
      ceramic: 0,
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
      frame: {
        next: 1,
        startingPlayer: 1,
        settlementRound: SettlementRound.S,
        currentPlayerIndex: 0,
        activePlayerIndex: 0,
        neutralBuildingPhase: false,
        bonusRoundPlacement: false,
        mainActionUsed: false,
        bonusActions: [],
        canBuyLandscape: true,
        unusableBuildings: [],
        usableBuildings: [],
        nextUse: NextUseClergy.Any,
      },
      config: {
        country: 'france',
        players: 3,
        length: 'long',
      },
      rondel: {
        pointingBefore: 0,
      },
      wonders: 0,
      players: [{ ...p0 }, { ...p0 }, { ...p0 }],
      buildings: [],
      plotPurchasePrices: [1, 1, 1, 1, 1, 1],
      districtPurchasePrices: [],
    }

    it('retains undefined state', () => {
      const s0: GameStatePlaying | undefined = undefined
      const s1 = malthouse()(s0)
      expect(s1).toBeUndefined()
    })
    it('allows using with no input', () => {
      const s0: GameStatePlaying | undefined = undefined
      const s1 = malthouse()(s0)
      expect(s0).toBe(s1)
    })
    it('allows using with empty string', () => {
      const s0: GameStatePlaying | undefined = undefined
      const s1 = malthouse('')(s0)
      expect(s0).toBe(s1)
    })
    it('turns grain into malt and straw', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            grain: 5,
            malt: 0,
            straw: 1,
          },
          ...s0.players.slice(1),
        ],
      }
      const s2 = malthouse('GnGnGn')(s1)! as GameStatePlaying
      expect(s2.players[0]).toMatchObject({
        grain: 2,
        malt: 3,
        straw: 4,
      })
    })
  })
})