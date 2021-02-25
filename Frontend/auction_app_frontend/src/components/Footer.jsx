import styles from './Footer.css'
import FooterAuction from './FooterAuction'
import FooterGetInTouch from './FooterGetInTouch'

import React, { Component } from 'react'

export class Footer extends Component {
    
    constructor(props){
        super(props)
    }

    render() {
        return (
            <footer className="footer">
                <div className="footerDiv">
                    <FooterAuction/>
                    <FooterGetInTouch openWebLink={this.props.openLink}/>
                </div>
        </footer>
        )
    }
}

export default Footer



