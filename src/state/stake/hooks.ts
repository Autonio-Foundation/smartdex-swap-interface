import { ChainId, CurrencyAmount, JSBI, Token, TokenAmount, Pair, Fraction } from '@uniswap/sdk'
import { useMemo } from 'react'
import { UNI, NIOX, USDC, MaticWETH,/* XENO, ADDY,*/ WMATIC, ALOHA, GLQ, AGI, ETHER, PBTC,/* DEV, TEST,*/ DIGI } from '../../constants'
import { STAKING_REWARDS_INTERFACE } from '../../constants/abis/staking-rewards1'
import { STAKING_REWARDS_INTERFACE_OLD } from '../../constants/abis/staking-rewards'
import { useActiveWeb3React } from '../../hooks'
import { NEVER_RELOAD, useMultipleContractSingleData } from '../multicall/hooks'
import { tryParseAmount } from '../swap/hooks'

export const STAKING_GENESIS = 1617647400

export const REWARDS_DURATION_DAYS = 5

// TODO add staking rewards addresses here
export const OLD_STAKING_REWARDS_INFO: {
  [chainId in ChainId]?: {
    tokens: [Token, Token]
    stakingRewardAddress: string
    ended: boolean
    name: string
    lp: string
    baseToken: Token
  }[]
} = {
  [ChainId.MATIC]: [
    ///////////////////////new one expiring after 1 day

    {
      tokens: [NIOX, USDC],
      stakingRewardAddress: '0x7a1137cee3714d8b31bf2e9ba460e61ccd54fab4',
      ended: false,

      name: '',
      lp: '',
      baseToken: USDC
      //STAKINGREWARDSFACTORY- 0x1CdbA3EdFe9Eb9Fb42dcB409b49e633bC4ea95e7 mainnet matic
    },
    {
      tokens: [WMATIC, USDC],
      stakingRewardAddress: '0xe0af829866c719aaa88165323fcd8487b981fd3f',
      ended: false,

      name: '',
      lp: '',
      baseToken: USDC
      //STAKINGREWARDSFACTORY- 0x1CdbA3EdFe9Eb9Fb42dcB409b49e633bC4ea95e7 mainnet matic
    },
    {
      tokens: [MaticWETH, USDC],
      stakingRewardAddress: '0x73eb490b3acd5e36a365bb6f934bd85977ad7068',
      ended: false,

      name: '',
      lp: '',
      baseToken: USDC
      //STAKINGREWARDSFACTORY- 0x1CdbA3EdFe9Eb9Fb42dcB409b49e633bC4ea95e7 mainnet matic
    },
    {
      tokens: [GLQ, MaticWETH],
      stakingRewardAddress: '0x96d287d25bbbd87910fd28f21fbfa590dfb33b96',
      ended: false,

      name: '',
      lp: '',
      baseToken: MaticWETH
      //STAKINGREWARDSFACTORY- 0x1CdbA3EdFe9Eb9Fb42dcB409b49e633bC4ea95e7 mainnet matic
    },
    {
      tokens: [ALOHA, NIOX],
      stakingRewardAddress: '0x317875cbe5f64f14d7e9343703cac9c1501ddb05',
      ended: false,
      name: '',
      lp: '',
      baseToken: NIOX
      //STAKINGREWARDSFACTORY- 0x1CdbA3EdFe9Eb9Fb42dcB409b49e633bC4ea95e7 mainnet matic
    },

    {
      tokens: [PBTC, USDC],
      stakingRewardAddress: '0xa6d04447695c38d4c687cb25330b22c840223e29',
      ended: false,
      name: '',
      lp: '',
      baseToken: USDC
    },
    ///////////////////////new one expiring after 1 day



    //TODO: MATIC mainnet
    ////////////////////////////////////////////////new one ////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    {
      tokens: [NIOX, USDC],
      stakingRewardAddress: '0x9c0ef78a30aa2d43f6f1aac677e227c43eb35356',
      ended: false,

      name: '',
      lp: '',
      baseToken: USDC
      //STAKINGREWARDSFACTORY- 0xb43095432C268a01Efe7033Cfd84c8Ea9B3d1C18 mainnet matic
    },
    {
      tokens: [WMATIC, USDC],
      stakingRewardAddress: '0x16c88e00f414436d4abbc859e5d99ec1868474af',
      ended: false,

      name: '',
      lp: '',
      baseToken: USDC
      //STAKINGREWARDSFACTORY- 0xb43095432C268a01Efe7033Cfd84c8Ea9B3d1C18 mainnet matic
    },
    {
      tokens: [MaticWETH, USDC],
      stakingRewardAddress: '0xae4a735567bb1b351bebaa252c88d2ebc2fa7e56',
      ended: false,

      name: '',
      lp: '',
      baseToken: USDC
      //STAKINGREWARDSFACTORY- 0xb43095432C268a01Efe7033Cfd84c8Ea9B3d1C18 mainnet matic
    },
    {
      tokens: [AGI, NIOX],
      stakingRewardAddress: '0x4e59aa8fe2ad4374467f7e2edb75ebc6a1002d92',
      ended: false,

      name: '',
      lp: '',
      baseToken: NIOX
      //STAKINGREWARDSFACTORY- 0xb43095432C268a01Efe7033Cfd84c8Ea9B3d1C18 mainnet matic
    },
    {
      tokens: [GLQ, MaticWETH],
      stakingRewardAddress: '0x0de7482edc5aa30e96f81642cbdad75e550c6fd4',
      ended: false,

      name: '',
      lp: '',
      baseToken: MaticWETH
      //STAKINGREWARDSFACTORY- 0xb43095432C268a01Efe7033Cfd84c8Ea9B3d1C18 mainnet matic
    },
    {
      tokens: [ALOHA, NIOX],
      stakingRewardAddress: '0xaec962e533a350495c38507dd0ef1becc138af66',
      ended: false,

      name: '',
      lp: '',
      baseToken: NIOX
      //STAKINGREWARDSFACTORY- 0xb43095432C268a01Efe7033Cfd84c8Ea9B3d1C18 mainnet matic
    },
    ////////////////////////////////////old one //////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    {
      tokens: [WMATIC, USDC],
      stakingRewardAddress: '0xf40324f73991d02c7672f6ee6b1eb94b3eb3e40c',
      ended: false,

      name: 'WMATIC-USDC OLD',
      lp: '',
      baseToken: USDC
      //STAKINGREWARDSFACTORY- 0xb43095432C268a01Efe7033Cfd84c8Ea9B3d1C18 mainnet matic
    },
    {
      tokens: [NIOX, USDC],
      stakingRewardAddress: '0xa54db7a2ce0b1d802552c655b36672bcfe2c538d',
      ended: false,

      name: 'NIOX-USDC OLD',
      lp: '',
      baseToken: USDC
      //STAKINGREWARDSFACTORY- 0xb43095432C268a01Efe7033Cfd84c8Ea9B3d1C18 mainnet matic
    },
    {
      tokens: [ALOHA, NIOX],
      stakingRewardAddress: '0x7e1c71c123aedd1c6a0300fc88955c0fd6c296d7',
      ended: false,
      // lp: 0x2ab6a1f1a2088a0deab45df19832e41349216e7f
      name: 'ALOHA-NIOX OLD',
      lp: '',
      baseToken: NIOX
      //STAKINGREWARDSFACTORY- 0xDDA456D46f72Ebbc5af0D833dA3c37ed5242DE75 mainnet matic
    },
    {
      tokens: [GLQ, ETHER],
      stakingRewardAddress: '0x9fd5dd6b89795ef5fc4ad582c73463693f576619',
      ended: false,
      // lp : 0xe280901997ac453525009cea5d641ee51aad26ff
      name: 'GLQ-ETHER OLD',
      lp: '',
      baseToken: ETHER
      //STAKINGREWARDSFACTORY- 0xDDA456D46f72Ebbc5af0D833dA3c37ed5242DE75 mainnet matic
    },
    {
      tokens: [PBTC, USDC],
      stakingRewardAddress: '0xdd58f05c32326006546855e58bedbb81f00f3c72',
      ended: false,
      name: 'pBTC-USDC OLD',
      lp: '',
      baseToken: USDC
    },
    {
      tokens: [NIOX, AGI],
      stakingRewardAddress: '0xa79374bf7c8b9297b20789375fc7ef2c72c32dbf',
      ended: false,
      name: 'AGI-NIOX OLD',
      lp: '',
      baseToken: NIOX
    }
  ],
  [ChainId.ROPSTEN]: [
    //TODO: ropsten
    // {
    //   tokens: [XENO, ADDY],
    //   stakingRewardAddress: '0xd0d51827C8D63fc6cF3d493977AC46f963D92C29',
    //   ended: false,

    //   name: '',
    //   lp: '',
    //   baseToken: XENO
    //   //STAKINGREWARDSFACTORY- 0x5D490e48417Dd2F6165CEB3b2c04352675278998
    // }
  ]
}

export const SINGLE_STAKING_REWARDS_INFO: {
  [chainId in ChainId]?: {
    tokens: [Token, Token]
    stakingRewardAddress: string
    ended: boolean
    name: string
    lp: string
    baseToken: Token
  }[]
} = {
  [ChainId.MATIC]: [
    ///////////////////////new one expiring after 1 day

    {
      tokens: [NIOX, USDC],
      stakingRewardAddress: '0x7a1137cee3714d8b31bf2e9ba460e61ccd54fab4',
      ended: false,

      name: '',
      lp: '',
      baseToken: USDC
      //STAKINGREWARDSFACTORY- 0x1CdbA3EdFe9Eb9Fb42dcB409b49e633bC4ea95e7 mainnet matic
    },
    {
      tokens: [WMATIC, USDC],
      stakingRewardAddress: '0xe0af829866c719aaa88165323fcd8487b981fd3f',
      ended: false,

      name: '',
      lp: '',
      baseToken: USDC
      //STAKINGREWARDSFACTORY- 0x1CdbA3EdFe9Eb9Fb42dcB409b49e633bC4ea95e7 mainnet matic
    },
    {
      tokens: [MaticWETH, USDC],
      stakingRewardAddress: '0x73eb490b3acd5e36a365bb6f934bd85977ad7068',
      ended: false,

      name: '',
      lp: '',
      baseToken: USDC
      //STAKINGREWARDSFACTORY- 0x1CdbA3EdFe9Eb9Fb42dcB409b49e633bC4ea95e7 mainnet matic
    },
    {
      tokens: [PBTC, USDC],
      stakingRewardAddress: '0xa6d04447695c38d4c687cb25330b22c840223e29',
      ended: false,
      name: '',
      lp: '',
      baseToken: USDC
    },
    {
      tokens: [GLQ, MaticWETH],
      stakingRewardAddress: '0x96d287d25bbbd87910fd28f21fbfa590dfb33b96',
      ended: false,

      name: '',
      lp: '',
      baseToken: MaticWETH
      //STAKINGREWARDSFACTORY- 0x1CdbA3EdFe9Eb9Fb42dcB409b49e633bC4ea95e7 mainnet matic
    },
    // {
    //   tokens: [ALOHA, NIOX],
    //   stakingRewardAddress: '0x317875cbe5f64f14d7e9343703cac9c1501ddb05',
    //   ended: false,
    //   name: '',
    //   lp: '',
    //   baseToken: NIOX
    //   //STAKINGREWARDSFACTORY- 0x1CdbA3EdFe9Eb9Fb42dcB409b49e633bC4ea95e7 mainnet matic
    // },


    ///////////////////////new one expiring after 1 day

  ],
  [ChainId.ROPSTEN]: [
  ]
}

export const STAKING_REWARDS_INFO: {
  [chainId in ChainId]?: {
    tokens: [Token, Token]
    stakingRewardAddress: string
    ended: boolean
    token0: Token
    token1: Token
    name: string
    lp: string
    baseToken: Token
  }[]
} = {
  [ChainId.MATIC]: [
    //TODO: MATIC mainnet
    // ===================================================================================================================
    //testing pool for dual token
    {
      tokens: [ALOHA, NIOX],
      stakingRewardAddress: '0x5f5c7fa2ea6b29522282b891322672a22f4d9535', // 1000 +600 5hr
      ended: false,
      token0: NIOX, //reward token
      token1: ALOHA, //reward1 token
      name: '',
      lp: '',
      baseToken: NIOX
      //STAKINGREWARDSFACTORY- 0x5088C9250c284A1F2fad26050ED89746d796D067 mainnet matic
    },
    {
      tokens: [DIGI, NIOX],
      stakingRewardAddress: '0xde660404d5b1313fc2daf4fc8a22d46347d4d838', // 500 +1000
      ended: false,
      token0: NIOX,
      token1: DIGI,
      name: '',
      lp: '',
      baseToken: NIOX
      //STAKINGREWARDSFACTORY- 0xA303516F14a00EA1633Db77CEE0b7f38076475d8 mainnet matic
    },

  ],
  [ChainId.ROPSTEN]: [
    //TODO: ropsten
  ],
  [ChainId.MAINNET]: []
}

export interface StakingInfo {
  // the address of the reward contract
  stakingRewardAddress: string
  // the tokens involved in this pair
  tokens: [Token, Token]

  token0: Token
  token1: Token
  // the amount of token currently staked, or undefined if no account
  stakedAmount: TokenAmount
  // the amount of reward token earned by the active account, or undefined if no account
  earnedAmount: TokenAmount
  earnedAmount1: TokenAmount
  // the total amount of token staked in the contract
  totalStakedAmount: TokenAmount
  // the amount of token distributed per second to all LPs, constant
  totalRewardRate: TokenAmount
  totalRewardRate1: TokenAmount
  // the current amount of token distributed to the active account per second.
  // equivalent to percent of total supply * reward rate
  rewardRate: TokenAmount
  rewardRate1: TokenAmount
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

  getHypotheticalRewardRate1: (
    stakedAmount: TokenAmount,
    totalStakedAmount: TokenAmount,
    totalRewardRate1: TokenAmount
  ) => TokenAmount
}
export interface StakingInfoOld {
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
export function useOldStakingInfo(pairToFilterBy?: Pair | null): StakingInfoOld[] {
  const { chainId, account } = useActiveWeb3React()

  const info = useMemo(
    () =>
      chainId
        ? OLD_STAKING_REWARDS_INFO[chainId]?.filter(stakingRewardInfoOld =>
          pairToFilterBy === undefined
            ? true
            : pairToFilterBy === null
              ? false
              : pairToFilterBy.involvesToken(stakingRewardInfoOld.tokens[0]) &&
              pairToFilterBy.involvesToken(stakingRewardInfoOld.tokens[1])
        ) ?? []
        : [],
    [chainId, pairToFilterBy]
  )

  const uni = chainId ? UNI[chainId] : undefined

  const rewardsAddresses = useMemo(() => info.map(({ stakingRewardAddress }) => stakingRewardAddress), [info])

  const accountArg = useMemo(() => [account ?? undefined], [account])

  // get all the info from the staking rewards contracts
  const balances = useMultipleContractSingleData(rewardsAddresses, STAKING_REWARDS_INTERFACE_OLD, 'balanceOf', accountArg)
  const earnedAmounts = useMultipleContractSingleData(rewardsAddresses, STAKING_REWARDS_INTERFACE_OLD, 'earned', accountArg)
  const totalSupplies = useMultipleContractSingleData(rewardsAddresses, STAKING_REWARDS_INTERFACE_OLD, 'totalSupply')

  // tokens per second, constants
  const rewardRates = useMultipleContractSingleData(
    rewardsAddresses,
    STAKING_REWARDS_INTERFACE_OLD,
    'rewardRate',
    undefined,
    NEVER_RELOAD
  )

  const periodFinishes = useMultipleContractSingleData(
    rewardsAddresses,
    STAKING_REWARDS_INTERFACE_OLD,
    'periodFinish',
    undefined,
    NEVER_RELOAD
  )

  return useMemo(() => {
    if (!chainId || !uni) return []

    return rewardsAddresses.reduce<StakingInfoOld[]>((memo, rewardsAddress, index) => {
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
          return memo
        }

        // get the LP token
        const tokens = info[index].tokens
        const dummyPair = new Pair(new TokenAmount(tokens[0], '0'), new TokenAmount(tokens[1], '0'))

        // check for account, if no account set to 0
        const lp = info[index].lp

        const stakedAmount = new TokenAmount(
          lp && lp !== '' ? new Token(137, lp, 18, 'SLP', 'Staked LP') : dummyPair.liquidityToken,
          JSBI.BigInt(balanceState?.result?.[0] ?? 0)
        )
        const totalStakedAmount = new TokenAmount(
          lp && lp !== '' ? new Token(137, lp, 18, 'SLP', 'Staked LP') : dummyPair.liquidityToken,
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
          getHypotheticalRewardRate,
        })
      }
      return memo
    }, [])
  }, [balances, chainId, earnedAmounts, info, periodFinishes, rewardRates, rewardsAddresses, totalSupplies, uni])
}

export function useSingleStakingInfo(pairToFilterBy?: Pair | null): StakingInfoOld[] {
  const { chainId, account } = useActiveWeb3React()

  const info = useMemo(
    () =>
      chainId
        ? SINGLE_STAKING_REWARDS_INFO[chainId]?.filter(stakingRewardInfoOld =>
          pairToFilterBy === undefined
            ? true
            : pairToFilterBy === null
              ? false
              : pairToFilterBy.involvesToken(stakingRewardInfoOld.tokens[0]) &&
              pairToFilterBy.involvesToken(stakingRewardInfoOld.tokens[1])
        ) ?? []
        : [],
    [chainId, pairToFilterBy]
  )

  const uni = chainId ? UNI[chainId] : undefined

  const rewardsAddresses = useMemo(() => info.map(({ stakingRewardAddress }) => stakingRewardAddress), [info])

  const accountArg = useMemo(() => [account ?? undefined], [account])

  // get all the info from the staking rewards contracts
  const balances = useMultipleContractSingleData(rewardsAddresses, STAKING_REWARDS_INTERFACE_OLD, 'balanceOf', accountArg)
  const earnedAmounts = useMultipleContractSingleData(rewardsAddresses, STAKING_REWARDS_INTERFACE_OLD, 'earned', accountArg)
  const totalSupplies = useMultipleContractSingleData(rewardsAddresses, STAKING_REWARDS_INTERFACE_OLD, 'totalSupply')

  // tokens per second, constants
  const rewardRates = useMultipleContractSingleData(
    rewardsAddresses,
    STAKING_REWARDS_INTERFACE_OLD,
    'rewardRate',
    undefined,
    NEVER_RELOAD
  )

  const periodFinishes = useMultipleContractSingleData(
    rewardsAddresses,
    STAKING_REWARDS_INTERFACE_OLD,
    'periodFinish',
    undefined,
    NEVER_RELOAD
  )

  return useMemo(() => {
    if (!chainId || !uni) return []

    return rewardsAddresses.reduce<StakingInfoOld[]>((memo, rewardsAddress, index) => {
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
          return memo
        }

        // get the LP token
        const tokens = info[index].tokens
        const dummyPair = new Pair(new TokenAmount(tokens[0], '0'), new TokenAmount(tokens[1], '0'))

        // check for account, if no account set to 0
        const lp = info[index].lp

        const stakedAmount = new TokenAmount(
          lp && lp !== '' ? new Token(137, lp, 18, 'SLP', 'Staked LP') : dummyPair.liquidityToken,
          JSBI.BigInt(balanceState?.result?.[0] ?? 0)
        )
        const totalStakedAmount = new TokenAmount(
          lp && lp !== '' ? new Token(137, lp, 18, 'SLP', 'Staked LP') : dummyPair.liquidityToken,
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
          getHypotheticalRewardRate,
        })
      }
      return memo
    }, [])
  }, [balances, chainId, earnedAmounts, info, periodFinishes, rewardRates, rewardsAddresses, totalSupplies, uni])
}
//till here single token active pools

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
  const earnedAmounts1 = useMultipleContractSingleData(rewardsAddresses, STAKING_REWARDS_INTERFACE, 'earned1', accountArg)
  const totalSupplies = useMultipleContractSingleData(rewardsAddresses, STAKING_REWARDS_INTERFACE, 'totalSupply')

  // tokens per second, constants
  const rewardRates = useMultipleContractSingleData(
    rewardsAddresses,
    STAKING_REWARDS_INTERFACE,
    'rewardRate',
    undefined,
    NEVER_RELOAD
  )
  console.log("rewardrate ", rewardRates);
  const rewardRates1 = useMultipleContractSingleData(
    rewardsAddresses,
    STAKING_REWARDS_INTERFACE,
    'rewardRate1',
    undefined,
    NEVER_RELOAD
  )
  console.log("rewardrate11 ", rewardRates1);

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
      const earnedAmountState1 = earnedAmounts1[index]

      // these get fetched regardless of account
      const totalSupplyState = totalSupplies[index]
      const rewardRateState = rewardRates[index]
      const rewardRateState1 = rewardRates1[index]
      const periodFinishState = periodFinishes[index]

      if (
        // these may be undefined if not logged in
        !balanceState?.loading &&
        !earnedAmountState?.loading &&
        !earnedAmountState1?.loading &&
        // always need these
        totalSupplyState &&
        !totalSupplyState.loading &&
        rewardRateState &&
        !rewardRateState.loading &&
        !rewardRateState1.loading &&
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
          return memo
        }

        // get the LP token
        const tokens = info[index].tokens
        const dummyPair = new Pair(new TokenAmount(tokens[0], '0'), new TokenAmount(tokens[1], '0'))

        // check for account, if no account set to 0
        const lp = info[index].lp

        const stakedAmount = new TokenAmount(
          lp && lp !== '' ? new Token(137, lp, 18, 'SLP', 'Staked LP') : dummyPair.liquidityToken,
          JSBI.BigInt(balanceState?.result?.[0] ?? 0)
        )
        const totalStakedAmount = new TokenAmount(
          lp && lp !== '' ? new Token(137, lp, 18, 'SLP', 'Staked LP') : dummyPair.liquidityToken,
          JSBI.BigInt(totalSupplyState.result?.[0])
        )
        const totalRewardRate = new TokenAmount(info[index].token0, JSBI.BigInt(rewardRateState.result?.[0]))
        const totalRewardRate1 = new TokenAmount(info[index].token1, JSBI.BigInt(rewardRateState1.result?.[0]))

        const getHypotheticalRewardRate = (
          stakedAmount: TokenAmount,
          totalStakedAmount: TokenAmount,
          totalRewardRate: TokenAmount
        ): TokenAmount => {
          return new TokenAmount(
            info[index].token0,
            JSBI.greaterThan(totalStakedAmount.raw, JSBI.BigInt(0))
              ? JSBI.divide(JSBI.multiply(totalRewardRate.raw, stakedAmount.raw), totalStakedAmount.raw)
              : JSBI.BigInt(0)
          )
        }

        const getHypotheticalRewardRate1 = (
          stakedAmount: TokenAmount,
          totalStakedAmount: TokenAmount,
          totalRewardRate1: TokenAmount
        ): TokenAmount => {
          return new TokenAmount(
            info[index].token1,
            JSBI.greaterThan(totalStakedAmount.raw, JSBI.BigInt(0))
              ? JSBI.divide(JSBI.multiply(totalRewardRate1.raw, stakedAmount.raw), totalStakedAmount.raw)
              : JSBI.BigInt(0)
          )
        }

        const individualRewardRate = getHypotheticalRewardRate(stakedAmount, totalStakedAmount, totalRewardRate)
        const individualRewardRate1 = getHypotheticalRewardRate1(stakedAmount, totalStakedAmount, totalRewardRate1)

        const periodFinishMs = periodFinishState.result?.[0]?.mul(1000)?.toNumber()

        memo.push({
          stakingRewardAddress: rewardsAddress,
          tokens: info[index].tokens,
          ended: info[index].ended,
          name: info[index].name,
          lp: info[index].lp,
          token0: info[index].token0,
          token1: info[index].token1,
          periodFinish: periodFinishMs > 0 ? new Date(periodFinishMs) : undefined,
          earnedAmount: new TokenAmount(info[index].token0, JSBI.BigInt(earnedAmountState?.result?.[0] ?? 0)),
          earnedAmount1: new TokenAmount(info[index].token1, JSBI.BigInt(earnedAmountState1?.result?.[0] ?? 0)),
          rewardRate: individualRewardRate,
          rewardRate1: individualRewardRate1,
          totalRewardRate: totalRewardRate,
          totalRewardRate1: totalRewardRate1,
          stakedAmount: stakedAmount,
          totalStakedAmount: totalStakedAmount,
          getHypotheticalRewardRate,
          getHypotheticalRewardRate1
        })
      }
      return memo
    }, [])
  }, [balances, chainId, earnedAmounts, earnedAmounts1, info, periodFinishes, rewardRates, rewardRates1, rewardsAddresses, totalSupplies, uni])
}

export function useTotalUniEarned(): TokenAmount | undefined {
  const { chainId } = useActiveWeb3React()
  const uni = chainId ? UNI[chainId] : undefined
  // const stakingInfos = useStakingInfo()
  const oldStakingInfos = useOldStakingInfo()

  return useMemo(() => {
    if (!uni) return undefined
    return (
      oldStakingInfos?.reduce(
        (accumulator, stakingInfo) => accumulator.add(stakingInfo.earnedAmount),
        new TokenAmount(uni, '0')
      ) ?? new TokenAmount(uni, '0')
    )
  }, [oldStakingInfos, uni])
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

export function useCustomNetRewardRate(address: string, chainId: ChainId): TokenAmount | Fraction {
  // const rewardRates = useMultipleContractSingleData(
  //   [address],
  //   STAKING_REWARDS_INTERFACE,
  //   'rewardRate',
  //   undefined,
  //   NEVER_RELOAD
  // )

  // const rewardRateState = rewardRates ? rewardRates[0] : null

  // return useMemo(() => {
  //   if (!rewardRateState || rewardRateState.loading) return new Fraction('0', '1')

  return new TokenAmount(NIOX, JSBI.BigInt(1157))
  // return new TokenAmount(NIOX, JSBI.BigInt(rewardRateState.result?.[0]))
  // }, [rewardRateState])
}
