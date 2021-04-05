import { ChainId, CurrencyAmount, JSBI, Token, TokenAmount, Pair } from '@uniswap/sdk'
import { useMemo } from 'react'
import {
  UNI,
  NIOX,
  USDC,
  // DEV,
  XENO,
  ADDY,
  WMATIC
} from '../../constants'
import { STAKING_REWARDS_INTERFACE } from '../../constants/abis/staking-rewards'
import { useActiveWeb3React } from '../../hooks'
import { NEVER_RELOAD, useMultipleContractSingleData } from '../multicall/hooks'
import { tryParseAmount } from '../swap/hooks'

export const STAKING_GENESIS = 1617647400;

export const REWARDS_DURATION_DAYS = 7;

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
  [ChainId.MATIC]: [//TODO: MATIC mainnet
    {
      tokens: [WMATIC, USDC],
      stakingRewardAddress: '0xf40324f73991d02c7672f6ee6b1eb94b3eb3e40c',
      ended: false,

      name: '',
      lp: '',
      baseToken: USDC
      //STAKINGREWARDSFACTORY- 0xb43095432C268a01Efe7033Cfd84c8Ea9B3d1C18 mainnet matic
    },
    {
      tokens: [NIOX, USDC],
      stakingRewardAddress: '0xa54db7a2ce0b1d802552c655b36672bcfe2c538d',
      ended: false,

      name: '',
      lp: '',
      baseToken: USDC
      //STAKINGREWARDSFACTORY- 0xb43095432C268a01Efe7033Cfd84c8Ea9B3d1C18 mainnet matic
    },
    //test 
    // {
    //   tokens: [NIOX, USDC],
    //   // stakingRewardAddress: '0x817cb2bfd78ec89f223476c2975aecd723483970',
    //   stakingRewardAddress: '0xb7369c866aca7a2e216fdb9787618821b715b696',
    //   ended: false,

    //   name: '',
    //   lp: '',
    //   // lp: '0xF4c10794E8789ACbc134c043a0e222ce586256EF',
    //   baseToken: USDC
    //   //STAKINGREWARDSFACTORY- 0x193421c8cB46C3f8CcBFBda72863e395E05A002A
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

    // {
    //   tokens: [NIOX, USDC],
    //   // stakingRewardAddress: '0x817cb2bfd78ec89f223476c2975aecd723483970',
    //   stakingRewardAddress: '0x201bd0fd1bcedbff453cc2d0b66d0fbbe9453643',
    //   ended: false,

    //   name: '',
    //   lp: '',
    //   // lp: '0xF4c10794E8789ACbc134c043a0e222ce586256EF',
    //   baseToken: USDC
    //   //STAKINGREWARDSFACTORY- 0x3F50aE525c46ab692e5F174f81C9EB5a3e3578D6
    // },
    // {
    //   tokens: [WMATIC, DEV],
    //   stakingRewardAddress: '0x7112b0951cfb90b330ede1647dd41cae35a82cd5',
    //   ended: false,

    //   name: '',
    //   lp: '0xaE83008e1e146F0b28eA81b23904cda2b9CFE9F1',
    //   // lp: '0xF4c10794E8789ACbc134c043a0e222ce586256EF',
    //   baseToken: DEV
    //   //STAKINGREWARDSFACTORY- 0x3F50aE525c46ab692e5F174f81C9EB5a3e3578D6
    // },

  ],
  [ChainId.ROPSTEN]: [//TODO: ropsten
    {
      tokens: [XENO, ADDY],
      stakingRewardAddress: '0xd0d51827C8D63fc6cF3d493977AC46f963D92C29',
      ended: false,

      name: '',
      lp: '',
      baseToken: XENO
      //STAKINGREWARDSFACTORY- 0x5D490e48417Dd2F6165CEB3b2c04352675278998
    },

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
          console.log("addy", balanceState?.error,
            earnedAmountState?.error,
            totalSupplyState.error,
            rewardRateState.error,
            periodFinishState.error)
          console.error('Failed to load staking rewards info')
          return memo
        }

        // get the LP token
        const tokens = info[index].tokens
        const dummyPair = new Pair(new TokenAmount(tokens[0], '0'), new TokenAmount(tokens[1], '0'))

        // check for account, if no account set to 0
        const lp = info[index].lp;

        const stakedAmount = new TokenAmount(lp && lp !== '' ? new Token(137, lp, 18, "SLP", "Staked LP") : dummyPair.liquidityToken, JSBI.BigInt(balanceState?.result?.[0] ?? 0))
        const totalStakedAmount = new TokenAmount(lp && lp !== '' ? new Token(137, lp, 18, "SLP", "Staked LP") : dummyPair.liquidityToken, JSBI.BigInt(totalSupplyState.result?.[0]))
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
