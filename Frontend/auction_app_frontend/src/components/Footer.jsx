import React from 'react'
import styles from './Footer.css'
import FooterAuction from './FooterAuction'
import FooterGetInTouch from './FooterGetInTouch'

const Footer = (props) => {
    return (
        <footer className="footer">
            <div className="footerDiv">
                <FooterAuction/>
                <FooterGetInTouch  openWebLink={props.openLink}/>
            </div>
        </footer>
    )
}

export default Footer
