import React from 'react'

const TextHelper = (props) => {
    return (
        <div>
            <h5 className="policySubTitle">{props.title}</h5>
            <div className="privacyTextDiv">
                <p>{props.text}</p>
            </div>
        </div>  
    )
}

export default TextHelper
