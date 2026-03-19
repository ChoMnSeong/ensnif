import React, { forwardRef, InputHTMLAttributes } from 'react'
import styled from '@emotion/styled'
import { themedPalette } from '../../libs/style/theme'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    count?: number // 현재 글자 수
    maxCount?: number // 최대 글자 수
    width?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, count, maxCount, width = '100%', ...props }, ref) => {
        return (
            <Container width={width}>
                {label && <Label>{label}</Label>}

                <InputWrapper>
                    <StyledInput ref={ref} {...props} />
                    {maxCount !== undefined && (
                        <CharCount>
                            {count ?? 0}/{maxCount}자
                        </CharCount>
                    )}
                </InputWrapper>

                {error && <ErrorMessage>{error}</ErrorMessage>}
            </Container>
        )
    },
)

export default Input

const Container = styled.div<{ width: string }>`
    display: flex;
    flex-direction: column;
    width: ${({ width }) => width};
    gap: 8px;
`

const Label = styled.span`
    font-size: 0.85rem;
    color: ${themedPalette.text2};
`

const InputWrapper = styled.div`
    position: relative;
    width: 100%;
`

const StyledInput = styled.input`
    width: 100%;
    background: transparent;
    border: none;
    border-bottom: 1px solid ${themedPalette.border2};
    color: ${themedPalette.text1};
    font-size: 1rem;
    padding: 8px 0;
    outline: none;
    transition: border-bottom-color 0.2s ease;

    &:focus {
        border-bottom-color: ${themedPalette.primary1};
    }

    &::placeholder {
        color: ${themedPalette.text4};
    }
`

const CharCount = styled.span`
    position: absolute;
    right: 0;
    bottom: 8px;
    font-size: 0.75rem;
    color: ${themedPalette.text4};
`

const ErrorMessage = styled.span`
    font-size: 0.75rem;
    color: ${themedPalette.destructive1};
`
