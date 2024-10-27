//In this file our express server is running
const port=process.env.PORT || 5000;

//import dependencies
const express=require('express')

//creating app instance using express
const app=express();

//initializing mongoose , jsonwebtoken,multer package
const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
const multer=require('multer')
const path=require('path') //using this path we can get access to backend directory in our express app
const cors=require('cors');
const { type } = require('os');
const { log } = require('console');


app.use(express.json()) //with the help of express.json() whatever  req we will get from response that is automatically parsed through json
app.use(cors()) //using this out react project connect to express app on 4000 port

// database  connection with MongoDb 
mongoose.connect("mongodb+srv://sindhukasarla999:Sindhu$123@cluster0.y0z9v.mongodb.net/e-commerce")


app.get("/",(req,res)=>{
    res.send('Express App is Running')
})

// Image Storage Engine
const storage=multer.diskStorage({
    destination:'./upload/images',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})


const upload=multer({storage:storage})

app.use('/images',express.static('upload/images'))

//creation upload endpoint for images
app.post('/upload',upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})

// product addition to mongodb atlas database - whenever we upload any obj in mgdb database before we have to create a scheme
//Schema for creatin products

const Product=mongoose.model("Product",{   //product is name of schema and obj is product model
    id:{
        type:Number,
        required: true,
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        default:Date.now,
    },
    available:{
        type:Boolean,
        default:true
    },
})

//we will use the schema to add product in database

app.post('/addproduct',async(req,res)=>{
    let products=await Product.find({})
    let id;
    if(products.length >0){
        let last_product_array=products.slice(-1)
        let last_product=last_product_array[0]
        id=last_product.id + 1
    }
    else{
        id=1
    }
    const product=new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    })
    console.log(product)
    await product.save()
    console.log('Saved')
    res.json({
        success:true,
        name:req.body.name
    })
})

// Creating API for deleting Products

app.post('/removeproduct',async (req,res)=>{
    await Product.findOneAndDelete({id:req.body.id})
    console.log('Removed')
    res.json({
        success:true,
        name:req.body.name,
    })
})

//Creating API for getting all products

app.get('/allproducts',async(req,res)=>{
    let products = await Product.find({})
    console.log("All Products Fetched")
    res.send(products)
})

//schema for user model

const Users=mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})

//creation End Point for registering users

app.post('/signup',async(req,res)=>{
    let check=await Users.findOne({email:req.body.email})
    if(check){
        return res.status(400).json({success:false,errors:'existing user found with the email address'})
    }
    let cart={};
    for(let i=0;i<300;i++){
        cart[i]=0;
    }
    const user=new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart
    })

    await user.save();

    const data={
        user:{
            id:user.id
        }
    }

    const token=jwt.sign(data,'secret_ecom')
    res.json({success:true,token})
})

//creating End Point for user login 

app.post('/login',async(req,res)=>{
    let user=await Users.findOne({email:req.body.email});
    if(user){
        const passCompare=req.body.password === user.password;
        if(passCompare){
            const data={
                user:{
                    id:user.id
                }
            }
            const token=jwt.sign(data,'secret_ecom')
            res.json({success:true,token});
        }
        else{
            res.json({success:false,errors:'Wrong Password'});
        }
    }
    else{
        res.json({success:false,errors:'Wrong Email Id'})
    }
})

// creating endpoint for newcollection data

app.get('/newcollections',async(req,res)=>{
    let products=await Product.find({});
    let newcollection= products.slice(1).slice(-8);
    console.log('newcollection fetched')
    res.send(newcollection)
})

//creating endpoint for popular in women section

app.get('/popularinwomen',async(req,res)=>{
    let products=await Product.find({category:'women'})
    let popularinwomen=products.slice(0,4)
    console.log('popular in women fetched')
    res.send(popularinwomen)
})

//creating midleware to fetch user

const fetchUser=async(req,res,next)=>{
    const token=req.header('auth-token');
    if(!token){
        res.status(401).send({errors:"Please Authenticate using valid token"})
    }
    else{
        try{
            const data=jwt.verify(token,'secret_ecom')
            req.user=data.user;
            next()
        }
        catch(error){
            res.status(401).send({errors:"Please authenticate using valid token"})
        }
    }
}

// creating endpoint for adding products in cartdata

app.post('/addtocart',fetchUser,async(req,res)=>{
    let userdata=await Users.findOne({_id:req.user.id});
    userdata.cartData[req.body.itemId]+=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userdata.cartData})
    res.send("Added")
})

//creating endpoint to remove product from cart data
app.post('/removefromcart',fetchUser,async(req,res)=>{
    let userdata=await Users.findOne({_id:req.user.id});
    if(userdata.cartData[req.body.itemId] >0)
    userdata.cartData[req.body.itemId]-=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userdata.cartData})
    res.send("Removed")
})

//creating endpoint to get cartdata
app.post('/getcart',fetchUser,async(req,res)=>{
    let userData=await Users.findOne({_id:req.user.id})
    res.json(userData.cartData)
})

//API creation
app.listen(port,(err)=>{
    if(!err){
        console.log(`Server is running on Port ${port}`)
    }
    else{
        console.log(`Error : ${err}`)
    }
})


