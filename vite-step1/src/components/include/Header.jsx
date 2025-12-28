import React from 'react'
import { Link } from 'react-router'

const Header = () => {
  return (
    <div>
      <nav className="navbar navbar-expand-sm bg-light justify-content-center">
        <div className="container-fluid">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/" className='nav-link'>Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/schedule" className='nav-link'>Schedule</Link>
            </li>
          </ul>
        </div>
      </nav>      
    </div>
  )
}

export default Header