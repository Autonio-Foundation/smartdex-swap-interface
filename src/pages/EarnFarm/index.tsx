import React from 'react'
import styled from 'styled-components'

const PoolSection = styled.div`
  width: 100%;
  height: 720px;
  margin: 0px;
  padding: 0px;
  margin-top: -100px;
`

const IframeLink =
  'https://unifarming.drfr40rkroay9.amplifyapp.com/#/farm/0xc813EA5e3b48BEbeedb796ab42A30C5599b01740/ETH/0x31f985e479576b93B1307d423f369766726bE349'
// const IframeLink =
//   'http://localhost:3007/#/farm/0xc813EA5e3b48BEbeedb796ab42A30C5599b01740/ETH/0x31f985e479576b93B1307d423f369766726bE349'

export default function EarnFarm() {
  return (
    <PoolSection>
      <iframe width="100%" frameBorder="0" title="test" src={IframeLink} style={{ height: '100vh' }}></iframe>
    </PoolSection>
  )
}
