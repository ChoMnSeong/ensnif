import styled from "@emotion/styled"
import React from "react"

export type ButtonPropsProps = {
  className: string
  children: React.ReactNode
  disabled: boolean
  type: "submit" | "button"
  onClick?: () => void
}

const Button = React.forwardRef<HTMLButtonElement, ButtonPropsProps>(function Button(props, ref) {
  const { className, children, type, onClick, disabled } = props

  return (
    <ButtonBlock className={className} type={type} ref={ref} onClick={onClick} disabled={disabled}>
      {children}
    </ButtonBlock>
  )
})

const ButtonBlock = styled.button<{ disabled: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: relative;
  box-sizing: border-box;
  background-color: transparent;
  outline: 0;
  border: 0;
  border-radius: 0;
  margin: 0;
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
  user-select: none;
  vertical-align: middle;
  text-decoration: none;
  color: inherit;
  padding: 1px 2px;
  font-size: 18px;
  font-weight: 400;
  font-family: Roboto;
  line-height: 20px;
`

export default Button
