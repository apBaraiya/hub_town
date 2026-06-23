import { createContext, useContext } from 'react'

export const SceneAnimationContext = createContext({
  progress: 0,
  zone: 'ZONE_1',
  sectionIndex: 0,
})

/**
 * SceneAnimationController
 * Context provider that translates the global scroll progress (0 to 1) into
 * active animation zone and section index, exposing them to all R3F and HTML sub-components.
 *
 * @param {{ progress: number, children: React.ReactNode }} props
 */
export function SceneAnimationController({ progress, children }) {
  let zone = 'ZONE_1'
  let sectionIndex = 0

  if (progress < 0.25) {
    zone = 'ZONE_1'
    sectionIndex = 0
  } else if (progress < 0.50) {
    zone = 'ZONE_2'
    sectionIndex = 1
  } else if (progress < 0.75) {
    zone = 'ZONE_3'
    sectionIndex = 2
  } else {
    zone = 'ZONE_4'
    sectionIndex = 3
  }

  const value = { progress, zone, sectionIndex }

  return (
    <SceneAnimationContext.Provider value={value}>
      {children}
    </SceneAnimationContext.Provider>
  )
}

/**
 * Custom hook to consume the scene animation state
 */
export function useSceneAnimation() {
  return useContext(SceneAnimationContext)
}
