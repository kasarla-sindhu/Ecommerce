import React, { useEffect, useState } from 'react'
import './Popular.css'
import Item from '../Item/Item'

const Popular = () => {
  const[popularProducts,setPopularproducts]=useState([])

  useEffect(()=>{
    fetch('https://ecommerce-lcw5.onrender.com/popularinwomen')
    .then((res)=> res.json())
    .then((data)=>setPopularproducts(data))
  },[])

  return (
    <div className='popular'>
        <h1>POPULAR IN WOMEN</h1>
        <hr/>
        <div className="popular-item">
            {popularProducts.map((eachitem)=> {
                return <Item key={eachitem.i} id={eachitem.id} name={eachitem.name} image={eachitem.image} new_price={eachitem.new_price} old_price={eachitem.old_price}/>
            })}
        </div>
    </div>
  )
}

export default Popular