import type { LocalStorageEnum } from '@/utils/enums'

export const useLocalStorage = () => {
  const setItem = (key: LocalStorageEnum, value: any) => {
    if (!value) {
      localStorage.setItem(key, 'null')
      return
    }

    localStorage.setItem(key, JSON.stringify(value))
  }

  const getItem = (key: LocalStorageEnum) => {
    const value = localStorage.getItem(key)

    if (!value) {
      return null
    }

    return JSON.parse(value)
  }

  const removeItem = (key: LocalStorageEnum) => {
    localStorage.removeItem(key)
  }

  return { getItem, setItem, removeItem }
}
