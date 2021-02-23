import React from 'react'
import { Link } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook } from '@fortawesome/free-brands-svg-icons'
import { faInstagramSquare } from '@fortawesome/free-brands-svg-icons'
import { faTwitterSquare} from '@fortawesome/free-brands-svg-icons'
import { faGooglePlus} from '@fortawesome/free-brands-svg-icons'

const FooterGetInTouch = (props) => {

    const googleLink = 'https://accounts.google.com/signup/v2/webcreateaccount?flowName=GlifWebSignIn&flowEntry=SignUp'
    const facebookLink = 'https://www.facebook.com/'
    const instagramLink = 'https://www.instagram.com/'
    const twitterLink = 'https://twitter.com/'

    function openWebLink(e, link) {
        props.openWebLink(e, link);
    }
   
    return (
        <div className="footerTouch">
            <p className="footerInfoHeading">GET IN TOUCH</p>
            <ul className="infoList">
                <li className="infoListLi" ><span className="infoPar">Call Us at +123 797-567-2535</span></li>
                <li className="infoListLi"><span className="infoPar">support@auction.com</span></li>
                <li className="infoListLi">
                    <ul className="socMediaList" >
                        <li className="infoItem"><FontAwesomeIcon icon={faFacebook} size={'lg'} onClick={(e)=>openWebLink(e, facebookLink)} /></li>
                        <li className="infoItem"><FontAwesomeIcon icon={faInstagramSquare} size={'lg'} onClick={(e)=>openWebLink(e, instagramLink)} /></li>
                        <li className="infoItem"><FontAwesomeIcon icon={faTwitterSquare} size={'lg'} onClick={(e)=>openWebLink(e, twitterLink)} /></li>
                        <li className="infoItem"><FontAwesomeIcon icon={faGooglePlus} size={'lg'} onClick={(e)=>openWebLink(e, googleLink)} /></li>
                    </ul>  
                </li>
            </ul>  
        </div>
    )
}

export default FooterGetInTouch
