import { useInstanceContext } from '@/context/InstanceContext'
import classes from './actions.module.css'

export const ActionConvert = () => {
  const { controls } = useInstanceContext()

  const handleClick = () => {
    // control('CONVERT')
  }

  const disabled = !(controls?.completion ?? []).includes('CONVERT')

  return (
    <button type="button" disabled={disabled} className={`primary ${classes.action}`} onClick={handleClick}>
      Convert
    </button>
  )
}
