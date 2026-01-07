import { throttle } from 'lodash-es'
import { onBeforeMount, onBeforeUnmount, ref } from 'vue'

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

const BREAKPOINT_MAP: Record<Breakpoint, number> = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

export const useBreakpoints = () => {
  const breakpoint = ref<Breakpoint>('md')

  const screenGreaterThan = (breakpoint: Breakpoint) => {
    return window.innerWidth >= BREAKPOINT_MAP[breakpoint]
  }

  const updateBreakpointThrottle = throttle(() => {
    const width = window.innerWidth

    if (width < 640) {
      breakpoint.value = 'xs'
    } else if (width >= 640 && width < 768) {
      breakpoint.value = 'sm'
    } else if (width >= 768 && width < 1024) {
      breakpoint.value = 'md'
    } else if (width >= 1024 && width < 1280) {
      breakpoint.value = 'lg'
    } else if (width >= 1280 && width < 1536) {
      breakpoint.value = 'xl'
    } else {
      breakpoint.value = '2xl'
    }
  }, 500)

  onBeforeMount(() => {
    updateBreakpointThrottle()
    window.addEventListener('resize', updateBreakpointThrottle)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateBreakpointThrottle)
  })

  return { breakpoint, screenGreaterThan }
}
