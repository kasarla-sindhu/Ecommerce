import React from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
  return (
    <div className='description-box'>
        <div className="descriptionbox-navigator">
            <div className="descriptionbox-navbox">
                Description
            </div>
            <div className="descriptionbox-navbox fade">
                Reviews (122)
            </div>
        </div>
        <div className="descriptionbox-description">
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Modi rerum odit, pariatur quos, vitae eos exercitationem eius nisi quisquam nemo laudantium debitis eligendi voluptates vero sint, expedita fuga itaque repudiandae?</p>

        </div>
    </div>
  )
}

export default DescriptionBox