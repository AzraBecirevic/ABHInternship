import styles from './NavbarBlack.css';
import { Nav, Navbar } from 'react-bootstrap' 
import { Link } from 'react-router-dom'


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook } from '@fortawesome/free-brands-svg-icons'
import { faInstagramSquare } from '@fortawesome/free-brands-svg-icons'
import { faTwitterSquare} from '@fortawesome/free-brands-svg-icons'
import { faGooglePlus} from '@fortawesome/free-brands-svg-icons'

import React, { Component } from 'react'

export class NavbarBlack extends Component {

    googleLink = 'https://accounts.google.com/signup/v2/webcreateaccount?flowName=GlifWebSignIn&flowEntry=SignUp'
    facebookLink = 'https://www.facebook.com/'
    instagramLink = 'https://www.instagram.com/'
    twitterLink = 'https://twitter.com/'

    openWebPage=(e, link)=> {
        this.props.openWebPage(e, link);
    }

    render() {

        var token = window.sessionStorage.getItem('token');  
    let divUser;
    if (token==null) {
        divUser = <div className="registerLogin">
            <Link  className="upperLink">Login</Link> 
            <Link  className="disabledLink">or</Link>
            <Link to="/register" className="upperLink">Create account</Link>
        </div>;
      } 
      else {
        divUser = <div className="registerLogin">
            <Link  className="disabledLink">{sessionStorage.getItem('userName')}</Link>
        </div>;
    }


        return (
            <Navbar className="upperBlack" >
                <Nav className="firstNav" >
                    <div className="socialMediaLinks">
                        <ul className="socMediaList" >
                            <li className="listItem"><FontAwesomeIcon icon={faFacebook} size={'lg'} onClick={(e)=>this.openWebPage(e, this.facebookLink)} /></li>
                            <li className="listItem"><FontAwesomeIcon icon={faInstagramSquare} size={'lg'} onClick={(e)=>this.openWebPage(e, this.instagramLink)} /></li>
                            <li className="listItem"><FontAwesomeIcon icon={faTwitterSquare} size={'lg'} onClick={(e)=>this.openWebPage(e, this.twitterLink)} /></li>
                            <li className="listItem"><FontAwesomeIcon icon={faGooglePlus} size={'lg'} onClick={(e)=>this.openWebPage(e, this.googleLink)} /></li>
                        </ul>  
                    </div>
                    {divUser}
                </Nav>
            </Navbar>
        )
    }
}

export default NavbarBlack

