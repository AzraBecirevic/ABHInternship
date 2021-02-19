import React from 'react'
import { Link } from 'react-router-dom'
import styles from './FooterAuction.css'

const FooterAuction = () => {
    return (
        <div className="footerInfo" >
            <p className="footerInfoHeading">AUCTION</p>
            <ul className="infoList">
                <li className="infoListLi"><Link to='/about' className="infoLink">About us</Link></li>
                <li className="infoListLi"><Link to='/tearmsConditions' className="infoLink">Tearms and Conditions</Link></li>
                <li className="infoListLi"><Link to='/privacyPolicy' className="infoLink">Privacy and Policy</Link></li>
            </ul>
        </div>
    )
}

export default FooterAuction