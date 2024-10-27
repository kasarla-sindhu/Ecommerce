import React from 'react'
import './RelatedProduct.css'
import data_product from '../Assets/data'
import Item from '../Item/Item'

const RelatedProduct = () => {
  return (
    <div className='relatedproducts'>
        <h1>Related Products</h1>
        <hr />
        <div className="relatedproducts-item">
            {data_product.map((eachitem)=>{
                return <Item key={eachitem.i} id={eachitem.id} name={eachitem.name} image={eachitem.image} new_price={eachitem.new_price} old_price={eachitem.old_price}/>
            })}
        </div>
    </div>
  )
}

export default RelatedProduct