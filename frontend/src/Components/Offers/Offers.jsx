import React from 'react'
import './Offer.css'
import exclusive_image from '../Assets/exclusive_image.png'

const Offers = () => {
  return (
    <div className='offers'>
        <div className="offers-left">
            <h1>EXclusive</h1>
            <h1>Offers For YOU</h1>
            <p>ONLY ON BEST SELLERS PRODUCTS</p>
        </div>
        <div className="offers-right">
            <img src={exclusive_image} alt="" />
        </div>
    </div>
  )
}

export default Offers