import React, { forwardRef, TextareaHTMLAttributes } from 'react'
import styled from '@emotion/styled'
import { themedPalette } from '@libs/style/theme'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    error?: string
    count?: number
    maxCount?: number
    width?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, count, maxCount, width = '100%', ...props }, ref) => {
        return (
            <Container width={width}>
                {label && <Label>{label}</Label>}

                <StyledTextarea ref={ref} {...props} />

                <Bottom>
                    {error ? (
                        <ErrorMessage>{error}</ErrorMessage>
                    ) : (
                        <span />
                    )}
                    {maxCount !== undefined && (
                        <CharCount>
                            {count ?? 0} / {maxCount}
                        </CharCount>
                    )}
                </Bottom>
            </Container>
        )
    },
)

export default Textarea

const Container = styled.div<{ width: string }>`
    display: flex;
    flex-direction: column;
    width: ${({ width }) => width};
    gap: 6px;
`

const Label = styled.span`
    font-size: 0.85rem;
    color: ${themedPalette.text2};
`

const StyledTextarea = styled.textarea`
    width: 100%;
    padding: 0.75rem 1rem;
    border-radius: 4px;
    border: 1px solid ${themedPalette.border2};
    background: ${themedPalette.bg_element4};
    color: ${themedPalette.text1};
    font-size: 0.88rem;
    line-height: 1.6;
    resize: none;
    outline: none;
    transition: border-color 0.2s;
    font-family: inherit;
    box-sizing: border-box;

    &::placeholder {
        color: ${themedPalette.text4};
    }

    &:focus {
        border-color: ${themedPalette.primary1};
    }
`

const Bottom = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const CharCount = styled.span`
    font-size: 0.75rem;
    color: ${themedPalette.text4};
`

const ErrorMessage = styled.span`
    font-size: 0.75rem;
    color: ${themedPalette.destructive1};
`
