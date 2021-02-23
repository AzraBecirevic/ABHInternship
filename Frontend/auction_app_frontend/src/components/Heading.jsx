import React, { Component } from 'react'
import styles from './Heading.css'


export class Heading extends Component {
    render() {
        return (
            <div className="pageHeadingDiv">
                <div>
                    <p className="pageHeadingTitle">{this.props.title}</p>
                </div>
            </div>
        )
    }
}

export default Heading
