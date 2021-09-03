import React, { useEffect } from 'react'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
// import { STAKING_REWARDS_INFO, useStakingInfo } from '../../state/stake/hooks'
import { TYPE, StyledInternalLink } from '../../theme'
// import PoolCard from '../../components/earn/PoolCard'
import { RowBetween } from '../../components/Row'
import { CardSection, DataCard, CardNoise, CardBGImage } from '../../components/earn/styled'
// import { Countdown } from './Countdown'
// import Loader from '../../components/Loader'
// import { useActiveWeb3React } from '../../hooks'
// import Toggle from "../../components/Toggle"
import OldEarnSingle from '../OldEarnSingle'
// import Switch from 'react-switch'
// import { Moon, Sun } from 'react-feather'
// import { JSBI } from '@uniswap/sdk'
// import { BIG_INT_ZERO } from '../../constants'
// import { OutlineCard } from '../../components/Card'

import { ButtonPrimary } from '../../components/Button'
// import DoubleCurrencyLogo from '../../components/DoubleLogo'
// import { StyledInternalLink } from '../../theme'

// import { Break } from '../../components/earn/styled'
// import { NIOX, ETHER } from '../../constants'
// import { ChainId, CurrencyAmount, JSBI, TokenAmount } from '@uniswap/sdk'
// import useUSDCPrice from 'utils/useUSDCPrice'
// import { useApy } from 'data/Apy'
// import { useCurrency } from 'hooks/Tokens'

export const StyledMenuButton = styled.button`
  position: relative;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;
  background-color: ${({ theme }) => theme.bg3};
  margin-left: 8px;
  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg4};
  }

  svg {
    margin-top: 2px;
  }
  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`

// const nioxethdate = new Date(1625724000000)

const PageWrapper = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

const TopSection = styled(AutoColumn)`
  max-width: 720px;
  width: 100%;
`

// const Combined = styled.div`
//   display: flex;
//   justify-content: flex-end;
//   align-items: center;
// `

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
// const StatContainer = styled.div`
//   display: flex;
//   justify-content: space-between;
//   flex-direction: column;
//   gap: 12px;
//   margin-bottom: 1rem;
//   margin-right: 1rem;
//   margin-left: 1rem;
//   ${({ theme }) => theme.mediaWidth.upToSmall`
//   display: none;
// `};
// `

// const Wrapper = styled(AutoColumn)<{ showBackground: boolean; bgColor: any }>`
//   border-radius: 12px;
//   width: 100%;
//   overflow: hidden;
//   position: relative;
//   opacity: ${({ showBackground }) => (showBackground ? '1' : '1')};
//   /* background: ${({ theme, bgColor, showBackground }) =>
//     `radial-gradient(91.85% 100% at 1.84% 0%, ${bgColor} 0%, ${showBackground ? theme.black : theme.bg5} 100%) `}; */
//   background: radial-gradient(124.43% 206.68% at 10.39% -100.8%, #66D5BB 0%, #061324 100%);
//   color: ${({ theme, showBackground }) => (showBackground ? theme.white : theme.text1)} !important;

//   ${({ showBackground }) =>
//     showBackground &&
//     `  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
//     0px 24px 32px rgba(0, 0, 0, 0.01);`}
// `

// const TopSectionPc = styled.div`
//   display: grid;
//   grid-template-columns: 48px 1fr 120px;
//   grid-gap: 0px;
//   align-items: center;
//   padding: 1rem;
//   z-index: 1;
//   ${({ theme }) => theme.mediaWidth.upToSmall`
//     grid-template-columns: 48px 1fr 96px;
//   `};
// `

// const BottomSection = styled.div<{ showBackground: boolean }>`
//   padding: 12px 16px;
//   opacity: ${({ showBackground }) => (showBackground ? '1' : '0.4')};
//   border-radius: 0 0 12px 12px;
//   display: flex;
//   flex-direction: row;
//   align-items: baseline;
//   justify-content: space-between;
//   z-index: 1;
// `

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

// const CustomDataRow = styled(DataRow)<{ main?: boolean }>`
//   flex-direction: row-reverse;
//   margin-bottom: ${({ main }) => (main ? 0 : '24px')};

//   @media (max-width: 720px) {
//     flex-direction: initial;
//   }
// `

export default function Earn() {
  // const { chainId } = useActiveWeb3React()
  // console.log("chainid", chainId);
  // staking info for connected account
  // const stakingInfos = useStakingInfo()

  // const isStakingLP = false
  const isInLiveMode = true

  // const [singleMode, toggleSingleMode] = useState(true)

  /**
   * only show staking cards with balance
   * @todo only account for this if rewards are inactive
   */
  // const stakingInfosWithBalance = stakingInfos?.filter(s => JSBI.greaterThan(s.stakedAmount.raw, BIG_INT_ZERO))

  // toggle copy if rewards are inactive
  // const stakingRewardsExist = Boolean(typeof chainId === 'number' && (STAKING_REWARDS_INFO[chainId]?.length ?? 0) > 0)
  // console.log("akash")
  // console.log("stakingInfos", stakingInfos)
  // console.log("stakingInfosWithBalance", stakingInfosWithBalance)

  // const mainnetRewardsInfo = useStakingInfo(null, ChainId.MAINNET)
  // const ethNioxPoolRewardRate = useCustomNetRewardRate('0xa54db7a2ce0b1d802552c655b36672bcfe2c538d', ChainId.MAINNET)
  // const usdcPrice = useUSDCPrice()
  // const [totalEthNioxLiquidityInUSDC, setTotalEthNioxLiquidityInUSDC] = useState<CurrencyAmount | undefined>(undefined)
  // const staticEthNioxPoolRewardRate = new TokenAmount(NIOX, JSBI.BigInt(125000000))

  useEffect(() => {
    // async function fetchInfo() {
    //   let res = await fetch(
    //     'https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0xc813EA5e3b48BEbeedb796ab42A30C5599b01740&address=0xd1bc66660ba7edd64f0cc442ca5f32e5d199dfc6&tag=latest&apikey=R7M8G88CEH6E3AFKWZMMHZFXQ78NIRWRVP'
    //   ).then(res => res.json())
    //   const niox_amount = new TokenAmount(MAINNET_NIOX, res.result)
    //   res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=autonio').then(res =>
    //     res.json()
    //   )
    //   const niox_price = new Fraction(JSBI.BigInt(~~(res[0].current_price * 1000000)), JSBI.BigInt(1000000))
    //   res = await fetch(
    //     'https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2&address=0xd1bc66660ba7edd64f0cc442ca5f32e5d199dfc6&tag=latest&apikey=R7M8G88CEH6E3AFKWZMMHZFXQ78NIRWRVP'
    //   ).then(res => res.json())
    //   const eth_amount = new TokenAmount(WETH[ChainId.MAINNET], res.result)
    //   res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=weth').then(res =>
    //     res.json()
    //   )
    //   const eth_price = new Fraction(JSBI.BigInt(res[0].current_price * 1000000), JSBI.BigInt(1000000))
    //   res = await fetch(
    //     'https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0xd1bc66660ba7edd64f0cc442ca5f32e5d199dfc6&address=0x31f985e479576b93B1307d423f369766726bE349&tag=latest&apikey=R7M8G88CEH6E3AFKWZMMHZFXQ78NIRWRVP'
    //   ).then(res => res.json())
    //   const lp_amount = new TokenAmount(LP_NIOX_ETH, res.result)
    //   res = await fetch(
    //     'https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=0xd1Bc66660bA7edD64F0cC442ca5F32e5d199dfc6&apikey=R7M8G88CEH6E3AFKWZMMHZFXQ78NIRWRVP'
    //   ).then(res => res.json())
    //   const lp_total_amount = new TokenAmount(LP_NIOX_ETH, res.result)
    //   const totalLiquidityUSD = JSBI.add(
    //     niox_amount.multiply(niox_price).quotient,
    //     eth_amount.multiply(eth_price).quotient
    //   )
    //   const lp_price = JSBI.divide(
    //     JSBI.multiply(totalLiquidityUSD, JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18))),
    //     lp_total_amount.raw
    //   )
    //   const totalEthNioxLiquidity = new TokenAmount(
    //     USDC,
    //     JSBI.multiply(lp_amount.multiply(lp_price).quotient, JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(6)))
    //   )
    //   setTotalEthNioxLiquidityInUSDC(totalEthNioxLiquidity)
    // }
    // fetchInfo()
  }, [])

  // const ethNioxPoolAPY = useApy(
  //   ethNioxPoolRewardRate?.multiply(`${60 * 60 * 24}`),
  //   totalEthNioxLiquidityInUSDC,
  //   'autonio'
  // )

  // const staticLpPool = () => (

  //   <Wrapper showBackground={false} bgColor="#2172E5">
  //     <CardBGImage desaturate />
  //     <CardNoise />

  //     <TopSectionPc>
  //       <DoubleCurrencyLogo currency0={ETHER} currency1={NIOX} size={24} />
  //       <TYPE.white fontWeight={600} fontSize={24} style={{ marginLeft: '8px' }}>
  //         {'ETH'}-{'NIOX'}
  //       </TYPE.white>

  //       <StyledInternalLink to={`/farmNIOXUniLP`} style={{ width: '100%' }}>
  //         <ButtonPrimary padding="8px" borderRadius="8px">
  //           {isStakingLP ? 'Manage' : 'Deposit'}
  //         </ButtonPrimary>
  //       </StyledInternalLink>
  //     </TopSectionPc>

  //     <StatContainer>
  //       <RowBetween>
  //         <TYPE.white> Total deposited</TYPE.white>
  //         <TYPE.white>
  //           {totalEthNioxLiquidityInUSDC ? '$' + totalEthNioxLiquidityInUSDC.toFixed(0, { groupSeparator: ',' }) : '-'}
  //           {/* ? `$${valueOfTotalStakedAmountInUSDC.toFixed(0, { groupSeparator: ',' })}`
  //             : `${valueOfTotalStakedAmountInWETH?.toSignificant(4, { groupSeparator: ',' }) ?? '-'} ETH`} */}
  //         </TYPE.white>
  //       </RowBetween>
  //       <RowBetween>
  //         <TYPE.white> Pool rate </TYPE.white>
  //         <TYPE.white>
  //           {staticEthNioxPoolRewardRate.toFixed(0, { groupSeparator: ',' })} NIOX / day
  //           {/* 9,996 NIOX / day */}
  //           {/* } */}
  //         </TYPE.white>
  //       </RowBetween>

  //       <RowBetween>
  //         <TYPE.white> APY </TYPE.white>
  //         <TYPE.white>{`${ethNioxPoolAPY?.toFixed(2)} %`}</TYPE.white>
  //       </RowBetween>
  //     </StatContainer>

  //     {isStakingLP && (
  //       <>
  //         <Break />
  //         <BottomSection showBackground={true}>
  //           <TYPE.black color={'white'} fontWeight={500}>
  //             <span>*Uniswap NIOX LP Pool</span>
  //           </TYPE.black>

  //           <TYPE.black style={{ textAlign: 'right', display: 'none' }} color={'white'} fontWeight={500}>
  //             <span role="img" aria-label="wizard-icon" style={{ marginRight: '0.5rem' }}>
  //               ⚡
  //             </span>
  //             {/* {`${stakingInfo.rewardRate
  //               ?.multiply(`${60 * 60 * 24}`)
  //               ?.toSignificant(4, { groupSeparator: ',' })} */}
  //             NIOX / day`
  //             {/* } */}
  //           </TYPE.black>
  //         </BottomSection>
  //       </>
  //     )}
  //   </Wrapper>
  //   // </div>
  // )

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
                <StyledInternalLink to="/archive">
                  {/* <ExternalLink id={`old-pools-link`} href={'http://swap.smartdex.app/#/archive'}> */}
                  <ButtonPrimary padding="8px" borderRadius="8px">
                    Archived Pools
                  </ButtonPrimary>
                </StyledInternalLink>
                {/* </ExternalLink> */}
              </RowBetween>
              {/* <ExternalLink style={{ color: 'white', textDecoration: 'underline' }} href={'http://swap.smartdex.app/#/archive'} target="_blank">
                <TYPE.white fontSize={14}>Coming Soon</TYPE.white>
              </ExternalLink> */}
            </AutoColumn>
          </CardSection>
          <CardBGImage />
          <CardNoise />
        </DataCard>
      </TopSection>

      <AutoColumn gap="lg" style={{ width: '100%', maxWidth: '720px' }}>
        <DataRow style={{ alignItems: 'baseline' }}>
          <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>Participating pools</TYPE.mediumHeader>
          {/* <Combined>
            <TYPE.white fontSize={14} style={{ margin: '5px' }}>
              Archived Dual Token
            </TYPE.white>

            <Switch
              onChange={() => toggleSingleMode(!singleMode)}
              height={22}
              width={40}
              offHandleColor="#acca27"
              uncheckedIcon={false}
              checkedIcon={false}
              onColor="#acca27"
              checked={singleMode}
            />
            <TYPE.white fontSize={14} style={{ margin: '5px' }}>
              Single Token
            </TYPE.white>
          </Combined> */}
        </DataRow>
        {/* <CustomDataRow main={true}>
          <Countdown exactEnd={nioxethdate} exactRewardsDurationDays={42} />
        </CustomDataRow> */}
        {/* {singleMode && isInLiveMode && staticLpPool()} */}

        {/* //static eth-niox pool card end  */}
        <OldEarnSingle />
        {/* {!singleMode && isInLiveMode && (
          <>
            <TYPE.white fontWeight={600}>Archived Dual Token Pools</TYPE.white>
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
                    {console.log('stakingInfo.periodFinis', stakingInfo.periodFinish)}
                    {isInLiveMode && <Countdown exactEnd={stakingInfo.periodFinish} exactRewardsDurationDays={14} />}
                  </CustomDataRow>
                  <PoolCard stakingInfo={stakingInfo} isOld={false} isSingle={false} />
                </div>
              ))
            )}
          </>
        )} */}

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
