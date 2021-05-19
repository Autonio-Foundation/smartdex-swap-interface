import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Modal from 'react-modal'
import Matic from '@maticnetwork/maticjs'
// import { InstaExit, SignatureType, RESPONSE_CODES } from '@biconomy/inex'
import { MATIC_PROVIDER, INFURA_PROVIDER } from '../../constants'
import { Dropdown, DropdownPositions } from './MaticBridgeDropdown'
import { DropdownTextItem } from './MaticBridgeTextItem'
import { BigNumberInput } from './BigNumberInput'
import { ButtonLight } from '../Button'
import { tokenAmountInUnits } from '../../utils/tokens'
import { DEPOSIT_TOKENS_META_DATA, TokenMetaData } from '../../constants/tokenLists/tokens'
import { modalTheme } from './styles'

// interface Props {
//   test?: string
// }

interface State {
  isOpen: boolean
  currentToken: TokenMetaData
  amount: BigNumber
  maticBalance: { [k: string]: any }
  ethBalance: { [k: string]: any }
  chainId: number
  isDeposit: boolean
  instaExit: any
}

const DepositTabButton = styled(ButtonLight)`
  height: 36px;
  border-radius: 12px;
  font-weight: 600;
  line-height: 34px;
  background: linear-gradient(101.8deg, #acca26 0%, #7c9631 88.41%);
  color: rgb(255, 255, 255);
  word-break: keep-all;
  border: none;
  &:hover {
    border: none;
    opacity: 0.8;
  }
`

const DepositButton = styled(ButtonLight)`
  height: 50px;
  border-radius: 12px;
  font-weight: 600;
  line-height: 1.2;
  background: linear-gradient(101.8deg, #acca26 0%, #7c9631 88.41%);
  color: rgb(255, 255, 255);
  word-break: keep-all;
  border-radius: 16px;
`

const ModalContent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-shrink: 0;
  max-height: 100%;
  min-height: 300px;
  overflow: auto;
  width: 420px;
  height: 480px;
  color: #fff;
`

const DepositContent = styled.div<{ active?: boolean }>`
  align-items: center;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-shrink: 0;
  min-height: 50px;
  width: 50%;
  height: 50px;
  text-align: center;
  justify-content: center;
  cursor: pointer;
  font-weight: bold;
  color: ${props => (props.active ? '#ACCA27' : '#fff')};
  border-radius: 35px;
  background-color: ${props => (props.active ? 'rgba(172, 202, 38, 0.1)' : 'transparent')};
`

const FieldContainer = styled.div`
  height: 46px;
  margin-bottom: 20px;
  position: relative;
`

const BigInputNumberStyled = styled<any>(BigNumberInput)`
  background-color: #070c12;
  border-radius: 15px;
  border: 1px solid #2f3641;
  color: #fff;
  font-feature-settings: 'tnum' 1;
  font-size: 16px;
  height: 100%;
  padding-left: 14px;
  padding-right: 60px;
  position: absolute;
  width: 100%;
`

const TokenContainer = styled.div`
  display: flex;
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
`

const TokenText = styled.span`
  color: #fff;
  font-size: 14px;
  font-weight: normal;
  line-height: 21px;
  text-align: right;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 16px;
  width: 100%;
`

const DotDiv = styled.div`
  border-radius: 50%;
  height: 8px;
  margin-top: 4px;
  margin-right: 12px;
  width: 8px;
`

const LabelContainer = styled.div`
  align-items: flex-end;
  display: flex;
  justify-content: space-between;
  margin: 5px 0 10px 0;
`

const Label = styled.label<{ color?: string }>`
  color: ${props => props.color || '#fff'};
  font-size: 14px;
  font-weight: 500;
  line-height: normal;
  margin: 0;
`

const FeeLabel = styled(Label)`
  color: #fff;
  font-weight: normal;
`

const Row = styled.div`
  align-items: center;
  border-top: dashed 1px #5a5a5a;
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  position: relative;
  z-index: 1;

  &:last-of-type {
    margin-bottom: 20px;
  }
`

const Value = styled.div`
  color: #fff;
  flex-shrink: 0;
  font-feature-settings: 'tnum' 1;
  font-size: 14px;
  line-height: 1.2;
  white-space: nowrap;
`

const MainLabel = styled(Label)``

function TokenSymbolFormat(symbol: string) {
  return symbol === 'wmatic' ? 'MATIC' : symbol.toUpperCase()
}

const MaticBridge = () => {
  const [state, setState] = useState<State>({
    isOpen: false,
    currentToken: DEPOSIT_TOKENS_META_DATA[0],
    amount: new BigNumber(0),
    chainId: 0,
    maticBalance: {},
    ethBalance: {},
    isDeposit: true,
    instaExit: null
  })

  const { isOpen, currentToken, amount, maticBalance, ethBalance, chainId, isDeposit } = state
  const account = (window as any).ethereum.selectedAddress

  // const init = async () => {
  //   if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
  //     // Ethereum user detected. You can now use the provider.
  //     const provider = window['ethereum']
  //     await provider.enable()
  //     const ethersProvider = new ethers.providers.Web3Provider(provider, 'any')

  //     const instaExit = new InstaExit(provider, {
  //       fromChainId: 5,
  //       toChainId: 80001,
  //       debug: true,
  //       infiniteApproval: true,
  //       onFundsTransfered: (data: any) => {
  //         console.log('Funds transfer successful', data)
  //       }
  //     })

  //     await instaExit.init()
  //     signer = ethersProvider.getSigner()
  //     let userAddress = await signer.getAddress()
  //     if (userAddress) {
  //       setUserAddress(userAddress)
  //     }

  //     ethersProvider.on('network', (newNetwork, oldNetwork) => {
  //       // When a Provider makes its initial connection, it emits a "network"
  //       // event with a null oldNetwork along with the newNetwork. So, if the
  //       // oldNetwork exists, it represents a changing network
  //       if (oldNetwork) {
  //         window.location.reload()
  //       }
  //     })

  //     // try {
  //     //   ethersProvider.on("block", (blockNumber) => {
  //     //      updateFaucetBalance();
  //     //   });
  //     // } catch (error) {
  //     //   console.log(error);
  //     // }
  //     setState({ instaExit })

  //     // Hanlde user address change
  //     // if (provider.on) {
  //     //   provider.on('accountsChanged', function(accounts) {
  //     //     console.log(`Address changed EVENT`)
  //     //     console.log(`New account info`, accounts)

  //     //     if (accounts && accounts.length > 0) {
  //     //       let newUserAddress = accounts[0]
  //     //       if (newUserAddress) {
  //     //         setUserAddress(newUserAddress)
  //     //       }
  //     //     }
  //     //   })
  //     // }
  //   } else {
  //     console.log('Metamask not installed')
  //   }
  // }

  const updateBalances = async () => {
    if (!window || !window.ethereum) return

    let maticWrapper: Matic
    try {
      if (Number(chainId) === 1) {
        maticWrapper = new Matic({
          network: 'mainnet',
          version: 'v1',
          maticProvider: MATIC_PROVIDER,
          parentProvider: window.ethereum,
          parentDefaultOptions: { from: account },
          maticDefaultOptions: { from: account }
        })
      } else {
        maticWrapper = new Matic({
          network: 'mainnet',
          version: 'v1',
          maticProvider: window.ethereum,
          parentProvider: INFURA_PROVIDER,
          parentDefaultOptions: { from: account },
          maticDefaultOptions: { from: account }
        })
      }
      maticWrapper.initialize()
      console.log(maticWrapper)
      const maticBalance: { [k: string]: any } = {}
      const ethBalance: { [k: string]: any } = {}
      DEPOSIT_TOKENS_META_DATA &&
        DEPOSIT_TOKENS_META_DATA.map(async token => {
          let value = await maticWrapper.balanceOfERC20(
            account,
            token.symbol === 'wmatic' ? maticWrapper.network.Matic.Contracts.Tokens.MaticToken : token.addresses[137],
            {
              from: account
            }
          )
          maticBalance[token.symbol] = value / Math.pow(10, token.decimals)
          value = await maticWrapper.balanceOfERC20(
            account,
            token.symbol === 'wmatic' ? maticWrapper.network.Main.Contracts.Tokens.MaticToken : token.addresses[1],
            {
              from: account,
              parent: true
            }
          )
          ethBalance[token.symbol] = value / Math.pow(10, token.decimals)
        })
      setState({ ...state, maticBalance, ethBalance })
    } catch (error) {
      console.log(error)
    }
  }

  const detectChainId = async () => {
    try {
      const _chainId = parseInt(await (window as any).ethereum.request({ method: 'eth_chainId' }))
      if (_chainId !== chainId) {
        setState({ ...state, chainId: _chainId })
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const _window = window as any
    _window.ethereum.on('networkChanged', (networkId: number) => {
      setState({ ...state, chainId: networkId })
    })
    // try {
    //   init()
    // } catch (error) {
    //   console.log(error)
    //   console.log('Error while initiazing the App')
    // }
  }, [])

  useEffect(() => {
    detectChainId()
    updateBalances()
  }, [account])
  useEffect(() => {
    updateBalances()
  }, [chainId])

  const handleOpenModal = (ev: any) => {
    ev.preventDefault()
    setState({ ...state, isOpen: true })
  }

  const handleCloseModel = (ev: any) => {
    ev.preventDefault()
    setState({ ...state, isOpen: false })
  }

  const updateAmount = (newValue: BigNumber) => {
    setState({ ...state, amount: newValue })
  }

  const onClickWithdraw = () => {
    window.open('https://wallet.matic.network/', '_blank')
  }

  // const deposit = async (depositRequest: any) => {
  //   const { instaExit } = state
  //   const depositResponse = await instaExit.deposit(depositRequest)
  //   return depositResponse
  // }

  const submit = async () => {
    // try {
    //   // let networkCheck = await checkNetwork()
    //   // if (!networkCheck) {
    //   //   return
    //   // }
    //   let amount = state.amount
    //   if (amount.isEqualTo(new BigNumber(0))) {
    //     return
    //   }
    //   // set fromChain and toChain IDs
    //   const fromChainId = 137
    //   const toChainId = 1
    //   // console.log('Initiaiting Transfer')
    //   const tokenDecimals = await instaExit.getERC20TokenDecimals(selectedToken.address)
    //   amount = amount.multipliedBy(new BigNumber(10).pow(tokenDecimals))
    //   console.log('Total amount to  be transfered: ', amount.toString())
    //   const transferStatus = await instaExit.preDepositStatus({
    //     tokenAddress: selectedToken.address,
    //     amount: amount.toString(),
    //     fromChainId,
    //     toChainId
    //   })
    //   if (transferStatus) {
    //     if (transferStatus.code === RESPONSE_CODES.OK) {
    //       console.log('All good. Proceed with deposit')
    //       console.log(transferStatus)
    //       try {
    //         const depositTx = await deposit({
    //           sender: await signer.getAddress(),
    //           receiver: await signer.getAddress(),
    //           tokenAddress: selectedToken.address,
    //           depositContractAddress: transferStatus.depositContract,
    //           amount: amount.toString(),
    //           fromChainId: fromChainId,
    //           toChainId: toChainId
    //         })
    //         await depositTx.wait(1)
    //         console.log(`Deposit Confirmed. Waiting for transaction on ${selectedToChain.name}`, 'success')
    //       } catch (error) {
    //         console.log(error)
    //         if (error && error.code == RESPONSE_CODES.ALLOWANCE_NOT_GIVEN) {
    //           const approveTx = await instaExit.approveERC20(
    //             selectedToken.address,
    //             transferStatus.depositContract,
    //             amount.toString()
    //           )
    //           console.log(`Waiting for approval confirmation`)
    //           await approveTx.wait(2)
    //           console.log('Approval transaction confirmed')
    //           console.log('Initiating deposit transaction')
    //           let depositTx = await deposit({
    //             sender: await signer.getAddress(),
    //             receiver: await signer.getAddress(),
    //             tokenAddress: selectedToken.address,
    //             depositContractAddress: transferStatus.depositContract,
    //             amount: amount.toString(),
    //             fromChainId: fromChainId,
    //             toChainId: toChainId
    //           })
    //           console.log(`Waiting for deposit confirmation on ${selectedFromChain.name}`)
    //           console.log(depositTx)
    //           await depositTx.wait(1)
    //           console.log(`Deposit Confirmed. Waiting for transaction on ${selectedToChain.name}`, 'success')
    //         }
    //       }
    //     } else if (transferStatus.code === RESPONSE_CODES.UNSUPPORTED_NETWORK) {
    //       console.log('Target chain id is not supported yet')
    //     } else if (transferStatus.code === RESPONSE_CODES.NO_LIQUIDITY) {
    //       console.log(`No liquidity available for ${selectedTokenAmount} tokens`)
    //     } else if (transferStatus.code === RESPONSE_CODES.UNSUPPORTED_TOKEN) {
    //       console.log('Requested token is not supported yet')
    //     }
    //   }
    // } catch (error) {
    //   if (error && error.message) {
    //     console.log(error.message)
    //   } else {
    //     console.log(`Make sure your wallet is on ${selectedFromChain.name} network`)
    //   }
    // }
  }

  return (
    <>
      <DepositTabButton onClick={handleOpenModal}>Deposit</DepositTabButton>
      <Modal isOpen={isOpen} style={modalTheme} onRequestClose={handleCloseModel}>
        <ModalContent>
          <div style={{ display: 'flex', width: '100%' }}>
            <DepositContent onClick={() => setState({ ...state, isDeposit: true })} active={isDeposit}>
              Deposit
            </DepositContent>
            <DepositContent onClick={onClickWithdraw} active={!isDeposit}>
              Withdraw
            </DepositContent>
          </div>
          <Content>
            <div>
              <span style={{ fontWeight: 'bold', fontSize: 18 }}>Matic Bridge</span>
              <span style={{ fontSize: 14, marginLeft: 4, color: '#aaa' }}>
                {isDeposit ? 'Deposit to Matic Mainnet' : 'Withdraw to Ethereum Mainnet'}
              </span>
            </div>
            <div style={{ display: 'flex', marginBottom: 26, marginTop: 10 }}>
              <DotDiv
                style={{
                  backgroundColor:
                    (isDeposit && chainId === 1) || (!isDeposit && chainId === 137) ? '#ACCA27' : '#E81C34'
                }}
              />
              <span style={{ fontSize: 14 }}>
                {chainId === 1
                  ? isDeposit
                    ? 'You are on Ethereum Mainnet'
                    : 'Switch to Matic Mainnet for withdrawal'
                  : !isDeposit
                  ? 'You are on Matic Mainnet'
                  : 'Switch to Ethereum Mainnet for deposit'}
              </span>
            </div>

            <Dropdown
              body={
                <>
                  {DEPOSIT_TOKENS_META_DATA.map((token, idx) => {
                    if (token.symbol === 'wmatic') {
                      return null
                    }
                    return (
                      <DropdownTextItem
                        key={idx}
                        style={{ width: '100%' }}
                        onClick={() => setState({ ...state, currentToken: token })}
                        text={TokenSymbolFormat(token.symbol)}
                        value={
                          isDeposit
                            ? ethBalance[token.symbol]
                              ? ethBalance[token.symbol].toFixed(token.displayDecimals)
                              : '0.00'
                            : maticBalance[token.symbol]
                            ? maticBalance[token.symbol].toFixed(token.displayDecimals)
                            : '0.00'
                        }
                      />
                    )
                  })}
                </>
              }
              header={<>&#9660; {TokenSymbolFormat(currentToken.symbol)}</>}
              horizontalPosition={DropdownPositions.Left}
              shouldCloseDropdownOnClickOutside={true}
            />

            <FieldContainer>
              <BigInputNumberStyled
                decimals={currentToken.decimals}
                min={new BigNumber(0)}
                onChange={updateAmount}
                value={amount}
                placeholder={'0.00'}
              />
              <TokenContainer>
                <TokenText>
                  Max.{' '}
                  {isDeposit
                    ? ethBalance[currentToken.symbol]
                      ? ethBalance[currentToken.symbol].toFixed(currentToken.displayDecimals)
                      : '0.00'
                    : maticBalance[currentToken.symbol]
                    ? maticBalance[currentToken.symbol].toFixed(currentToken.displayDecimals)
                    : '0.00'}
                </TokenText>
              </TokenContainer>
            </FieldContainer>

            <LabelContainer>
              <MainLabel>Details</MainLabel>
            </LabelContainer>
            <Row>
              <FeeLabel>Amount</FeeLabel>
              <Value>
                {tokenAmountInUnits(amount, currentToken.decimals)} {TokenSymbolFormat(currentToken.symbol)}
              </Value>
            </Row>

            <DepositButton
              disabled={amount.isZero() || (isDeposit && chainId !== 1) || !isDeposit}
              // variant={isDeposit ? ButtonVariant.Buy : ButtonVariant.Sell}
              style={{ backgroundColor: '#ACCA27', textTransform: 'capitalize' }}
              onClick={submit}
            >
              {isDeposit ? 'Deposit' : 'Withdraw'}
            </DepositButton>
          </Content>
        </ModalContent>
      </Modal>
    </>
  )
}

export { MaticBridge }
