import React from 'react'
import  bids  from './Images/bids.jpg';
import bid from './Images/bid.jpg'
import bags from './Images/bags.jpg'

const AboutUs = () => {
    return (
        <div className="aboutUs" style={{marginLeft:'10%', marginRight:'10%'}}>
            <h1>About Us</h1>
            <div style={{display:'flex'}}>
            <div className="textDiv" style={{ width:'500px', height:'750px', marginRight:'110px'}}>
               <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin egestas elementum imperdiet. Aliquam arcu nisl, ultrices sed libero venenatis, eleifend facilisis enim. Nulla eu auctor dui, et suscipit massa. Donec vestibulum sem purus, at pellentesque sapien euismod ut. Duis id urna in velit vestibulum mollis. Cras id congue velit. Nullam neque diam, luctus ultrices dui eget, volutpat egestas est. Integer ligula sem, sollicitudin quis faucibus eget, ultricies sed libero. Maecenas tempor efficitur orci, eu pulvinar nisi bibendum et. Morbi venenatis massa eget massa porttitor suscipit. Nam non mi at augue accumsan semper sed sit amet lacus.</p>
               <p>Sed sodales nec erat quis porta. Etiam magna massa, commodo eu tincidunt sit amet, laoreet sit amet arcu. Aenean imperdiet efficitur porttitor. Nunc nec dui lobortis, eleifend erat eget, tincidunt arcu. In ut aliquet risus, et tempor sapien. Aliquam pharetra erat eget orci pretium, vel rhoncus magna ultrices. Maecenas a tempus nisl. Cras semper et augue nec lobortis. Nullam placerat eros nec maximus dignissim. Etiam cursus dolor nisl, sed egestas quam interdum non. Praesent felis nulla, tincidunt ut scelerisque quis, faucibus a dui. Quisque varius turpis id ipsum ultrices, quis condimentum dolor tempor. Sed eros risus, faucibus in iaculis quis, congue id dolor. Quisque in mollis nisl.</p>
            </div>
            <div className="picturesDiv">
                <div style={{width:'500px', marginBottom:'11px'}}>
                    <img src={bids} alt="Bids" style={{width:'500px', height:'350px'}}></img>
                </div>
                <div style={{width:'500px', display:'flex', justifyContent:'space-between'}} >
                    <img src={bid} alt="Bid" style={{width:'240px', height:'181px'}}></img>
                    <img src={bags} alt="Bags" style={{width:'240px', height:'181px'}}></img>
                </div>
            </div>
            </div>
        </div>
    )
}

export default AboutUs
