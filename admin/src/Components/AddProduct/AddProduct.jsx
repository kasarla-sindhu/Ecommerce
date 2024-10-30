import React, { useState } from 'react'
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg'

const AddProduct = () => {
    const[image,setImage]=useState(false)
    const[productDetails,setProductDetails]=useState({
        name:'',
        image:'',
        category:'women',
        new_price:'',
        old_price:'',
    })
    const changeHandler=(e)=>{
        setProductDetails({
            ...productDetails,[e.target.name]:e.target.value
        })
    }
    const imageHandler=(e)=>{
        setImage(e.target.files[0])
    }

    const addProduct=async()=>{
        console.log(productDetails)
        let responseData
        let product=productDetails

        let formData =new FormData()
        formData.append('product',image);  //field name product

        await fetch('https://ecommerce-lcw5.onrender.com/upload',{
            method:'POST',
            headers:{
                Accept:'application/json'
            },
            body:formData,
        }).then((res)=> res.json()).then((data)=> {responseData=data})

        if(responseData.success){
            product.image=responseData.image_url
            console.log(product)
            await fetch('https://ecommerce-lcw5.onrender.com/addproduct',{
                method:'POST',
                headers:{
                    Accept:'application/json',
                    'Content-Type':'application/json',
                },
                body:JSON.stringify(product)
            }).then((res)=> res.json() ).then((data)=> {
                data.success ? alert('Product Added Successfully'): alert('Failed To Add Product')
            })
        }
    }
  return (
    <div className='add-product'>
        <div className="addproduct-itemfield">
            <p>Product Title</p>
            <input onChange={changeHandler} value={productDetails.name} type="text" name='name' placeholder='Tye here' />
        </div>
        <div className="addproduct-price">
            <div className="addproduct-itemfield">
                <p>Price</p>
                <input onChange={changeHandler} value={productDetails.old_price} type="text" name='old_price' placeholder='Type Here' />
            </div>
            <div className="addproduct-itemfield">
                <p>Offer Price</p>
                <input onChange={changeHandler} value={productDetails.new_price} type="text" name='new_price' placeholder='Type Here' />
            </div>
        </div>
        <div className="addproduct-itemfield">
            <p>Product Category</p>
            <select onChange={changeHandler} value={productDetails.category} name="category" className='add-product-selector'>
                <option value="women">Women</option>
                <option value="men">Men</option>
                <option value="kid">Kid</option>
            </select>
        </div>
        <div className="addproduct-itemfield">
            <label htmlFor="file-input">
                <img src={image? URL.createObjectURL(image):upload_area} className='addproduct-thumnail-img' alt="" />
            </label>
            <input onChange={imageHandler}  type="file" name='image' id='file-input' hidden />
        </div>
        <button onClick={()=>{addProduct()}} className='addproduct-btn'>Add</button>
    </div>
  )
}

export default AddProduct