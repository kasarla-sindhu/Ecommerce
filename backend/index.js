require('dotenv').config();
const port=process.env.PORT || 5000;


const express=require('express')


const app=express();


const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
const multer=require('multer')
const path=require('path')
const cors=require('cors');

const corsOptions = {
    origin: [
        'https://ecommerce-website-570a87.netlify.app', 
        'http://localhost:5173',
        'http://localhost:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin'],
    credentials: true,
};

  
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));  
app.use(express.json()) 
 

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });




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


app.post('/upload', cors(corsOptions), upload.single('product'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: 0, message: "Image upload failed." });
    }
    res.json({
        success: 1,
        image_url: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
});



const Product=mongoose.model("Product",{   
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



app.post('/removeproduct',async (req,res)=>{
    await Product.findOneAndDelete({id:req.body.id})
    console.log('Removed')
    res.json({
        success:true,
        name:req.body.name,
    })
})



app.get('/allproducts',async(req,res)=>{
    let products = await Product.find({})
    console.log("All Products Fetched")
    res.send(products)
})



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

    const token = jwt.sign(data, process.env.JWT_SECRET);
    res.json({success:true,token})
})



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
            const token = jwt.sign(data, process.env.JWT_SECRET);
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



app.get('/newcollections',async(req,res)=>{
    let products=await Product.find({});
    let newcollection= products.slice(1).slice(-8);
    console.log('newcollection fetched')
    res.send(newcollection)
})



app.get('/popularinwomen',async(req,res)=>{
    let products=await Product.find({category:'women'})
    let popularinwomen=products.slice(0,4)
    console.log('popular in women fetched')
    res.send(popularinwomen)
})



const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).json({ error: "Please authenticate using a valid token" });
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Please authenticate using a valid token" });
    }
};




app.post('/addtocart',fetchUser,async(req,res)=>{
    let userdata=await Users.findOne({_id:req.user.id});
    userdata.cartData[req.body.itemId]+=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userdata.cartData})
    res.send("Added")
})


app.post('/removefromcart',fetchUser,async(req,res)=>{
    let userdata=await Users.findOne({_id:req.user.id});
    if(userdata.cartData[req.body.itemId] >0)
    userdata.cartData[req.body.itemId]-=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userdata.cartData})
    res.send("Removed")
})


app.post('/getcart',fetchUser,async(req,res)=>{
    let userData=await Users.findOne({_id:req.user.id})
    res.json(userData.cartData)
})


app.listen(port, (err) => {
    if (!err) {
        console.log(`Server is running on Port ${port}`);
    } else {
        console.error(`Server error: ${err}`);
    }
});



