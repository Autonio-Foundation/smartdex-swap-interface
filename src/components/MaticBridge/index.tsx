import BigNumber from 'bignumber.js'
import React from 'react'
import styled from 'styled-components'
import Modal from 'react-modal'
import Matic from '@maticnetwork/maticjs'
// import { MaticPOSClient } from '@maticnetwork/maticjs'
import { MATIC_PROVIDER, INFURA_PROVIDER } from '../../constants'
import { Dropdown, DropdownPositions } from './MaticBridgeDropdown'
import { DropdownTextItem } from './MaticBridgeTextItem'
import { BigNumberInput } from './BigNumberInput'
import { ButtonLight } from '../Button'
import { tokenAmountInUnits } from '../../utils/tokens'
import { DEPOSIT_TOKENS_META_DATA, TokenMetaData } from '../../constants/tokenLists/tokens'
import { modalTheme } from './styles'

interface Props {
  test?: string
}

interface State {
  isOpen: boolean
  currentToken: TokenMetaData
  amount: BigNumber
  maticBalance: { [k: string]: any }
  ethBalance: { [k: string]: any }
  chainId: number
  isDeposit: boolean
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

class MaticBridge extends React.Component<Props, State> {
  public state: State = {
    isOpen: false,
    currentToken: DEPOSIT_TOKENS_META_DATA[0],
    amount: new BigNumber(0),
    chainId: 0,
    maticBalance: {},
    ethBalance: {},
    isDeposit: true
  }

  constructor(props: Props) {
    super(props)
  }

  public componentDidMount = async () => {
    await this.detectChainId()
    await this.updateBalances()
  }

  public componentDidUpdate = async () => {
    await this.detectChainId()
    await this.updateBalances()
  }

  public detectChainId = async () => {
    if (!window || !window.ethereum) return

    try {
      const chainId = parseInt(await (window as any).ethereum.request({ method: 'eth_chainId' }))
      console.log(chainId)
      this.setState({ chainId })
    } catch (error) {
      console.log(error)
    }
  }

  public updateBalances = async () => {
    if (!window || !window.ethereum) return

    let maticWrapper: Matic
    const { chainId } = this.state
    try {
      if (chainId === 1) {
        maticWrapper = new Matic({
          network: 'mainnet',
          version: 'v1',
          maticProvider: MATIC_PROVIDER,
          parentProvider: window.ethereum,
          parentDefaultOptions: { from: (window as any).ethereum.selectedAddress },
          maticDefaultOptions: { from: (window as any).ethereum.selectedAddress }
        })
      } else {
        maticWrapper = new Matic({
          network: 'mainnet',
          version: 'v1',
          maticProvider: window.ethereum,
          parentProvider: INFURA_PROVIDER,
          parentDefaultOptions: { from: (window as any).ethereum.selectedAddress },
          maticDefaultOptions: { from: (window as any).ethereum.selectedAddress }
        })
      }
      maticWrapper.initialize()
      console.log(maticWrapper)
      const maticBalance: { [k: string]: any } = {}
      const ethBalance: { [k: string]: any } = {}
      DEPOSIT_TOKENS_META_DATA &&
        DEPOSIT_TOKENS_META_DATA.map(async token => {
          let value = await maticWrapper.balanceOfERC20(
            (window as any).ethereum.selectedAddress,
            token.symbol === 'wmatic' ? maticWrapper.network.Matic.Contracts.Tokens.MaticToken : token.addresses[137],
            {
              from: (window as any).ethereum.selectedAddress
            }
          )
          maticBalance[token.symbol] = value / Math.pow(10, token.decimals)
          value = await maticWrapper.balanceOfERC20(
            (window as any).ethereum.selectedAddress,
            token.symbol === 'wmatic' ? maticWrapper.network.Main.Contracts.Tokens.MaticToken : token.addresses[1],
            {
              from: (window as any).ethereum.selectedAddress,
              parent: true
            }
          )
          ethBalance[token.symbol] = value / Math.pow(10, token.decimals)
        })
      this.setState({ maticBalance, ethBalance })
    } catch (error) {
      console.log(error)
    }
  }

  public handleOpenModal = (ev: any) => {
    ev.preventDefault()
    this.setState({ isOpen: true })
  }

  public handleCloseModel = (ev: any) => {
    ev.preventDefault()
    this.setState({ isOpen: false })
  }

  public updateAmount = (newValue: BigNumber) => {
    this.setState({
      amount: newValue
    })
  }

  public onClickWithdraw = () => {
    window.open('https://wallet.matic.network/', '_blank')
  }

  public submit = async () => {}

  public render = () => {
    const { isOpen, currentToken, amount, maticBalance, ethBalance, chainId, isDeposit } = this.state

    return (
      <>
        <DepositTabButton onClick={this.handleOpenModal}>Deposit</DepositTabButton>
        <Modal isOpen={isOpen} style={modalTheme} onRequestClose={this.handleCloseModel}>
          <ModalContent>
            <div style={{ display: 'flex', width: '100%' }}>
              <DepositContent onClick={() => this.setState({ isDeposit: true })} active={isDeposit}>
                Deposit
              </DepositContent>
              <DepositContent onClick={this.onClickWithdraw} active={!isDeposit}>
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
                          onClick={() => this.setState({ currentToken: token })}
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
                  onChange={this.updateAmount}
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
                onClick={this.submit}
              >
                {isDeposit ? 'Deposit' : 'Withdraw'}
              </DepositButton>
            </Content>
          </ModalContent>
        </Modal>
      </>
    )
  }
}

export { MaticBridge }
