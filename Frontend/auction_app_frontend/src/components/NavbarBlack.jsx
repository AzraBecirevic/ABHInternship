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
    
    const googleLink = 'https://accounts.google.com/signup/v2/webcreateaccount?flowName=GlifWebSignIn&flowEntry=SignUp'
    const facebookLink = 'https://www.facebook.com/'
    const instagramLink = 'https://www.instagram.com/'
    const twitterLink = 'https://twitter.com/'

    function openWebPage(e, link) {
        props.openWebPage(e, link);
      }

    return (
        <Navbar className="upperBlack" >
            <Nav className="firstNav" >
                <div className="socialMediaLinks">
                    <ul className="socMediaList" >
                        <li className="listItem"><FontAwesomeIcon icon={faFacebook} size={'lg'} onClick={(e)=>openWebPage(e, facebookLink)} /></li>
                        <li className="listItem"><FontAwesomeIcon icon={faInstagramSquare} size={'lg'} onClick={(e)=>openWebPage(e, instagramLink)} /></li>
                        <li className="listItem"><FontAwesomeIcon icon={faTwitterSquare} size={'lg'} onClick={(e)=>openWebPage(e, twitterLink)} /></li>
                        <li className="listItem"><FontAwesomeIcon icon={faGooglePlus} size={'lg'} onClick={(e)=>openWebPage(e, googleLink)} /></li>
                    </ul>  
                </div>
                <div className="registerLogin">
                    <Link  className="upperLink">Login</Link> 
                    <Link  className="disabledLink">or</Link>
                    <Link to="/register" className="upperLink">Create account</Link>
                </div>
            </Nav>
        </Navbar>
    )
}

export default NavbarBlack
