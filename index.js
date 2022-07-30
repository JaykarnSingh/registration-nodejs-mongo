const express= require('express');
const app=express();
const ejs=require('ejs');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const port=process.env.PORT || 7000;

app.use(express.static('public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended:true
})
);

mongoose.connect('mongodb://0.0.0.0:27017/userDatabase',{useNewUrlParser: true});

const userSchema={
    name:{
        type:String,
        required:true,
    },
    phone:{
    type:Number,
    required:true,
    length:{
        max:10,
    },
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        length:{
            min:8,
            max:20
        }
    }
        
}
const userModel=new mongoose.model("User",userSchema);

app.get('/register',(req,res)=>{
    res.render('register');
});

app.get('/login',(req,res)=>{
    res.render('login');
}); 

app.post('/register',(req,res)=>{
    const newUser=new userModel({
        name:req.body.username,
        phone:req.body.userphone,
        email:req.body.useremail,
        password:req.body.userpassword
    })
    newUser.save((err)=>{
        if(err){
            console.log(err)
        }
        else{
            res.render('login')
        }
    })
})

app.post('/login',(req,res)=>{
    
    const useremail=req.body.useremail;
    const password=req.body.userpassword;
    
   userModel.findOne({email:useremail},(err, foundUser)=>{
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                if(foundUser.password===password)
                {
                   res.render('home');
                } else{
                    res.write('<h1>Error! wrong Id</h1>');
                    res.end();
                }
            }
        }
    });
});

 app.listen(port,(req,res)=>{
    console.log(`connect with port no ${port}`)
 })
