import { Stack } from 'expo-router'

export default function ProfileLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#1A1A1A' },
            }}
        />
    )
}
