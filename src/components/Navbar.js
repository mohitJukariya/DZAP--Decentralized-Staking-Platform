import React from 'react'
import '../App.css'

const Navbar = (props) => {
  return (
    <div>
      <nav className="navbar container">
        <div className="container-fluid">
          <span className="nav1 navbar-brand" >
            DZAPP
          </span>

          <span className="navbar-text">
            {props.address}
          </span>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
