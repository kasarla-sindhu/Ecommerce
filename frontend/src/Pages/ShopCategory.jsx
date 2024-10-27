import React, { useContext } from 'react'
import './CSS/ShopCategory.css'
import { ShopContext } from '../Context/ShopContext'
import dropdown_icon from '../Components/Assets/dropdown_icon.png'
import Item from '../Components/Item/Item'

const ShopCategory = (props) => {
  const {all_product}=useContext(ShopContext)
  return (
    <div className='shop-category'>
      <img className='shopcategory-banner' src={props.banner} alt="" />
      <div className="shopcategory-indexsort">
        <p>
          <span>Showing 1-12</span> out of 36 products
        </p>
        <div className="shopcategory-sort">
          Sort by <img src={dropdown_icon} alt="" />
        </div>
      </div>
      <div className="shopcategory-products">
        {all_product.map((eachitem)=> {
          if(props.category===eachitem.category){
            return <Item  key={eachitem.i} id={eachitem.id} name={eachitem.name} image={eachitem.image} new_price={eachitem.new_price} old_price={eachitem.old_price} />
          }
          else{
            return null
          }
        } )}
      </div>
      <div className="shopcategory-loadmore">
        Explore  More
      </div>
    </div>
  )
}

export default ShopCategory