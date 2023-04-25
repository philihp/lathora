import { initialState } from '../../state'
import {
  BuildingEnum,
  GameStatePlaying,
  GameStatusEnum,
  NextUseClergy,
  PlayerColor,
  SettlementRound,
  Tableau,
  Tile,
} from '../../types'
import { shippingCompany, complete } from '../shippingCompany'

describe('buildings/shippingCompany', () => {
  const p0: Tableau = {
    color: PlayerColor.Blue,
    clergy: [],
    settlements: [],
    landscape: [
      [[], [], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
      [[], [], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
    ] as Tile[][],
    wonders: 0,
    landscapeOffset: 0,
    peat: 10,
    penny: 0,
    clay: 0,
    wood: 10,
    grain: 0,
    sheep: 0,
    stone: 0,
    flour: 0,
    grape: 0,
    nickel: 0,
    malt: 0,
    coal: 10,
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
      round: 1,
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
      pointingBefore: 7,
      joker: 5,
    },
    wonders: 0,
    players: [{ ...p0 }, { ...p0 }, { ...p0 }],
    buildings: [] as BuildingEnum[],
    plotPurchasePrices: [1, 1, 1, 1, 1, 1],
    districtPurchasePrices: [],
  }

  describe('shippingCompany', () => {
    it('retains undefined state', () => {
      const s1 = shippingCompany()(undefined)!
      expect(s1).toBeUndefined()
    })
    it('burns wood and makes meat', () => {
      const s1 = shippingCompany('WoWoWo', 'Mt')(s0)!
      expect(s1.players[0]).toMatchObject({
        meat: 3,
        wood: 7,
      })
    })
    it('no output specified errors', () => {
      const s1 = shippingCompany('WoWoWo', '')(s0)!
      expect(s1).toBeUndefined()
    })
    it('burns peat and makes bread', () => {
      const s1 = shippingCompany('PtPt', 'Br')(s0)!
      expect(s1.players[0]).toMatchObject({
        peat: 8,
        bread: 3,
      })
    })
    it('burns coal and makes wine', () => {
      const s1 = shippingCompany('Co', 'Wn')(s0)!
      expect(s1.players[0]).toMatchObject({
        coal: 9,
        wine: 3,
      })
    })
    it('noop if not enough energy', () => {
      const s1 = shippingCompany('Wo', 'Wn')(s0)!
      expect(s1).toBe(s0)
    })
  })

  describe('complete', () => {
    it('noop if no fuel', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            peat: 0,
            wood: 0,
            coal: 0,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual([''])
    })
    it('coal fuel and pick any of the following', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            peat: 0,
            wood: 0,
            coal: 1,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual(['MtCo', 'BrCo', 'WnCo', ''])
    })
    it('shows options with other fuel sources', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            peat: 1,
            wood: 1,
            coal: 1,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual(['MtCo', 'MtPtWo', 'BrCo', 'BrPtWo', 'WnCo', 'WnPtWo', ''])
    })
  })
})
