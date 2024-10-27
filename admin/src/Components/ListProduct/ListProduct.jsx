import React, { useEffect, useState } from 'react'
import './ListProduct.css'
import crossicon from '../../assets/cross_icon.png'

const ListProduct = () => {
  const[allproducts,setAllproducts]=useState([])
  
  const getProducts=async()=>{
    await fetch('http://localhost:5000/allproducts')
    .then((res)=> res.json())
    .then((data)=>{setAllproducts(data)})
  }

  useEffect(()=>{
    getProducts()
  },[])

  const removeProduct=async(id)=>{
    await fetch('http://localhost:5000/removeproduct',{
      method:'POST',
      headers:{
        Accept:'application/json',
        'Content-Type':'application/json'
      },
      body:JSON.stringify({id:id})
    })
    await getProducts()
  }

  return (
    <div className='list-product'>
        <h1>All Products List</h1>
        <div className="listproduct-format-main">
          <p>Products</p>
          <p>Title</p>
          <p>Old Price</p>
          <p>New Price</p>
          <p>Category</p>
          <p>Remove</p>
        </div>
        <div className="listproduct-allproducts">
          <hr />
          {allproducts.map((eachproduct,index)=> {
            return <>
            <div key={index} className="listproduct-format-main listproduct-format">
              <img src={eachproduct.image} alt=""  className='listproduct-product-icon'/>
              <p>{eachproduct.name}</p>
              <p>${eachproduct.ols_price}</p>
              <p>${eachproduct.new_price}</p>
              <p>{eachproduct.category}</p>
              <img onClick={()=>{removeProduct(eachproduct.id)}} src={crossicon} alt="" className="listproduct-remove-icon" />
            </div>
            <hr />
            </>
          })}
        </div>
    </div>
  )
}

export default ListProduct