import React, { createContext, useEffect, useState } from 'react'

export const ShopContext= createContext(null)
const getDefaultCart=()=>{
    let cart = {}
    for (let i=0;i<300+1;i++){
        cart[i]=0;
    }
    return cart
}

const ShopContextProvider=(props)=>{
    const[all_product,setallproduct]=useState([])
    const [cartItems,setCartItems]=useState(getDefaultCart())

    useEffect(()=>{
        fetch('https://ecommerce-pei1.onrender.com/allproducts')
        .then((res)=> res.json())
        .then((data)=> setallproduct(data))

        if(localStorage.getItem('auth-token')){
            fetch('https://ecommerce-pei1.onrender.com/getcart',{
                method:'POST',
                headers:{
                    Accept:'application/json',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:""
            })
            .then((res)=> res.json())
            .then((data)=> setCartItems(data))
        }
    },[])

    const addToCart=(itemId)=>{
        setCartItems((prev)=> ({...prev,[itemId]:prev[itemId]+1}))
        console.log(cartItems);
        if(localStorage.getItem('auth-token')){
            fetch('https://ecommerce-pei1.onrender.com/addtocart',{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({"itemId":itemId})
            })
            .then((res)=> res.json())
            .then((data)=> console.log(data))
        }
    }
    const removeFromCart=(itemId)=>{
        setCartItems((prev)=> ({...prev,[itemId]:prev[itemId]-11}))
        if(localStorage.getItem('auth-token')){
            fetch('https://ecommerce-pei1.onrender.com/removefromcart',{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({"itemId":itemId})
            })
            .then((res)=> res.json())
            .then((data)=> console.log(data))
        }
    }

    const getTotalCartAmount =()=>{
        let totalAmount =0
        for(const item in cartItems){
            if(cartItems[item]>0){
                let itemInfo = all_product.find((product)=> product.id===Number(item))
                totalAmount+=itemInfo.new_price * cartItems[item]
            }
        }
        return totalAmount
    }

    const getTotalCartItem=()=>{
        let totalItem=0;
        for(const item in cartItems){
            if(cartItems[item]>0){
                totalItem+=cartItems[item]
            }
        }
        return totalItem
    }

    const contextValue={getTotalCartItem,getTotalCartAmount,all_product,cartItems,addToCart,removeFromCart};
    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;
