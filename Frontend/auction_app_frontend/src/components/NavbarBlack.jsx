import React from 'react'
import styles from './NavbarBlack.css';
import { Nav, Navbar } from 'react-bootstrap' 
import { Link } from 'react-router-dom'


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook } from '@fortawesome/free-brands-svg-icons'
import { faInstagramSquare } from '@fortawesome/free-brands-svg-icons'
import { faTwitterSquare} from '@fortawesome/free-brands-svg-icons'
import { faGooglePlus} from '@fortawesome/free-brands-svg-icons'



const NavbarBlack = (props) => {
    
    return (
        <Navbar className="upperBlack" >
               <Nav className="firstNav" >
                   <div className="socialMediaLinks">
                       <ul className="socMediaList" >
                           <li className="listItem"><FontAwesomeIcon icon={faFacebook} size={'lg'} onClick={(e)=>props.openWebPage(e,'https://www.facebook.com/')} /></li>
                           <li className="listItem"><FontAwesomeIcon icon={faInstagramSquare} size={'lg'} onClick={(e)=>props.openWebPage(e,'https://www.instagram.com/')} /></li>
                           <li className="listItem"><FontAwesomeIcon icon={faTwitterSquare} size={'lg'} onClick={(e)=>props.openWebPage(e,'https://twitter.com/')} /></li>
                           <li className="listItem"><FontAwesomeIcon icon={faGooglePlus} size={'lg'} onClick={(e)=>props.openWebPage(e,'https://accounts.google.com/signup/v2/webcreateaccount?flowName=GlifWebSignIn&flowEntry=SignUp')} /></li>
                       </ul>  
                   </div>
               
                   <div className="registerLogin">
                   <Link  className="upperLink">Login</Link> 
                   <Link  className="disabledLink">or</Link>
                   <Link  className="upperLink">Create account</Link>
                   </div>
               </Nav>

           </Navbar>
    )
}

export default NavbarBlack
