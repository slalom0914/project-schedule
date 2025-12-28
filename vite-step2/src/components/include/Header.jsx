import React, { useState } from 'react'
import { Link } from 'react-router'

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
          {/* <!--================  ================--> */}
          <div className="d-flex">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {!isAuthenticated && (
                <li className="nav-item" id="login">
                  <Link to="/login" className="nav-link active">로그인</Link>
                </li>
              )}
              {isAuthenticated && (
                <>
                  <li className="nav-item" id="mypage">
                    <Link to="/mypage" className="nav-link">{email}</Link>
                  </li>
                  <li className="nav-item" id="logout">
                    <Link to="#" className="nav-link" onClick={onLogout}>로그아웃</Link>
                  </li>
                </>
              )}
            </ul>
          </div>  
        </div>
      </nav>      
    </div>
  )
}

export default Header