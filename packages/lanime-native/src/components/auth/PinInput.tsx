import { useEffect, useRef } from 'react'
import { TextInput, View } from 'react-native'

interface Props {
    value: string
    onChange: (v: string) => void
    onComplete?: (v: string) => void
    length?: number
    autoFocus?: boolean
    secure?: boolean
}

export const PinInput = ({
    value,
    onChange,
    onComplete,
    length = 4,
    autoFocus = true,
    secure = true,
}: Props) => {
    const inputRef = useRef<TextInput>(null)

    useEffect(() => {
        if (autoFocus) inputRef.current?.focus()
    }, [autoFocus])

    const handle = (next: string) => {
        const digits = next.replace(/\D/g, '').slice(0, length)
        onChange(digits)
        if (digits.length === length) onComplete?.(digits)
    }

    return (
        <View className="items-center">
            <View
                className="flex-row"
                style={{ gap: 12 }}
                onTouchStart={() => inputRef.current?.focus()}
            >
                {Array.from({ length }).map((_, i) => {
                    const filled = i < value.length
                    const active = i === value.length
                    return (
                        <View
                            key={i}
                            className={`w-12 h-14 rounded-xl items-center justify-center border ${
                                active
                                    ? 'border-primary'
                                    : filled
                                      ? 'border-fg-2'
                                      : 'border-border-2'
                            } bg-bg-el2`}
                        >
                            {filled ? (
                                <View className="w-3 h-3 rounded-full bg-fg-1" />
                            ) : null}
                        </View>
                    )
                })}
            </View>
            <TextInput
                ref={inputRef}
                value={value}
                onChangeText={handle}
                keyboardType="number-pad"
                maxLength={length}
                secureTextEntry={secure}
                autoFocus={autoFocus}
                style={{
                    position: 'absolute',
                    width: 1,
                    height: 1,
                    opacity: 0,
                }}
            />
        </View>
    )
}
