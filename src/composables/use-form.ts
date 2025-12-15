import { reactive, toRefs } from 'vue'

export const useForm = <T extends object>(initialData: T) => {
  const formData = reactive<T>({ ...initialData })

  const resetForm = () => {
    Object.assign(formData, { ...initialData })
  }

  return { ...toRefs(formData), resetForm }
}
