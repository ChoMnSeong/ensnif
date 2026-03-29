import { useId } from 'react'

interface LogoProps {
    height?: number
}

const Logo: React.FC<LogoProps> = ({ height = 36 }) => {
    const uid = useId().replace(/:/g, '')
    const gradId = `lg-${uid}`

    return (
        <svg
            height={height}
            viewBox="0 0 125 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="라애니 로고"
        >
            <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#b473f9" />
                    <stop offset="100%" style={{ stopColor: 'var(--text1)' }} />
                </linearGradient>
            </defs>

            <text
                x="8"
                y="30"
                fontFamily="'Nunito', 'Varela Round', 'Comfortaa', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
                fontSize="25"
                fontWeight="800"
                letterSpacing="1"
                fill={`url(#${gradId})`}
            >
                Lan&#x131;me
            </text>

            <path
                d="M57,11.5 C55.5,7.5 49.5,7.5 50,10 C50.5,11.8 54,12.5 57,11.5Z"
                fill="#b473f9"
            />
            <path
                d="M57,11.5 C58.5,7.5 64.5,7.5 64,10 C63.5,11.8 60,12.5 57,11.5Z"
                fill="#b473f9"
            />
            <path
                d="M57,11.5 C55.5,12.5 52,15.5 53,16.5 C54,17.5 55.5,15 57,11.5Z"
                fill="#b473f9"
                opacity="0.55"
            />
            <path
                d="M57,11.5 C58.5,12.5 62,15.5 61,16.5 C60,17.5 58.5,15 57,11.5Z"
                fill="#b473f9"
                opacity="0.55"
            />
            <ellipse cx="57" cy="12" rx="0.75" ry="2.2" fill="#7530c8" />
        </svg>
    )
}

export default Logo
