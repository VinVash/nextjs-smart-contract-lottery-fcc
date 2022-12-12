import React, { useEffect } from 'react'
import { useMoralis } from "react-moralis"

function ManualHeader() {

  // hooks useful for re-rendering the website whenver the account changes.
  const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } = useMoralis()
  // isWeb3EnabledLoading represents if the metamask is popped up.

  useEffect(() => {
    if(isWeb3Enabled)
      return
  	if(typeof(window) !== undefined) {
  		if(window.localStorage.getItem("connected")) { // if metamask has been connected before.
  			enableWeb3()
  		}
  	}
    
  }, [isWeb3Enabled])

  useEffect(() => {
  	Moralis.onAccountChanged((account) => {
  		console.log(`Account changed to${account}`)
  		if(account == null) {
  			window.localStorage.removeItem("connected")
  			deactivateWeb3()
  			console.log("Null account found!")
  		}
  	})	
  }, [])

  return (
    <div className=''>
    {account ? <div>Connected to {account}</div> :
      <button onClick={async () => {
        await enableWeb3()
        if(typeof(window) !== "undefined") {
          window.localStorage.setItem("connected", "injected") // we have connected to that metamask.
        }
      }} disabled={isWeb3EnableLoading} >Connect!</button>
    }
    </div>
  )
}

export default ManualHeader