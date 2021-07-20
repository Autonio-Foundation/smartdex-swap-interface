import { ChainId, CurrencyAmount, JSBI, Token, TokenAmount, Pair, WETH, Fraction } from '@uniswap/sdk'
import { useMemo } from 'react'
import {
  UNI,
  NIOX
  // USDC,
  // DEV,
  // XENO,
  // ADNIOX

  // ADDY,
  // WMATIC
} from '../../constants'
import { STAKING_REWARDS_INTERFACE } from '../../constants/abis/staking-rewards'
import { useActiveWeb3React } from '../../hooks'
import { NEVER_RELOAD, useMultipleContractSingleData } from '../multicall/hooks'
import { tryParseAmount } from '../swap/hooks'

export const STAKING_GENESIS = 1617384642

export const REWARDS_DURATION_DAYS = 7

// TODO add staking rewards addresses here
export const STAKING_REWARDS_INFO: {
  [chainId in ChainId]?: {
    tokens: [Token, Token]
    stakingRewardAddress: string
    ended: boolean
    name: string
    lp: string
    baseToken: Token
  }[]
} = {
  // [ChainId.MATIC]: [//TODO: MATIC
  //old
  // {
  //   tokens: [NIOX, USDC],
  //   // stakingRewardAddress: '0x817cb2bfd78ec89f223476c2975aecd723483970',
  //   stakingRewardAddress: '0xf6bfe82cde3385102acc56eae8a5e92c62963021',
  //   ended: false,

  //   name: '',
  //   lp: '',
  //   // lp: '0xF4c10794E8789ACbc134c043a0e222ce586256EF',
  //   baseToken: USDC
  //   //STAKINGREWARDSFACTORY- 0x5D490e48417Dd2F6165CEB3b2c04352675278998
  // },
  // {
  //   tokens: [NIOX, DEV],
  //   stakingRewardAddress: '0xe4c7a21995c017d43236d03b7253b86faff9219a',
  //   ended: false,

  //   name: 'test',
  //   lp: '',
  //   baseToken: DEV
  //   //STAKINGREWARDSFACTORY- 0x5D490e48417Dd2F6165CEB3b2c04352675278998
  // },

  //   {
  //     tokens: [NIOX, USDC],
  //     // stakingRewardAddress: '0x817cb2bfd78ec89f223476c2975aecd723483970',
  //     stakingRewardAddress: '0x201bd0fd1bcedbff453cc2d0b66d0fbbe9453643',
  //     ended: false,

  //     name: '',
  //     lp: '',
  //     // lp: '0xF4c10794E8789ACbc134c043a0e222ce586256EF',
  //     baseToken: USDC
  //     //STAKINGREWARDSFACTORY- 0x3F50aE525c46ab692e5F174f81C9EB5a3e3578D6
  //   },
  //   {
  //     tokens: [WMATIC, DEV],
  //     stakingRewardAddress: '0x7112b0951cfb90b330ede1647dd41cae35a82cd5',
  //     ended: false,

  //     name: '',
  //     lp: '0xaE83008e1e146F0b28eA81b23904cda2b9CFE9F1',
  //     // lp: '0xF4c10794E8789ACbc134c043a0e222ce586256EF',
  //     baseToken: DEV
  //     //STAKINGREWARDSFACTORY- 0x3F50aE525c46ab692e5F174f81C9EB5a3e3578D6
  //   },

  // ],
  [ChainId.ROPSTEN]: [
    //TODO: ropsten
    // ahead 5 hrs not showing staking btn
    // {
    //   tokens: [WETHs, XENO],
    //   stakingRewardAddress: '0x9091a6e09257Affb6f3dC61Cb3EC1aFDE823bb2A',
    //   ended: false,
    //   name: '',
    //   lp: '0xc6A85a5c17Ed118Dd772ACD049bB13670967683a', //xeno weth
    //   baseToken: XENO
    //   // STAKINGREWARDSFACTORY- 0x9DB877d24CA555c294ea71B08455129A267da49e
    // },
    // working
    // {
    //   tokens: [WETHs, XENO],
    //   stakingRewardAddress: '0x5dB9c53f7ebd863980BCb8770990A43e91a5a101',
    //   ended: false,
    //   name: '',
    //   lp: '0xc6A85a5c17Ed118Dd772ACD049bB13670967683a', //xeno weth
    //   baseToken: XENO
    //   // STAKINGREWARDSFACTORY- 0x544fC329a7c9874eCabAe594280BB8BAC1528bAc
    // },
    // {
    //   tokens: [ADNIOX, WETHs],
    //   stakingRewardAddress: '0x40d0EbEf5806E74f3590847fB55Aa58533BBcB44',
    //   ended: false,
    //   name: '',
    //   lp: '0x860d971Bd51a9ECf9E786eA189890060E1CAE5A2', //xeno weth
    //   baseToken: WETHs
    //   // STAKINGREWARDSFACTORY- 0x544fC329a7c9874eCabAe594280BB8BAC1528bAc
    // }
  ],
  [ChainId.MAINNET]: [
    //TODO: mainnet
    {
      tokens: [NIOX, WETH[ChainId.MAINNET]],
      stakingRewardAddress: '0x31f985e479576b93B1307d423f369766726bE349',
      ended: false,

      name: 'NIOX-ETH',
      lp: '0xd1Bc66660bA7edD64F0cC442ca5F32e5d199dfc6', //niox-weth lp
      baseToken: WETH[ChainId.MAINNET]
      // STAKINGREWARDSFACTORY- 0xdda456d46f72ebbc5af0d833da3c37ed5242de75
    },
    {
      tokens: [NIOX, WETH[ChainId.MAINNET]],
      stakingRewardAddress: '0xA54dB7a2CE0b1D802552c655B36672bcFe2C538d',
      ended: false,

      name: 'NIOX-ETH OLD1',
      lp: '0xd1Bc66660bA7edD64F0cC442ca5F32e5d199dfc6', //niox-weth lp
      baseToken: WETH[ChainId.MAINNET]
      // STAKINGREWARDSFACTORY- 0xdda456d46f72ebbc5af0d833da3c37ed5242de75
    },
    {
      tokens: [NIOX, WETH[ChainId.MAINNET]],
      stakingRewardAddress: '0x7E48f826Dd105EC323DD25402dAF02d84a84CbE4',
      ended: false,

      name: 'NIOX-ETH OLD2',
      lp: '0xd1Bc66660bA7edD64F0cC442ca5F32e5d199dfc6', //niox-weth lp
      baseToken: WETH[ChainId.MAINNET]
      // STAKINGREWARDSFACTORY- 0xb43095432C268a01Efe7033Cfd84c8Ea9B3d1C18
    }
  ]
}

export interface StakingInfo {
  // the address of the reward contract
  stakingRewardAddress: string
  // the tokens involved in this pair
  tokens: [Token, Token]
  // the amount of token currently staked, or undefined if no account
  stakedAmount: TokenAmount
  // the amount of reward token earned by the active account, or undefined if no account
  earnedAmount: TokenAmount
  // the total amount of token staked in the contract
  totalStakedAmount: TokenAmount
  // the amount of token distributed per second to all LPs, constant
  totalRewardRate: TokenAmount
  // the current amount of token distributed to the active account per second.
  // equivalent to percent of total supply * reward rate
  rewardRate: TokenAmount
  // when the period ends
  periodFinish: Date | undefined

  ended: boolean

  name: string

  lp: string
  // calculates a hypothetical amount of token distributed to the active account per second.
  getHypotheticalRewardRate: (
    stakedAmount: TokenAmount,
    totalStakedAmount: TokenAmount,
    totalRewardRate: TokenAmount
  ) => TokenAmount
}

// gets the staking info from the network for the active chain id
export function useStakingInfo(pairToFilterBy?: Pair | null): StakingInfo[] {
  const { chainId, account } = useActiveWeb3React()

  const info = useMemo(
    () =>
      chainId
        ? STAKING_REWARDS_INFO[chainId]?.filter(stakingRewardInfo =>
            pairToFilterBy === undefined
              ? true
              : pairToFilterBy === null
              ? false
              : pairToFilterBy.involvesToken(stakingRewardInfo.tokens[0]) &&
                pairToFilterBy.involvesToken(stakingRewardInfo.tokens[1])
          ) ?? []
        : [],
    [chainId, pairToFilterBy]
  )

  const uni = chainId ? UNI[chainId] : undefined

  const rewardsAddresses = useMemo(() => info.map(({ stakingRewardAddress }) => stakingRewardAddress), [info])

  const accountArg = useMemo(() => [account ?? undefined], [account])

  // get all the info from the staking rewards contracts
  const balances = useMultipleContractSingleData(rewardsAddresses, STAKING_REWARDS_INTERFACE, 'balanceOf', accountArg)
  const earnedAmounts = useMultipleContractSingleData(rewardsAddresses, STAKING_REWARDS_INTERFACE, 'earned', accountArg)
  const totalSupplies = useMultipleContractSingleData(rewardsAddresses, STAKING_REWARDS_INTERFACE, 'totalSupply')

  // tokens per second, constants
  const rewardRates = useMultipleContractSingleData(
    rewardsAddresses,
    STAKING_REWARDS_INTERFACE,
    'rewardRate',
    undefined,
    NEVER_RELOAD
  )
  console.log('reward raete bc::', rewardRates)
  const periodFinishes = useMultipleContractSingleData(
    rewardsAddresses,
    STAKING_REWARDS_INTERFACE,
    'periodFinish',
    undefined,
    NEVER_RELOAD
  )

  return useMemo(() => {
    if (!chainId || !uni) return []

    return rewardsAddresses.reduce<StakingInfo[]>((memo, rewardsAddress, index) => {
      // these two are dependent on account
      const balanceState = balances[index]
      const earnedAmountState = earnedAmounts[index]

      // these get fetched regardless of account
      const totalSupplyState = totalSupplies[index]
      const rewardRateState = rewardRates[index]
      const periodFinishState = periodFinishes[index]

      if (
        // these may be undefined if not logged in
        !balanceState?.loading &&
        !earnedAmountState?.loading &&
        // always need these
        totalSupplyState &&
        !totalSupplyState.loading &&
        rewardRateState &&
        !rewardRateState.loading &&
        periodFinishState &&
        !periodFinishState.loading
      ) {
        if (
          balanceState?.error ||
          earnedAmountState?.error ||
          totalSupplyState.error ||
          rewardRateState.error ||
          periodFinishState.error
        ) {
          // console.log("addy", balanceState?.error,
          //   earnedAmountState?.error,
          //   totalSupplyState.error,
          //   rewardRateState.error,
          //   periodFinishState.error)
          console.error('Failed to load staking rewards info')
          return memo
        }

        // get the LP token
        const tokens = info[index].tokens
        const dummyPair = new Pair(new TokenAmount(tokens[0], '0'), new TokenAmount(tokens[1], '0'))
        // console.log("totalRewardRate raete bcsssssssssssss::", tokens)
        // check for account, if no account set to 0
        const lp = info[index].lp

        const stakedAmount = new TokenAmount(
          lp && lp !== '' ? new Token(1, lp, 18, 'SLP', 'Staked LP') : dummyPair.liquidityToken,
          JSBI.BigInt(balanceState?.result?.[0] ?? 0)
        )
        const totalStakedAmount = new TokenAmount(
          lp && lp !== '' ? new Token(1, lp, 18, 'SLP', 'Staked LP') : dummyPair.liquidityToken,
          JSBI.BigInt(totalSupplyState.result?.[0])
        )
        const totalRewardRate = new TokenAmount(uni, JSBI.BigInt(rewardRateState.result?.[0]))

        const getHypotheticalRewardRate = (
          stakedAmount: TokenAmount,
          totalStakedAmount: TokenAmount,
          totalRewardRate: TokenAmount
        ): TokenAmount => {
          return new TokenAmount(
            uni,
            JSBI.greaterThan(totalStakedAmount.raw, JSBI.BigInt(0))
              ? JSBI.divide(JSBI.multiply(totalRewardRate.raw, stakedAmount.raw), totalStakedAmount.raw)
              : JSBI.BigInt(0)
          )
        }

        const individualRewardRate = getHypotheticalRewardRate(stakedAmount, totalStakedAmount, totalRewardRate)

        const periodFinishMs = periodFinishState.result?.[0]?.mul(1000)?.toNumber()

        memo.push({
          stakingRewardAddress: rewardsAddress,
          tokens: info[index].tokens,
          ended: info[index].ended,
          name: info[index].name,
          lp: info[index].lp,
          periodFinish: periodFinishMs > 0 ? new Date(periodFinishMs) : undefined,
          earnedAmount: new TokenAmount(uni, JSBI.BigInt(earnedAmountState?.result?.[0] ?? 0)),
          rewardRate: individualRewardRate,
          totalRewardRate: totalRewardRate,
          stakedAmount: stakedAmount,
          totalStakedAmount: totalStakedAmount,
          getHypotheticalRewardRate
        })
      }
      return memo
    }, [])
  }, [balances, chainId, earnedAmounts, info, periodFinishes, rewardRates, rewardsAddresses, totalSupplies, uni])
}

export function useTotalUniEarned(): TokenAmount | undefined {
  const { chainId } = useActiveWeb3React()
  const uni = chainId ? UNI[chainId] : undefined
  const stakingInfos = useStakingInfo()

  return useMemo(() => {
    if (!uni) return undefined
    return (
      stakingInfos?.reduce(
        (accumulator, stakingInfo) => accumulator.add(stakingInfo.earnedAmount),
        new TokenAmount(uni, '0')
      ) ?? new TokenAmount(uni, '0')
    )
  }, [stakingInfos, uni])
}

// based on typed value
export function useDerivedStakeInfo(
  typedValue: string,
  stakingToken: Token,
  userLiquidityUnstaked: TokenAmount | undefined
): {
  parsedAmount?: CurrencyAmount
  error?: string
} {
  const { account } = useActiveWeb3React()

  const parsedInput: CurrencyAmount | undefined = tryParseAmount(typedValue, stakingToken)

  const parsedAmount =
    parsedInput && userLiquidityUnstaked && JSBI.lessThanOrEqual(parsedInput.raw, userLiquidityUnstaked.raw)
      ? parsedInput
      : undefined

  let error: string | undefined
  if (!account) {
    error = 'Connect Wallet'
  }
  if (!parsedAmount) {
    error = error ?? 'Enter an amount'
  }

  return {
    parsedAmount,
    error
  }
}

// based on typed value
export function useDerivedUnstakeInfo(
  typedValue: string,
  stakingAmount: TokenAmount
): {
  parsedAmount?: CurrencyAmount
  error?: string
} {
  const { account } = useActiveWeb3React()

  const parsedInput: CurrencyAmount | undefined = tryParseAmount(typedValue, stakingAmount.token)

  const parsedAmount = parsedInput && JSBI.lessThanOrEqual(parsedInput.raw, stakingAmount.raw) ? parsedInput : undefined

  let error: string | undefined
  if (!account) {
    error = 'Connect Wallet'
  }
  if (!parsedAmount) {
    error = error ?? 'Enter an amount'
  }

  return {
    parsedAmount,
    error
  }
}

export function useRewardRate(address: string): TokenAmount | Fraction {
  const rewardRates = useMultipleContractSingleData(
    [address],
    STAKING_REWARDS_INTERFACE,
    'rewardRate',
    undefined,
    NEVER_RELOAD
  )

  const rewardRateState = rewardRates ? rewardRates[0] : null

  return useMemo(() => {
    if (!rewardRateState || rewardRateState.loading) return new Fraction('0', '1')

    return new TokenAmount(NIOX, JSBI.BigInt(rewardRateState.result?.[0]))
  }, [rewardRateState])
}
