import styles from './NavbarWhite.css'
import { Nav, Navbar } from 'react-bootstrap' 
import { Link } from 'react-router-dom'
import logo from '../assets/logo.PNG'  


import React, { Component } from 'react'
import { HOME_ROUTE } from '../constants/routes';


export class NavbarWhite extends Component {
    render() {
        return (
            <Navbar className="mainWhite" >
                <Nav className="secondNav">
                    <div className="heading">
                        <img className="logoImg" src={logo} alt="Logo"/>
                        <Link to={HOME_ROUTE} className="homeLink">AUCTION</Link>
                    </div>
                    <div className="searchBar"></div>
                    <div className="menu" >
                        <Link to={HOME_ROUTE} className="menuItem">HOME</Link>
                    </div>   
                </Nav>
        </Navbar>
        )
    }
}

export default NavbarWhite

