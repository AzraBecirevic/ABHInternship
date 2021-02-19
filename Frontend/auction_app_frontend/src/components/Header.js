import React from 'react'
import { Nav, Navbar } from 'react-bootstrap' 
import styles from './Header.css'
import NavbarBlack from './NavbarBlack'
import NavbarWhite from './NavbarWhite'


const Header = () => {
    return (
        <div className="header">
           <NavbarBlack></NavbarBlack>
           <NavbarWhite></NavbarWhite>
	    </div>
        
    )
}

export default Header

/*

<Navbar className="upperBlack" bg="dark">
               <Nav className="firstNav" >
                   <div className="socialMediaLinks">
                       <Nav.Link className="upperLink">f</Nav.Link>
                       <Nav.Link className="upperLink">i</Nav.Link>
                       <Nav.Link className="upperLink">t</Nav.Link>
                       <Nav.Link className="upperLink">g</Nav.Link>
                   </div>
               
                   <div className="registerLogin">
                   <Nav.Link className="upperLink">Login</Nav.Link> 
                   <Nav.Link className="upperLink" disabled>or</Nav.Link>
                   <Nav.Link className="upperLink">Create account</Nav.Link>
                   </div>
               </Nav>

           </Navbar>
           <Navbar className="mainWhite" bg="light" >
           <Nav className="secondNav">
                   <div className="logo">AUCTION</div>
                   <div className="searchBar"></div>
                   <div className="manu" style={{display:'flex'}}>
                       <Nav.Link>HOME</Nav.Link>
                   </div>
                   
               </Nav>
           </Navbar>

*/
