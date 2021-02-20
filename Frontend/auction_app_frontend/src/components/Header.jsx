import React from 'react'
import { Nav, Navbar } from 'react-bootstrap' 
import styles from './Header.css'
import NavbarBlack from './NavbarBlack'
import NavbarWhite from './NavbarWhite'


const Header = (props) => {
    
    return (
        <div className="header">
           <NavbarBlack openWebPage={props.openMe}></NavbarBlack>
           <NavbarWhite></NavbarWhite>
	    </div>
        
    )
}

export default Header

