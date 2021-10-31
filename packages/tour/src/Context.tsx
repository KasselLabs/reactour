import React, { useEffect, useContext } from 'react'
import { useState } from 'react'
import Tour from './Tour'
import { ProviderProps, TourProps } from './types'
import usePrevious from './usePrevious'

const defaultState = {
  isOpen: false,
  setIsOpen: () => false,
  currentStep: 0,
  setCurrentStep: () => 0,
  steps: [],
  setSteps: () => [],
  disabledActions: false,
  setDisabledActions: () => false,
}

const TourContext = React.createContext<TourProps>(defaultState)

const TourProvider: React.FC<ProviderProps> = ({
  children,
  defaultOpen = false,
  startAt = 0,
  steps: defaultSteps,
  onClose,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [currentStep, setCurrentStep] = useState(startAt)
  const [steps, setSteps] = useState(defaultSteps)
  const [disabledActions, setDisabledActions] = useState(false)

  const value = {
    isOpen,
    setIsOpen,
    currentStep,
    setCurrentStep,
    steps,
    setSteps,
    disabledActions,
    setDisabledActions,
    ...props,
  }

  const previousIsOpen = usePrevious(isOpen)

  useEffect(() => {
    const hasClosedTour = previousIsOpen === true && isOpen === false

    if (hasClosedTour && onClose && typeof onClose === 'function') {
      onClose({ currentStep, steps })
    }
  }, [isOpen, previousIsOpen])

  return (
    <TourContext.Provider value={value}>
      {children}
      {isOpen ? <Tour {...value} /> : null}
    </TourContext.Provider>
  )
}

export { TourProvider }

export default TourContext

export function useTour() {
  return useContext(TourContext)
}
