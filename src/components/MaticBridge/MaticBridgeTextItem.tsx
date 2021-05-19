import React, { HTMLAttributes } from 'react'
import styled from 'styled-components'

interface Props extends HTMLAttributes<HTMLDivElement> {
  active?: boolean
  onClick?: any
  text: string
  value: string
}

export const DropdownTextItemWrapper = styled.div<{ active?: boolean }>`
  background-color: ${props => (props.active ? '#050F1B' : ' #0e151f')};
  border-bottom: 1px solid #000;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  font-weight: normal;
  line-height: 1.3;
  padding: 12px 8px;

  &:hover {
    background-color: #050f1b;
  }

  &:first-child {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }

  &:last-child {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    border-bottom: none;
  }
`

const TokenText = styled.span`
  float: right;
  font-size: 14px;
  font-weight: normal;
  line-height: 21px;
  text-align: right;
`

export const DropdownTextItem: React.FC<Props> = props => {
  const { text, value, onClick, ...restProps } = props

  return (
    <DropdownTextItemWrapper onClick={onClick} {...restProps}>
      {text}
      <TokenText>{value}</TokenText>
    </DropdownTextItemWrapper>
  )
}
