import React from 'react'
import styles from './NavbarWhite.css'
import { Nav, Navbar } from 'react-bootstrap' 
import { Link } from 'react-router-dom'
import logo from './Images/logo.PNG'


const NavbarWhite = () => {
    return (
        <Navbar className="mainWhite" >
            <Nav className="secondNav">
                <div className="heading">
                    <img className="logoImg" src={logo} alt="Logo"/>
                    <Link to='/' className="homeLink">AUCTION</Link>
                </div>
                <div className="searchBar"></div>
                <div className="menu" >
                    <Link to='/' className="menuItem">HOME</Link>
                </div>   
            </Nav>
        </Navbar>
    )
}

export default NavbarWhite
