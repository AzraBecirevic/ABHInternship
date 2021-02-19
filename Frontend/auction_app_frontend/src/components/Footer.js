import React from 'react'
import styles from './Footer.css'
import FooterAuction from './FooterAuction'
import FooterGetInTouch from './FooterGetInTouch'

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footerDiv">
                <FooterAuction/>
                <FooterGetInTouch/>
            </div>
        </footer>
    )
}

export default Footer
