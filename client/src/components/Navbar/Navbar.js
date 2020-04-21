import React, { useContext } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import './Navbar.css'

export const Navbar = () => {
  const history = useHistory()
  const auth = useContext(AuthContext)

  const logoutHandler = event => {
    event.preventDefault()
    auth.logout()
    history.push('/')
  }

  let lastScrollTop = 0
  window.addEventListener('scroll', () => {
    let navbar = document.querySelector('#top-navbar')
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop
    if (scrollTop > lastScrollTop) {
      navbar.style.top = '-70px'
    } else {
      navbar.style.top = '0'
    }
    lastScrollTop = scrollTop
  })

  const navbarToggle = () => {
    const nv = document.getElementById("top-navbar")
    if (nv.className === "navbar") {
      nv.className += " responsive"
    } else {
      nv.className = "navbar"
    }
  }

  return (
    <>
      <div id="noop"></div>
      <nav className="navbar" id="top-navbar">
        <div className="navbar-wrapper">
          <span>Movie Planet</span>
          
          <ul>
            <li><NavLink to="/">Now playing</NavLink></li>
            <li><NavLink to="/soon">Comming soon</NavLink></li>
            <li><NavLink to="/contact">Contact</NavLink></li>
          </ul>
        </div>
        
            {
              auth.isAuthenticated 
              ? <ul className="account"><li><NavLink to="/profile">Profile</NavLink></li>
                  <li><a href="/" onClick={logoutHandler}>Logout</a></li></ul>
              : <ul className="account"><li><NavLink to="/auth/signup">Sign up</NavLink></li>
                  <li><NavLink to="/auth/signin">Sign in</NavLink></li></ul>
            }
            <div className="i" onClick={navbarToggle} >
              <div/><div/><div/>
            </div>
      </nav>
    </>
  )
}