import { useCallback, useState } from 'react'

export const useInput = (initial: string = '') => {
    const [value, setValue] = useState(initial)
    const onChangeText = useCallback((next: string) => setValue(next), [])
    const reset = useCallback(() => setValue(initial), [initial])
    return { value, setValue, onChangeText, reset }
}
