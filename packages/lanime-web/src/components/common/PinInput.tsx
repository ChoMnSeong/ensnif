import React, { useRef, useEffect } from 'react'
import styled from '@emotion/styled'
import { themedPalette } from '../../libs/style/theme'
import Flex from './Flex'

type PinSize = 'sm' | 'md' | 'lg'

interface PinInputProps {
    value: string[]
    onChange: (pins: string[]) => void
    onComplete?: (pinString: string) => void
    size?: PinSize
    gap?: string
}

const PinInput: React.FC<PinInputProps> = ({
    value,
    onChange,
    onComplete,
    size = 'md',
    gap,
}) => {
    const inputRefs = useRef<HTMLInputElement[]>([])

    // 모든 칸이 채워지면 onComplete 호출
    useEffect(() => {
        if (value.every((v) => v !== '') && onComplete) {
            onComplete(value.join(''))
        }
    }, [value, onComplete])

    const handleChange = (val: string, idx: number) => {
        // 숫자만 허용 (빈 문자열은 지우기 위해 허용)
        if (val !== '' && !/^\d+$/.test(val)) return

        const newPins = [...value]
        const digit = val.slice(-1) // 마지막으로 입력한 한 글자만 취함
        newPins[idx] = digit
        onChange(newPins)

        // 값을 입력했다면 다음 칸으로 포커스 이동
        if (digit !== '' && idx < 3) {
            inputRefs.current[idx + 1]?.focus()
        }
    }

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        idx: number,
    ) => {
        if (e.key === 'Backspace') {
            // 1. 현재 칸에 값이 있는 경우 -> 현재 칸만 지움
            if (value[idx] !== '') {
                const newPins = [...value]
                newPins[idx] = ''
                onChange(newPins)
            }
            // 2. 현재 칸이 이미 비어있는 경우 -> 앞 칸으로 이동하며 앞 칸 지움
            else if (idx > 0) {
                const newPins = [...value]
                newPins[idx - 1] = ''
                onChange(newPins)
                inputRefs.current[idx - 1]?.focus()
            }
        }
    }

    const getGap = () => {
        if (gap) return gap
        switch (size) {
            case 'sm':
                return '0.5rem'
            case 'lg':
                return '1.5rem'
            default:
                return '1rem'
        }
    }

    return (
        <Flex gap={getGap()} justifyContent="center" alignItems="end">
            {value.map((digit, i) => (
                <UnderlinePin
                    key={i}
                    ref={(el) => {
                        if (el) inputRefs.current[i] = el
                    }}
                    type="password"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit || ''}
                    pinSize={size}
                    isActive={digit !== ''}
                    onChange={(e) => handleChange(e.target.value, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    autoFocus={i === 0}
                />
            ))}
        </Flex>
    )
}

export default PinInput

const UnderlinePin = styled.input<{ pinSize: PinSize; isActive: boolean }>`
    background: transparent;
    border: none;
    outline: none;
    text-align: center;
    color: ${themedPalette.text1};
    transition: all 0.2s ease;
    border-bottom: 2px solid
        ${(props) =>
            props.isActive ? themedPalette.primary1 : themedPalette.border2};

    ${({ pinSize }) => {
        switch (pinSize) {
            case 'sm':
                return `
                    width: 24px;
                    font-size: 1.2rem;
                    padding-bottom: 2px;
                `
            case 'lg':
                return `
                    width: 56px;
                    font-size: 3rem;
                    padding-bottom: 8px;
                `
            default: // md
                return `
                    width: 36px;
                    font-size: 1.8rem;
                    padding-bottom: 4px;
                `
        }
    }}

    &:focus {
        border-bottom-color: ${themedPalette.primary1};
    }

    /* 패스워드 모드일 때 점 크기 조절을 위한 팁 */
    &[type='password'] {
        font-family: caption;
    }
`
