import React, { useEffect, useState } from 'react'
import './NewCollection.css'
import Item from '../Item/Item'

const NewCollection = () => {
  const[new_collection,setnewcollectin]=useState([])

  useEffect(()=>{
    fetch('https://ecommerce-pei1.onrender.com/newcollections')
    .then((res)=> res.json())
    .then((data)=> setnewcollectin(data))
  },[])

  return (
    <div className='new-collections'>
        <h1>NEW COLLECTIONS</h1>
        <hr />
        <div className="collections">
            {new_collection.map((eachitem)=>{
                return <Item key={eachitem.i} id={eachitem.id} name={eachitem.name} image={eachitem.image} new_price={eachitem.new_price} old_price={eachitem.old_price}/>
            })}
        </div>
    </div>
  )
}

export default NewCollection