export default function useFilteredProps<T>(
    props: Record<string, T>,
    included: string[],
): Record<string, T> {
    const initialFilteredProps: Record<string, T> = Object.keys(props)
        .filter((key) => !included.includes(key))
        .reduce((obj: Record<string, T>, key: string) => {
            obj[key] = props[key]
            return obj
        }, {})
    return initialFilteredProps
}
