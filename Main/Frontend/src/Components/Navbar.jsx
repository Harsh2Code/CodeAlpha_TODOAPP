import React from 'react'
import {Link} from 'react-router-dom'

function Navbar() {
  return (
    <div>
        <div className="navbar bg-[#1F2937] w-screen px-8 shadow-sm">
  <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        <li><a>Item 1</a></li>
        <li>
          <a>Parent</a>
          <ul className="p-2">
            <li><a>Submenu 1</a></li>
            <li><a>Submenu 2</a></li>
          </ul>
        </li>
        <li><a>Item 3</a></li>
      </ul>
    </div>
    <a className="btn btn-ghost text-xl"><img src="/cha-bubbles-two-svgrepo-com.svg" alt="logo" className="w-12" /></a>
  </div>
  <div className="navbar-center hidden lg:flex">
    
  </div>
  <div className="navbar-end">
    <button className="btn btn-outline px-6 btn-info btn-md mr-2 font-bold" ><Link to="/login" ><i className="ri-links-line text-xl"></i>Login</Link></button>
    <button className="btn btn-md btn-outline btn-primary px-6 font-bold"><Link to="/register"> <i className="ri-login-circle-line text-xl"></i>Sign Up</Link></button>
  </div>
</div>
    </div>
  )
}

export default Navbar