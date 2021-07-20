import React, { useEffect, useState } from 'react'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'
import styled from 'styled-components'
import { TYPE, StyledInternalLink } from '../../theme'
import DoubleCurrencyLogo from '../DoubleLogo'
import { ChainId, CurrencyAmount, ETHER, Fraction, JSBI, TokenAmount, WETH as UWETH } from '@uniswap/sdk'
import { ButtonPrimary } from '../Button'
import { StakingInfo, useRewardRate } from '../../state/stake/hooks'
import { useColor } from '../../hooks/useColor'
import { currencyId } from '../../utils/currencyId'
import { Break, CardNoise, CardBGImage } from './styled'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { useTotalSupply } from '../../data/TotalSupply'
import { usePair } from '../../data/Reserves'
import useUSDCPrice from '../../utils/useUSDCPrice'
import { LP_NIOX_ETH, NIOX, USDC } from '../../constants'
import { useApy } from 'data/Apy'
// import { BIG_INT_SECONDS_IN_WEEK } from '../../constants'

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

const Wrapper = styled(AutoColumn)<{ showBackground: boolean; bgColor: any }>`
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

const TopSection = styled.div`
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
export default function PoolCard({ stakingInfo, hasApy }: { stakingInfo: StakingInfo; hasApy?: boolean }) {
  const token0 = stakingInfo.tokens[0]
  const token1 = stakingInfo.tokens[1]
  console.log('staking info', stakingInfo)
  const currency0 = unwrappedToken(token0)
  const currency1 = unwrappedToken(token1)

  const isStaking = Boolean(stakingInfo.stakedAmount.greaterThan('0'))

  // get the color of the token
  const token = currency0 === ETHER ? token1 : token0
  const WETH = currency0 === ETHER ? token0 : token1
  const backgroundColor = useColor(token)

  const totalSupplyOfStakingToken = useTotalSupply(stakingInfo.stakedAmount.token)
  const [, stakingTokenPair] = usePair(...stakingInfo.tokens)

  // let returnOverMonth: Percent = new Percent('0')
  let valueOfTotalStakedAmountInWETH: TokenAmount | undefined
  if (totalSupplyOfStakingToken && stakingTokenPair) {
    // take the total amount of LP tokens staked, multiply by ETH value of all LP tokens, divide by all LP tokens
    valueOfTotalStakedAmountInWETH = new TokenAmount(
      WETH,
      JSBI.divide(
        JSBI.multiply(
          JSBI.multiply(stakingInfo.totalStakedAmount.raw, stakingTokenPair.reserveOf(WETH).raw),
          JSBI.BigInt(2) // this is b/c the value of LP shares are ~double the value of the WETH they entitle owner to
        ),
        totalSupplyOfStakingToken.raw
      )
    )
  }
  var show = isStaking || !stakingInfo.ended
  // get the USD value of staked WETH
  const USDPrice = useUSDCPrice(WETH)
  const valueOfTotalStakedAmountInUSDC =
    valueOfTotalStakedAmountInWETH && USDPrice?.quote(valueOfTotalStakedAmountInWETH)

  const ethNioxPoolRewardRate = useRewardRate(stakingInfo.stakingRewardAddress)
  const [totalEthNioxLiquidityInUSDC, setTotalEthNioxLiquidityInUSDC] = useState<CurrencyAmount | undefined>(undefined)

  useEffect(() => {
    async function fetchInfo() {
      let res = await fetch(
        'https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0xc813EA5e3b48BEbeedb796ab42A30C5599b01740&address=0xd1bc66660ba7edd64f0cc442ca5f32e5d199dfc6&tag=latest&apikey=R7M8G88CEH6E3AFKWZMMHZFXQ78NIRWRVP'
      ).then(res => res.json())
      const niox_amount = new TokenAmount(NIOX, res.result)
      res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=autonio').then(res =>
        res.json()
      )
      const niox_price = new Fraction(JSBI.BigInt(~~(res[0].current_price * 1000000)), JSBI.BigInt(1000000))
      res = await fetch(
        'https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2&address=0xd1bc66660ba7edd64f0cc442ca5f32e5d199dfc6&tag=latest&apikey=R7M8G88CEH6E3AFKWZMMHZFXQ78NIRWRVP'
      ).then(res => res.json())
      const eth_amount = new TokenAmount(UWETH[ChainId.MAINNET], res.result)
      res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=weth').then(res =>
        res.json()
      )
      const eth_price = new Fraction(JSBI.BigInt(res[0].current_price * 1000000), JSBI.BigInt(1000000))
      res = await fetch(
        'https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0xd1bc66660ba7edd64f0cc442ca5f32e5d199dfc6&address=0x31f985e479576b93B1307d423f369766726bE349&tag=latest&apikey=R7M8G88CEH6E3AFKWZMMHZFXQ78NIRWRVP'
      ).then(res => res.json())
      const lp_amount = new TokenAmount(LP_NIOX_ETH, res.result)
      res = await fetch(
        'https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=0xd1Bc66660bA7edD64F0cC442ca5F32e5d199dfc6&apikey=R7M8G88CEH6E3AFKWZMMHZFXQ78NIRWRVP'
      ).then(res => res.json())

      const lp_total_amount = new TokenAmount(LP_NIOX_ETH, res.result)

      const totalLiquidityUSD = JSBI.add(
        niox_amount.multiply(niox_price).quotient,
        eth_amount.multiply(eth_price).quotient
      )
      const lp_price = JSBI.divide(
        JSBI.multiply(totalLiquidityUSD, JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18))),
        lp_total_amount.raw
      )
      const totalEthNioxLiquidity = new TokenAmount(
        USDC,
        JSBI.multiply(lp_amount.multiply(lp_price).quotient, JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(6)))
      )
      setTotalEthNioxLiquidityInUSDC(totalEthNioxLiquidity)
    }

    if (hasApy) fetchInfo()
  }, [hasApy])

  const ethNioxPoolAPY = useApy(
    ethNioxPoolRewardRate?.multiply(`${60 * 60 * 24}`),
    totalEthNioxLiquidityInUSDC,
    'autonio'
  )

  return show ? (
    <Wrapper showBackground={isStaking} bgColor={backgroundColor}>
      <CardBGImage desaturate />
      <CardNoise />

      <TopSection>
        <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={24} />
        <TYPE.white fontWeight={600} fontSize={24} style={{ marginLeft: '8px' }}>
          {stakingInfo.name === 'NIOX-ETH OLD' ? stakingInfo.name : currency0.symbol + '-' + currency1.symbol}
        </TYPE.white>

        <StyledInternalLink
          to={`/farm/${currencyId(currency0)}/${currencyId(currency1)}/${stakingInfo.stakingRewardAddress}`}
          style={{ width: '100%' }}
        >
          <ButtonPrimary padding="8px" borderRadius="8px">
            {isStaking ? 'Manage' : 'Deposit'}
          </ButtonPrimary>
        </StyledInternalLink>
      </TopSection>

      <StatContainer>
        <RowBetween>
          <TYPE.white> Total deposited</TYPE.white>
          <TYPE.white>
            {valueOfTotalStakedAmountInUSDC
              ? `$${valueOfTotalStakedAmountInUSDC.toFixed(0, { groupSeparator: ',' })}`
              : `${valueOfTotalStakedAmountInWETH?.toSignificant(4, { groupSeparator: ',' }) ?? '-'} ETH`}
          </TYPE.white>
        </RowBetween>
        <RowBetween>
          {/* <TYPE.white> Pool rate </TYPE.white>
          <TYPE.white>
            {stakingInfo
              ? stakingInfo.active
                ? `${stakingInfo.totalRewardRate
                  ?.multiply(BIG_INT_SECONDS_IN_WEEK)
                  ?.toFixed(0, { groupSeparator: ',' })} UNI / week`
                : '0 UNI / week'
              : '-'}
          </TYPE.white> */}
          <TYPE.white> Pool rate </TYPE.white>
          <TYPE.white>{`${stakingInfo.totalRewardRate
            ?.multiply(`${60 * 60 * 24}`)
            ?.toFixed(0, { groupSeparator: ',' })} NIOX / day`}</TYPE.white>
        </RowBetween>
        {hasApy && (
          <RowBetween>
            <TYPE.white> APY </TYPE.white>
            <TYPE.white>{`${ethNioxPoolAPY?.toFixed(2)} %`}</TYPE.white>
          </RowBetween>
        )}
      </StatContainer>

      {isStaking && (
        <>
          <Break />
          <BottomSection showBackground={true}>
            <TYPE.black color={'white'} fontWeight={500}>
              <span>Your rate</span>
            </TYPE.black>

            <TYPE.black style={{ textAlign: 'right' }} color={'white'} fontWeight={500}>
              <span role="img" aria-label="wizard-icon" style={{ marginRight: '0.5rem' }}>
                ⚡
              </span>
              {/* {stakingInfo
                ? stakingInfo.active
                  ? `${stakingInfo.rewardRate
                    ?.multiply(BIG_INT_SECONDS_IN_WEEK)
                    ?.toSignificant(4, { groupSeparator: ',' })} UNI / week`
                  : '0 UNI / week'
                : '-'} */}
              {`${stakingInfo.rewardRate
                ?.multiply(`${60 * 60 * 24}`)
                ?.toSignificant(4, { groupSeparator: ',' })} NIOX / day`}
            </TYPE.black>
          </BottomSection>
        </>
      )}
    </Wrapper>
  ) : (
    <span style={{ width: 0, display: 'none' }}></span>
  )
}
