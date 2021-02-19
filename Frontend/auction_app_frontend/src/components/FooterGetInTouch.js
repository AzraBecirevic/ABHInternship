import React from 'react'
import { Link } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook } from '@fortawesome/free-brands-svg-icons'
import { faInstagramSquare } from '@fortawesome/free-brands-svg-icons'
import { faTwitterSquare} from '@fortawesome/free-brands-svg-icons'
import { faGooglePlus} from '@fortawesome/free-brands-svg-icons'

const FooterGetInTouch = () => {
    return (
        <div className="footerTouch">

            <p className="footerInfoHeading">GET IN TOUCH</p>
            <ul className="infoList">
                <li ><span className="infoPar">Call Us at +123 797-567-2535</span></li>
                <li><span className="infoPar">support@auction.com</span></li>
                <li>
                <ul className="socMediaList" >
                           <li className="infoItem"><FontAwesomeIcon icon={faFacebook} size={'lg'} style={{color:'grey'}}/></li>
                           <li className="infoItem"><FontAwesomeIcon icon={faInstagramSquare} size={'lg'} style={{color:'grey'}}/></li>
                           <li className="infoItem"><FontAwesomeIcon icon={faTwitterSquare} size={'lg'}  style={{color:'grey'}}/></li>
                           <li className="infoItem"><FontAwesomeIcon icon={faGooglePlus} size={'lg'}  style={{color:'grey'}}/></li>
                       </ul>  
                </li>
            </ul>
            
        </div>
    )
}

export default FooterGetInTouch
