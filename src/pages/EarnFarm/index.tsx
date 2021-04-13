import React from 'react'
import styled from 'styled-components'


const PoolSection = styled.div`
  width: 100%;
  height: 720px;
  margin: 0px;
padding: 0px;
margin-top: -100px;
`

const IframeLink = 'https://unifarming.drfr40rkroay9.amplifyapp.com/#/farm/0xc813EA5e3b48BEbeedb796ab42A30C5599b01740/ETH/0xA54dB7a2CE0b1D802552c655B36672bcFe2C538d';
// const IframeLink = 'http://http://localhost:3007/#/farm/ETH/0x13681B1F6F93977F62389E0a2b1E84BA24d78fbc/0xeb3D4D393FBD67B741b085640796C6188330Eb4e';

export default function EarnFarm() {
  return (

    <PoolSection>
      <iframe width="100%" frameBorder="0" title="test" src={IframeLink} style={{ height: '100vh' }}></iframe>
    </PoolSection>
  )
}
