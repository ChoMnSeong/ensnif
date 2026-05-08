import { ReactNode } from 'react'
import { View, ViewProps } from 'react-native'
import { SafeAreaView, Edge } from 'react-native-safe-area-context'

interface Props extends ViewProps {
    children: ReactNode
    edges?: Edge[]
    safe?: boolean
}

export const Screen = ({
    children,
    edges = ['top', 'left', 'right'],
    safe = true,
    className,
    ...rest
}: Props) => {
    if (safe) {
        return (
            <SafeAreaView
                edges={edges}
                style={{ flex: 1 }}
                className={`flex-1 bg-bg-page ${className ?? ''}`}
            >
                <View {...rest} style={[{ flex: 1 }, rest.style]}>
                    {children}
                </View>
            </SafeAreaView>
        )
    }
    return (
        <View
            {...rest}
            style={[{ flex: 1 }, rest.style]}
            className={`flex-1 bg-bg-page ${className ?? ''}`}
        >
            {children}
        </View>
    )
}
