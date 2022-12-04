import React, { useEffect } from 'react'
import Search from './Search'
import './Header.css'

import { useMap } from '../../hooks/useMap'

const Header = () => {

  // const { populate } = useMap()

  // useEffect(() => {
  //   populate()
  // }, [populate]);
  
  return (
	  <div className="header">
      {/* <Search/> */}
      {/* <button onClick={populate}>Populate</button> */}
    </div>
  )
}

export default Header;