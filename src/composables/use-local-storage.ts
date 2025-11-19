export enum LocalStorageEnum {
  SelectedModel = 'selected-model',
  Think = 'think',
}

export const useLocalStorage = () => {
  const setItem = (key: LocalStorageEnum, value: any) => {
    localStorage.setItem(key, JSON.stringify(value))
  }

  const getItem = (key: LocalStorageEnum) => {
    const value = localStorage.getItem(key)

    if (!value) {
      return null
    }

    return JSON.parse(value)
  }

  return { getItem, setItem }
}
