import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { JSBI, Percent, Router, SwapParameters, Trade, TradeType } from '@uniswap/sdk'
import { useMemo } from 'react'
import { BIPS_BASE, INITIAL_ALLOWED_SLIPPAGE } from '../constants'
import { getTradeVersion, useV1TradeExchangeAddress } from '../data/V1'
import { useTransactionAdder, useTransactionAdderByHash } from '../state/transactions/hooks'
import { calculateGasMargin, getRouterContract, isAddress, shortenAddress } from '../utils'
import isZero from '../utils/isZero'
import v1SwapArguments from '../utils/v1SwapArguments'
import { useActiveWeb3React } from './index'
import { useV1ExchangeContract } from './useContract'
import useTransactionDeadline from './useTransactionDeadline'
import useENS from './useENS'
import { Version } from './useToggledVersion'

import { abi as IUniswapV2Router02ABI } from '@uniswap/v2-periphery/build/IUniswapV2Router02.json'
import { ROUTER_ADDRESS } from '../constants'

const ethUtil = require('ethereumjs-util');
const abi = require('ethereumjs-abi')

declare var window: any;
const Biconomy = window.Biconomy;
declare var Web3: any;
let web3: any;

export enum SwapCallbackState {
  INVALID,
  LOADING,
  VALID
}

interface SwapCall {
  contract: Contract
  parameters: SwapParameters
}

interface SuccessfulCall {
  call: SwapCall
  gasEstimate: BigNumber
}

interface FailedCall {
  call: SwapCall
  error: Error
}

type EstimatedSwapCall = SuccessfulCall | FailedCall

/**
 * Returns the swap calls that can be used to make the trade
 * @param trade trade to execute
 * @param allowedSlippage user allowed slippage
 * @param recipientAddressOrName
 */
function useSwapCallArguments(
  trade: Trade | undefined, // trade to execute, required
  allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE, // in bips
  recipientAddressOrName: string | null // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
): SwapCall[] {
  const { account, chainId, library } = useActiveWeb3React()

  const { address: recipientAddress } = useENS(recipientAddressOrName)
  const recipient = recipientAddressOrName === null ? account : recipientAddress
  const deadline = useTransactionDeadline()

  const v1Exchange = useV1ExchangeContract(useV1TradeExchangeAddress(trade), true)

  return useMemo(() => {
    const tradeVersion = getTradeVersion(trade)
    if (!trade || !recipient || !library || !account || !tradeVersion || !chainId || !deadline) return []

    const contract: Contract | null =
      tradeVersion === Version.v2 ? getRouterContract(chainId, library, account) : v1Exchange
    if (!contract) {
      return []
    }

    const swapMethods = []

    switch (tradeVersion) {
      case Version.v2:
        swapMethods.push(
          Router.swapCallParameters(trade, {
            feeOnTransfer: false,
            allowedSlippage: new Percent(JSBI.BigInt(allowedSlippage), BIPS_BASE),
            recipient,
            deadline: deadline.toNumber()
          })
        )

        if (trade.tradeType === TradeType.EXACT_INPUT) {
          swapMethods.push(
            Router.swapCallParameters(trade, {
              feeOnTransfer: true,
              allowedSlippage: new Percent(JSBI.BigInt(allowedSlippage), BIPS_BASE),
              recipient,
              deadline: deadline.toNumber()
            })
          )
        }
        break
      case Version.v1:
        swapMethods.push(
          v1SwapArguments(trade, {
            allowedSlippage: new Percent(JSBI.BigInt(allowedSlippage), BIPS_BASE),
            recipient,
            deadline: deadline.toNumber()
          })
        )
        break
    }
    return swapMethods.map(parameters => ({ parameters, contract }))
  }, [account, allowedSlippage, chainId, deadline, library, recipient, trade, v1Exchange])
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useSwapCallback(
  trade: Trade | undefined, // trade to execute, required
  allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE, // in bips
  recipientAddressOrName: string | null // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
): { state: SwapCallbackState; callback: null | (() => Promise<string>); error: string | null } {
  const { account, chainId, library } = useActiveWeb3React()

  const swapCalls = useSwapCallArguments(trade, allowedSlippage, recipientAddressOrName)

  const addTransaction = useTransactionAdder()

  const { address: recipientAddress } = useENS(recipientAddressOrName)
  const recipient = recipientAddressOrName === null ? account : recipientAddress

  const addTransactionByHash = useTransactionAdderByHash()
  // meta tx 
  const constructMetaTransactionMessage = (nonce: any, chainId: any, functionSignature: any, contractAddress: any) => {
    console.log("ethUtil", ethUtil)
    return abi.soliditySHA3(
      ["uint256", "address", "uint256", "bytes"],
      [nonce, contractAddress, chainId, ethUtil.toBuffer(functionSignature)]
    );
  }

  const getSignatureParameters = (signature: any) => {
    if (!web3.utils.isHexStrict(signature)) {
      throw new Error(
        'Given value "'.concat(signature, '" is not a valid hex string.')
      );
    }
    var r = signature.slice(0, 66);
    var s = "0x".concat(signature.slice(66, 130));
    // var v = "0x".concat(signature.slice(130, 132));
    let v = web3.utils.hexToNumber("0x".concat(signature.slice(130, 132)));
    v = parseInt(v)
    console.log(r, s, v);
    if (![27, 28].includes(v)) {
      console.log("v", v);
      v += 27
    } else {
      console.log("else v", v)
    }
    return {
      r: r,
      s: s,
      v: v
    };
  };

  return useMemo(() => {
    if (!trade || !library || !account || !chainId) {
      return { state: SwapCallbackState.INVALID, callback: null, error: 'Missing dependencies' }
    }
    if (!recipient) {
      if (recipientAddressOrName !== null) {
        return { state: SwapCallbackState.INVALID, callback: null, error: 'Invalid recipient' }
      } else {
        return { state: SwapCallbackState.LOADING, callback: null, error: null }
      }
    }

    const tradeVersion = getTradeVersion(trade)

    return {
      state: SwapCallbackState.VALID,
      callback: async function onSwap(): Promise<string> {
        const estimatedCalls: EstimatedSwapCall[] = await Promise.all(
          swapCalls.map(call => {
            const {
              parameters: { methodName, args, value },
              contract
            } = call
            const options = !value || isZero(value) ? {} : { value }

            return contract.estimateGas[methodName](...args, options)
              .then(gasEstimate => {
                return {
                  call,
                  gasEstimate
                }
              })
              .catch(gasError => {
                console.debug('Gas estimate failed, trying eth_call to extract error', call)

                return contract.callStatic[methodName](...args, options)
                  .then(result => {
                    console.debug('Unexpected successful call after failed estimate gas', call, gasError, result)
                    return { call, error: new Error('Unexpected issue with estimating the gas. Please try again.') }
                  })
                  .catch(callError => {
                    console.debug('Call threw error', call, callError)
                    let errorMessage: string
                    switch (callError.reason) {
                      case 'UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT':
                      case 'UniswapV2Router: EXCESSIVE_INPUT_AMOUNT':
                        errorMessage =
                          'This transaction will not succeed either due to price movement or fee on transfer. Try increasing your slippage tolerance.'
                        break
                      default:
                        errorMessage = `The transaction cannot succeed due to error: ${callError.reason}. This is probably an issue with one of the tokens you are swapping.`
                    }
                    return { call, error: new Error(errorMessage) }
                  })
              })
          })
        )

        // a successful estimation is a bignumber gas estimate and the next call is also a bignumber gas estimate
        const successfulEstimation = estimatedCalls.find(
          (el, ix, list): el is SuccessfulCall =>
            'gasEstimate' in el && (ix === list.length - 1 || 'gasEstimate' in list[ix + 1])
        )

        if (!successfulEstimation) {
          const errorCalls = estimatedCalls.filter((call): call is FailedCall => 'error' in call)
          if (errorCalls.length > 0) throw errorCalls[errorCalls.length - 1].error
          throw new Error('Unexpected error. Please contact support: none of the calls threw an error')
        }

        const {
          call: {
            contract,
            parameters: { methodName, args, value }
          },
          gasEstimate
        } = successfulEstimation
        if (value && !isZero(value)) {
          return contract[methodName](...args, {
            gasLimit: calculateGasMargin(gasEstimate),
            ...(value && !isZero(value) ? { value, from: account } : { from: account })
          })
            .then((response: any) => {
              const inputSymbol = trade.inputAmount.currency.symbol
              const outputSymbol = trade.outputAmount.currency.symbol
              const inputAmount = trade.inputAmount.toSignificant(3)
              const outputAmount = trade.outputAmount.toSignificant(3)

              const base = `Swap ${inputAmount} ${inputSymbol === 'ETH' ? 'MATIC' : inputSymbol} for ${outputAmount} ${outputSymbol === 'ETH' ? 'MATIC' : outputSymbol
                }`
              const withRecipient =
                recipient === account
                  ? base
                  : `${base} to ${recipientAddressOrName && isAddress(recipientAddressOrName)
                    ? shortenAddress(recipientAddressOrName)
                    : recipientAddressOrName
                  }`

              const withVersion =
                tradeVersion === Version.v2 ? withRecipient : `${withRecipient} on ${(tradeVersion as any).toUpperCase()}`

              addTransaction(response, {
                summary: withVersion
              })

              return response.hash
            })
            .catch((error: any) => {
              // if the user rejected the tx, pass this along
              if (error?.code === 4001) {
                throw new Error('Transaction rejected.')
              } else {
                // otherwise, the error was unexpected and we need to convey that
                console.error(`Swap failed`, error, methodName, args, value)
                throw new Error(`Swap failed: ${error.message}`)
              }
            })
        } else {
          const biconomy = new Biconomy(window.ethereum, { apiKey: "JRKmMz4my.d3442601-7ced-4025-a85a-9e71b9f25eaa" }); // meta basic personal sgn

          // ceating web3 instance using biconomy
          web3 = new Web3(biconomy);

          // new router with gasless enabled
          const lp = new web3.eth.Contract(IUniswapV2Router02ABI, ROUTER_ADDRESS);

          biconomy.onEvent(biconomy.READY, () => {
            // Initialize your dapp here like getting user accounts etc
            const lp = new web3.eth.Contract(
              IUniswapV2Router02ABI, ROUTER_ADDRESS
            );
            console.log("lp from biconomy", lp)
          })
          const nonce = await lp.methods.getNonce(account).call(); // getting nonce for meta-transaction

          const functionSignature = await lp.methods[methodName](...args).encodeABI();

          let messageToSign = constructMetaTransactionMessage(nonce, chainId, functionSignature, ROUTER_ADDRESS);

          console.log('msgto sign', messageToSign)
          const signature = await web3.eth.personal.sign("0x" +
            messageToSign.toString("hex"), account);
          console.log("signature", signature)
          const { r, s, v } = getSignatureParameters(signature);
          console.log(r)
          console.log(s)
          console.log(v)
          // const tx = lp.methods.executeMetaTransaction(
          //   account, functionSignature, r, s, v)
          //   .send({ from: window.ethereum.selectedAddress });
          return lp.methods.executeMetaTransaction(account, functionSignature, r, s, v).send({ from: account })
            .then((response: any) => {
              console.log(response.transactionHash)
              const inputSymbol = trade.inputAmount.currency.symbol
              const outputSymbol = trade.outputAmount.currency.symbol
              const inputAmount = trade.inputAmount.toSignificant(3)
              const outputAmount = trade.outputAmount.toSignificant(3)

              const base = `Swap ${inputAmount} ${inputSymbol === 'ETH' ? 'MATIC' : inputSymbol} for ${outputAmount} ${outputSymbol === 'ETH' ? 'MATIC' : outputSymbol
                }`
              const withRecipient =
                recipient === account
                  ? base
                  : `${base} to ${recipientAddressOrName && isAddress(recipientAddressOrName)
                    ? shortenAddress(recipientAddressOrName)
                    : recipientAddressOrName
                  }`

              const withVersion =
                tradeVersion === Version.v2 ? withRecipient : `${withRecipient} on ${(tradeVersion as any).toUpperCase()}`

              addTransactionByHash(response.transactionHash, {
                summary: withVersion
              })

              return response.transactionHash
            }).catch((error: any) => {
              // if the user rejected the tx, pass this along
              if (error?.code === 4001) {
                throw new Error('Transaction rejected.')
              } else {
                // otherwise, the error was unexpected and we need to convey that
                console.error(`Swap failed`, error, methodName, args, value)
                throw new Error(`Swap failed: ${error.message}`)
              }
            })
          // tx.on("transactionHash", (hash: any) => {

          //  return ()=>{
          //    return hash;
          //  }
          // })



        }

      },
      error: null
    }
  }, [trade, library, account, chainId, recipient, recipientAddressOrName, swapCalls, addTransaction, addTransactionByHash])
}
