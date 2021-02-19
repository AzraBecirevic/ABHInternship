import React from 'react'
import { Link } from 'react-router-dom'
import styles from './FooterAuction.css'

const FooterAuction = () => {
    return (
        <div className="footerInfo" >
            <p className="footerInfoHeading">AUCTION</p>
            <ul className="infoList">
                <li ><Link to='/about' className="infoLink">About us</Link></li>
                <li><Link className="infoLink">Tearms and Conditions</Link></li>
                <li><Link className="infoLink">Privacy and Policy</Link></li>
            </ul>
        </div>
    )
}

export default FooterAuction
