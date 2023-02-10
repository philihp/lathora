import { reducer } from '../../reducer'
import { initialState } from '../../state'
import { GameStatePlaying } from '../../types'
import { dormitory } from '../dormitory'

describe('buildings/dormitory', () => {
  describe('dormitory', () => {
    it('retains undefined state', () => {
      const s0: GameStatePlaying | undefined = undefined
      const s1 = dormitory()(s0)
      expect(s1).toBeUndefined()
    })
    it('baseline happy path', () => {
      const s0 = initialState
      const s1 = reducer(s0, ['CONFIG', '4', 'france', 'long'])!
      const s2 = reducer(s1, ['START', '42', 'R', 'B', 'G', 'W'])! as GameStatePlaying
      expect(s2).toBeDefined()
    })
  })
})
