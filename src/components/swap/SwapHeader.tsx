import React from 'react'
import styled from 'styled-components'
import Settings from '../Settings'
import Row, { RowBetween } from '../Row'
import { TYPE } from '../../theme'
import { Button, Text } from 'rebass/styled-components'
import { MouseoverTooltip } from '../../components/Tooltip'

const StyledSwapHeader = styled.div`
  padding: 12px 1rem 0px 1.5rem;
  margin-bottom: -4px;
  width: 100%;
  max-width: 420px;
  color: ${({ theme }) => theme.text2};
`

const StyledModelButton = styled(Button)<{
  active?: boolean
}>`
  padding: 7px 11px;
  background-color: ${({ active }) => (active ? '#1A1F28' : 'transparent')};
  border-radius: 7px;
  margin: 0 4px;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};

  &:hover {
    background-color: ${({ disabled }) => (disabled ? 'transparent' : '#1A1F28')};
    opacity: ${({ disabled }) => (disabled ? 0.5 : 0.8)};
  }
`

export default function SwapHeader() {
  return (
    <StyledSwapHeader>
      <RowBetween>
        <Row>
          <TYPE.black fontWeight={500} mr="1rem">Swap</TYPE.black>
          <StyledModelButton active={true}>
            <Text fontSize={14}>market</Text>
          </StyledModelButton>
          <MouseoverTooltip text="Coming Soon">
            <StyledModelButton disabled={true}>
                <Text fontSize={14}>limit</Text>
            </StyledModelButton>
          </MouseoverTooltip>
        </Row>
        <Settings />
      </RowBetween>
    </StyledSwapHeader>
  )
}
