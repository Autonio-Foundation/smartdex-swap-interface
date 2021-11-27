import { CurrencyAmount, Fraction } from '@uniswap/sdk';
import { useMemo, useEffect, useState } from 'react'

export function useApy(dailyRewards: Fraction, totalLiquidity: CurrencyAmount | undefined, id: string): number {
  const [currentPrice, setCurrentPrice] = useState(0)

  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=' + id)
      .then(res => res.json())
      .then(
        (result) => {
          result[0].current_price && setCurrentPrice(result[0].current_price)
        },
        (error) => {
          console.log(error);
        }
      )
  }, [id])

  return useMemo(() => {
    const dailyRewardsInUSD = parseInt(dailyRewards.toFixed(0)) * currentPrice;
    const totalLiquidityInUSD = totalLiquidity ? parseInt(totalLiquidity?.toFixed(0)) : 0;

    return (dailyRewardsInUSD / totalLiquidityInUSD * 36500);
  }, [dailyRewards, totalLiquidity, currentPrice])
}
