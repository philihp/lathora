import { initialState } from '../../state'
import {
  BuildingEnum,
  Clergy,
  GameStatePlaying,
  GameStatusEnum,
  NextUseClergy,
  PlayerColor,
  SettlementRound,
  Tableau,
  Tile,
} from '../../types'
import { workContract } from '../workContract'

describe('commands/workContract', () => {
  const p0: Tableau = {
    color: PlayerColor.Blue,
    clergy: [],
    settlements: [],
    landscape: [[]] as Tile[][],
    wonders: 0,
    landscapeOffset: 1,
    peat: 0,
    penny: 0,
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
    frame: {
      next: 1,
      startingPlayer: 0,
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
      players: 4,
      length: 'long',
    },
    rondel: {
      pointingBefore: 4,
      wood: 1,
      sheep: 3,
      grain: 4,
      joker: 0,
    },
    wonders: 0,
    players: [
      {
        ...p0,
        color: PlayerColor.Red,
        // this is the active player
        clergy: ['PRIR'] as Clergy[],
        landscape: [
          [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LR1', 'LB2R'], [], []],
          [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LR2', 'LB1R'], ['P', 'G01'], ['P', 'LR3'], [], []],
        ] as Tile[][],
        grain: 4,
        penny: 4,
        wine: 4,
        landscapeOffset: 0,
      },
      {
        ...p0,
        color: PlayerColor.Blue,
        // specifically, blue has only laybrothers
        clergy: ['LB1B', 'LB2B'] as Clergy[],
        landscape: [
          [['W'], ['C'], [], [], [], [], [], ['H'], ['M']],
          [['W'], ['C', 'F04', 'PRIB'], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P', 'LB1'], ['H'], ['.']],
          [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LB2'], ['P', 'G02'], ['P', 'LB3'], [], []],
        ] as Tile[][],
        landscapeOffset: 1,
      },
      {
        ...p0,
        color: PlayerColor.Green,
        // specifically, green has both laybrother and prior, so she will be put to a decision
        clergy: ['LB1G', 'LB2G', 'PRIG'] as Clergy[],
        landscape: [
          [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P', 'F05'], ['H', 'LG1'], [], []],
          [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LG2'], ['P', 'F08'], ['P', 'LG3'], [], []],
        ] as Tile[][],
        penny: 1,
        landscapeOffset: 0,
      },
      {
        ...p0,
        color: PlayerColor.White,
        // white has already had their people all placed, so a work contract against them should fail
        clergy: [] as Clergy[],
        landscape: [
          [['W'], ['C', 'F11'], ['P', 'LPE'], ['P'], ['P', 'LFO'], ['P', 'F03', 'PRIW'], ['H', 'LG1'], [], []],
          [['W'], ['C', 'G07'], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LG2', 'LG1W'], ['P'], ['P', 'LG3', 'LG2W'], [], []],
        ] as Tile[][],
        landscapeOffset: 0,
      },
    ],
    buildings: ['F09', 'F10', 'G12', 'G13', 'G06'] as BuildingEnum[],
    plotPurchasePrices: [1, 1, 1, 1, 1, 1],
    districtPurchasePrices: [],
  }

  it('can work contract someone with only laybrothers', () => {
    const s2 = workContract('G02' as BuildingEnum, 'Pn')(s0)!
    expect(s2.frame).toMatchObject({
      activePlayerIndex: 0,
      usableBuildings: ['G02'],
      nextUse: 'free',
    })
    expect(s2.players[0]).toMatchObject({
      penny: 3,
      wine: 4,
      grain: 4,
    })
    expect(s2.players[1]).toMatchObject({
      landscape: [
        [['W'], ['C'], [], [], [], [], [], ['H'], ['M']],
        [['W'], ['C', 'F04', 'PRIB'], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P', 'LB1'], ['H'], ['.']],
        [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LB2'], ['P', 'G02', 'LB1B'], ['P', 'LB3'], [], []],
      ],
      clergy: ['LB2B'],
    })
  })

  it('can work contract someone with only their prior', () => {
    const s1 = {
      ...s0,
      frame: {
        ...s0.frame,
        currentPlayerIndex: 2,
        activePlayerIndex: 2,
      },
    }
    const s2 = workContract('G01' as BuildingEnum, 'Pn')(s1)!
    expect(s2.frame).toMatchObject({
      activePlayerIndex: 2,
      usableBuildings: ['G01'],
      nextUse: 'free',
    })
    expect(s2.players[0]).toMatchObject({
      wine: 4,
      grain: 4,
      landscape: [
        [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LR1', 'LB2R'], [], []],
        [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LR2', 'LB1R'], ['P', 'G01', 'PRIR'], ['P', 'LR3'], [], []],
      ],
      clergy: [],
    })
    expect(s2.players[2]).toMatchObject({
      penny: 0,
      clergy: ['LB1G', 'LB2G', 'PRIG'],
    })
  })

  it('when work contracting someone with both laybrother and prior, gives them the choice', () => {
    // TODO we should have tests to ensure the other player can only WITH_PRIOR or WITH_LAYBROTHER
    // TODO and we should have tests to ensure that a WITH_PRIOR prior to a work contract does not affect things
    const s2 = workContract('F05' as BuildingEnum, 'Pn')(s0)!
    expect(s2.frame).toMatchObject({
      currentPlayerIndex: 0,
      activePlayerIndex: 2,
      usableBuildings: ['F05'],
    })
    expect(s2.players[0]).toMatchObject({
      penny: 3,
      wine: 4,
      grain: 4,
    })
    expect(s2.players[2]).toMatchObject({
      penny: 2,
      clergy: ['LB1G', 'LB2G', 'PRIG'] as Clergy[],
      landscape: [
        [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P', 'F05'], ['H', 'LG1'], [], []],
        [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LG2'], ['P', 'F08'], ['P', 'LG3'], [], []],
      ] as Tile[][],
    })
  })
  it('can not work contract someone with no clergy left', () => {
    const s2 = workContract('F11' as BuildingEnum, 'Pn')(s0)!
    expect(s2).toBeUndefined()
  })
  it('can work contract with wine, which is consumed', () => {
    const s2 = workContract('G02' as BuildingEnum, 'Wn')(s0)!
    expect(s2.frame).toMatchObject({
      activePlayerIndex: 0,
      usableBuildings: ['G02'],
      nextUse: 'free',
    })
    expect(s2.players[0]).toMatchObject({
      penny: 4,
      wine: 3,
      grain: 4,
    })
    expect(s2.players[1]).toMatchObject({
      penny: 0,
      wine: 0,
      landscape: [
        [['W'], ['C'], [], [], [], [], [], ['H'], ['M']],
        [['W'], ['C', 'F04', 'PRIB'], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P', 'LB1'], ['H'], ['.']],
        [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LB2'], ['P', 'G02', 'LB1B'], ['P', 'LB3'], [], []],
      ],
      clergy: ['LB2B'],
    })
  })
  it('can work contract with a penny, which is gifted', () => {
    const s2 = workContract('G02' as BuildingEnum, 'Pn')(s0)!
    expect(s2.players[0].penny).toBe(3)
    expect(s2.players[1].penny).toBe(1)
  })

  it('can work contract with gifted pennies, which costs two once the winery has been built', () => {
    const s1 = {
      ...s0,
      frame: { ...s0.frame, settlementRound: SettlementRound.B },
    }
    expect(s1.frame.settlementRound).not.toBe('S')
    expect(s1.frame.settlementRound).not.toBe('A')
    expect(s1.buildings).not.toContain('F21')
    const s2 = workContract('G02' as BuildingEnum, 'PnPn')(s1)!
    expect(s2.players[0].penny).toBe(2)
    expect(s2.players[1].penny).toBe(2)
  })

  it('fail if payment insufficient', () => {
    const s1 = {
      ...s0,
      frame: { ...s0.frame, settlementRound: SettlementRound.B },
    }
    const s2 = workContract('G02' as BuildingEnum, 'Pn')(s1)!
    expect(s2).toBeUndefined()
  })

  it('gifts for the host are still 1 wine, regardless of if winery is built', () => {
    const s1 = {
      ...s0,
      frame: { ...s0.frame, settlementRound: SettlementRound.B },
    }
    const s2 = workContract('G02' as BuildingEnum, 'Wn')(s1)!
    expect(s2.players[0]).toMatchObject({
      wine: 3,
      penny: 4,
    })
  })

  it('can not work contract yourself', () => {
    // 'G01' is owned by the active player
    const s2 = workContract('G01' as BuildingEnum, 'Pn')(s0)!
    expect(s2).toBeUndefined()
  })
})