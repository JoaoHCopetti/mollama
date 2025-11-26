export enum LocalStorageEnum {
  SelectedModelId = 'selected-model-id',
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

  const removeItem = (key: LocalStorageEnum) => {
    localStorage.removeItem(key)
  }

  return { getItem, setItem, removeItem }
}
