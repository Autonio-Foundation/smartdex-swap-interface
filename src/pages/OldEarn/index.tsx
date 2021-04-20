import React from 'react'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { OLD_STAKING_REWARDS_INFO, useOldStakingInfo } from '../../state/stake/hooks'
import { TYPE, ExternalLink } from '../../theme'
import PoolCard from '../../components/earn/PoolCard'
import { RowBetween } from '../../components/Row'
import { CardSection, DataCard, CardNoise, CardBGImage } from '../../components/earn/styled'
import { Countdown } from './Countdown'
import Loader from '../../components/Loader'
import { useActiveWeb3React } from '../../hooks'
// import { JSBI } from '@uniswap/sdk'
// import { BIG_INT_ZERO } from '../../constants'
// import { OutlineCard } from '../../components/Card'

import DoubleCurrencyLogo from '../../components/DoubleLogo'
import { StyledInternalLink } from '../../theme'
import { ButtonPrimary } from '../../components/Button'
import { Break } from '../../components/earn/styled'
import { NIOX, ETHER } from '../../constants'

const PageWrapper = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

const TopSection = styled(AutoColumn)`
  max-width: 720px;
  width: 100%;
`

// const PoolSection = styled.div`
//   display: grid;
//   grid-template-columns: 1fr;
//   column-gap: 10px;
//   row-gap: 15px;
//   width: 100%;
//   justify-self: center;
// `

const DataRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
flex-direction: column;
`};
`

// for pool card
const StatContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 1rem;
  margin-right: 1rem;
  margin-left: 1rem;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  display: none;
`};
`

const Wrapper = styled(AutoColumn) <{ showBackground: boolean; bgColor: any }>`
  border-radius: 12px;
  width: 100%;
  overflow: hidden;
  position: relative;
  opacity: ${({ showBackground }) => (showBackground ? '1' : '1')};
  /* background: ${({ theme, bgColor, showBackground }) =>
    `radial-gradient(91.85% 100% at 1.84% 0%, ${bgColor} 0%, ${showBackground ? theme.black : theme.bg5} 100%) `}; */
  background: radial-gradient(124.43% 206.68% at 10.39% -100.8%, #66D5BB 0%, #061324 100%);
  color: ${({ theme, showBackground }) => (showBackground ? theme.white : theme.text1)} !important;

  ${({ showBackground }) =>
    showBackground &&
    `  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);`}
`

const TopSectionPc = styled.div`
  display: grid;
  grid-template-columns: 48px 1fr 120px;
  grid-gap: 0px;
  align-items: center;
  padding: 1rem;
  z-index: 1;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    grid-template-columns: 48px 1fr 96px;
  `};
`

const BottomSection = styled.div<{ showBackground: boolean }>`
  padding: 12px 16px;
  opacity: ${({ showBackground }) => (showBackground ? '1' : '0.4')};
  border-radius: 0 0 12px 12px;
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
  z-index: 1;
`

const ComingSoonWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`
// const ETHER = new Token(ChainId.MATIC, '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', 18, 'ETH', 'Ether')

// const ETH = new Token(137, "0xad684e79CE4b6D464f2Ff7c3FD51646892e24b96", 4, "NIOX", "Autonio");

// const NIOX = new Token(137, "0xad684e79CE4b6D464f2Ff7c3FD51646892e24b96", 4, "NIOX", "Autonio");

// const CustomDataRow = styled(RowBetween)`
//   flex-direction: 'row-reverse';
//   margin-bottom: '24px';

//   @media (max-width: 720px) {
//     flex-direction: column;
//   }
// `

const CustomDataRow = styled(DataRow)`
  flex-direction: row-reverse;
  margin-bottom: 24px;

  @media (max-width: 720px) {
    flex-direction: initial;
  }
`

export default function OldEarn() {
  const { chainId } = useActiveWeb3React()
  // console.log("chainid", chainId);
  // staking info for connected account
  const stakingInfos = useOldStakingInfo()

  const isStakingLP = false
  const isInLiveMode = true

  /**
   * only show staking cards with balance
   * @todo only account for this if rewards are inactive
   */
  // const stakingInfosWithBalance = stakingInfos?.filter(s => JSBI.greaterThan(s.stakedAmount.raw, BIG_INT_ZERO))

  // toggle copy if rewards are inactive
  const stakingRewardsExist = Boolean(typeof chainId === 'number' && (OLD_STAKING_REWARDS_INFO[chainId]?.length ?? 0) > 0)
  // console.log("akash")
  // console.log("stakingInfos", stakingInfos)
  // console.log("stakingInfosWithBalance", stakingInfosWithBalance)

  const staticLpPool = () => (
    <Wrapper showBackground={false} bgColor="#2172E5">
      <CardBGImage desaturate />
      <CardNoise />

      <TopSectionPc>
        <DoubleCurrencyLogo currency0={ETHER} currency1={NIOX} size={24} />
        <TYPE.white fontWeight={600} fontSize={24} style={{ marginLeft: '8px' }}>
          {'ETH'}-{'NIOX'}
        </TYPE.white>

        <StyledInternalLink to={`/farmNIOXUniLP`} style={{ width: '100%' }}>
          <ButtonPrimary padding="8px" borderRadius="8px">
            {isStakingLP ? 'Manage' : 'Deposit'}
          </ButtonPrimary>
        </StyledInternalLink>
      </TopSectionPc>

      <StatContainer>
        <RowBetween>
          <TYPE.white> Total deposited</TYPE.white>
          <TYPE.white>
            -
            {/* {valueOfTotalStakedAmountInUSDC
              ? `$${valueOfTotalStakedAmountInUSDC.toFixed(0, { groupSeparator: ',' })}`
              : `${valueOfTotalStakedAmountInWETH?.toSignificant(4, { groupSeparator: ',' }) ?? '-'} ETH`} */}
          </TYPE.white>
        </RowBetween>
        <RowBetween>
          <TYPE.white> Pool rate </TYPE.white>
          <TYPE.white>
            {/* {`${stakingInfo.totalRewardRate
            ?.multiply(`${60 * 60 * 24}`)
            ?.toFixed(0, { groupSeparator: ',' })} */}
            9,996 NIOX / day
            {/* } */}
          </TYPE.white>
        </RowBetween>
      </StatContainer>

      {isStakingLP && (
        <>
          <Break />
          <BottomSection showBackground={true}>
            <TYPE.black color={'white'} fontWeight={500}>
              <span>*Uniswap NIOX LP Pool</span>
            </TYPE.black>

            <TYPE.black style={{ textAlign: 'right', display: 'none' }} color={'white'} fontWeight={500}>
              <span role="img" aria-label="wizard-icon" style={{ marginRight: '0.5rem' }}>
                ⚡
              </span>
              {/* {`${stakingInfo.rewardRate
                ?.multiply(`${60 * 60 * 24}`)
                ?.toSignificant(4, { groupSeparator: ',' })} */}
              NIOX / day`
              {/* } */}
            </TYPE.black>
          </BottomSection>
        </>
      )}
    </Wrapper>
  )

  return (
    <PageWrapper gap="lg" justify="center">
      <TopSection gap="md">
        <DataCard>
          <CardBGImage />
          <CardNoise />
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.white fontWeight={600}>Smartdex liquidity mining</TYPE.white>
              </RowBetween>
              <RowBetween>
                <TYPE.white fontSize={14}>Deposit your Liquidity Provider tokens to receive NIOX.</TYPE.white>
              </RowBetween>{' '}
              <RowBetween>
                <ExternalLink id={`old-pools-link`} href={'http://swap.smartdex.app/#/farm'} >

                  <ButtonPrimary padding="8px" borderRadius="8px">
                    New Pools
                  </ButtonPrimary>
                </ExternalLink>
              </RowBetween>
              <ExternalLink style={{ color: 'white', textDecoration: 'underline' }} href="" target="_blank">
                {/* <TYPE.white fontSize={14}>Coming Soon</TYPE.white> */}
              </ExternalLink>
            </AutoColumn>
          </CardSection>
          <CardBGImage />
          <CardNoise />
        </DataCard>
      </TopSection>

      <AutoColumn gap="lg" style={{ width: '100%', maxWidth: '720px' }}>
        <DataRow style={{ alignItems: 'baseline' }}>
          <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>Participating pools</TYPE.mediumHeader>
          {/* {isInLiveMode && <Countdown />} */}
        </DataRow>
        {/* // working section staking */}
        {/* //static eth-niox pool card */}

        {isInLiveMode && staticLpPool()}

        {/* //static eth-niox pool card end  */}

        {isInLiveMode && (
          <>
            {stakingRewardsExist && stakingInfos?.length === 0 ? (
              <Loader style={{ margin: 'auto' }} />
            ) : !stakingRewardsExist ? (
              ''
            ) : (
              // 'No active rewards'
              stakingInfos?.map(stakingInfo => (
                // need to sort by added liquidity here
                <div key={stakingInfo.stakingRewardAddress}>
                  <CustomDataRow>
                    {isInLiveMode && <Countdown exactEnd={stakingInfo.periodFinish} exactRewardsDurationDays={14} />}
                  </CustomDataRow>
                  <PoolCard stakingInfo={stakingInfo} />
                </div>
              ))
            )}
          </>
        )}

        {!isInLiveMode && (
          <ComingSoonWrapper>
            <TYPE.white>Coming Soon</TYPE.white>
          </ComingSoonWrapper>
        )}

        {/* till here akash */}
        {/* <PoolSection>
          {stakingRewardsExist && stakingInfos?.length === 0 ? (
            <Loader style={{ margin: 'auto' }} />
          ) : !stakingRewardsExist ? (
            <OutlineCard>Coming Soon</OutlineCard>
          ) : stakingInfos?.length !== 0 && stakingInfosWithBalance.length === 0 ? (
            <OutlineCard>Coming Soon</OutlineCard>
          ) : (
                  stakingInfosWithBalance?.map(stakingInfo => {
                    // need to sort by added liquidity here
                    return <PoolCard key={stakingInfo.stakingRewardAddress} stakingInfo={stakingInfo} />
                  })
                )}
        </PoolSection> */}
      </AutoColumn>
    </PageWrapper>
  )
}
