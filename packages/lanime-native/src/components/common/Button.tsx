import { ActivityIndicator, Pressable, Text, ViewProps } from 'react-native'
import { ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive'

interface Props extends ViewProps {
    onPress?: () => void
    children: ReactNode
    variant?: Variant
    loading?: boolean
    disabled?: boolean
}

const variantClasses: Record<Variant, { bg: string; text: string }> = {
    primary: { bg: 'bg-primary', text: 'text-white' },
    secondary: { bg: 'bg-bg-el2 border border-border-2', text: 'text-fg-1' },
    ghost: { bg: 'bg-transparent', text: 'text-fg-1' },
    destructive: { bg: 'bg-destructive', text: 'text-white' },
}

export const Button = ({
    onPress,
    children,
    variant = 'primary',
    loading,
    disabled,
    className,
}: Props) => {
    const v = variantClasses[variant]
    const isDisabled = disabled || loading
    return (
        <Pressable
            onPress={isDisabled ? undefined : onPress}
            className={`h-12 rounded-xl items-center justify-center px-4 ${v.bg} ${
                isDisabled ? 'opacity-50' : ''
            } ${className ?? ''}`}
        >
            {loading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <Text className={`text-base font-semibold ${v.text}`}>
                    {children}
                </Text>
            )}
        </Pressable>
    )
}
