var express = require('express');
const res = require('express/lib/response');
const async = require('hbs/lib/async');
const { response, render } = require('../app');
var router = express.Router();
var productHelper =  require('../helpers/product-helpers')
var userHelper = require ('../helpers/user-helpers');
const { route } = require('./admin');
const verifyLogin = (req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}
const sellerverify = (req,res,next)=>{
  if(req.session.sellerLogin){
    next()
  }else{
    res.redirect('/seller-login')
  }
}


router.get('/', async function(req, res, next) {
  let user = req.session.user
    res.render('user/view-products',{admin:false,user}); 
  
});

router.get('/login',(req,res)=>{
  if(req.session.loggedIn){
    res.redirect('/')
    
  }else{
    res.render('user/user-login',{'loginerror':req.session.loginErr})
    req.session.loginErr = false
  }
    
})

router.get('/signup',(req,res)=>{
  if(req.session.loggedIn){
    res.redirect('/')
  }else{
    res.render('user/user-signup')

  }
})

router.post('/signup',(req,res)=>{
  userHelper.doSignup(req.body).then((respo)=>{
    
    if(respo.status){
      emailExits="Email or Username already taken.Try different username or email"
      res.render('user/user-signup',{emailExits})
    }else{
      res.redirect('/login')
    }
  })
})
    
  


router.post('/login',(req,res)=>{
  userHelper.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn=true
      req.session.user = response.user
      res.redirect('/')
    }else{
      req.session.loginErr="Invalid username or password!please check it"
      res.redirect('/login')
    }
  })
})

router.get('/logout',(req,res)=>{
  req.session.user=null
  req.session.loggedIn=null
  res.redirect('/')
})

router.get('/custom-build',verifyLogin,async(req,res)=>{
  res.render('user/system-build',{user:req.session.user})
})

router.get('/pre-build',verifyLogin,async(req,res)=>{
  user = req.session.user
  res.render('user/pre-build',{user})
})
router.get('/laptops',verifyLogin,async(req,res)=>{
  res.render('user/laptops',{user:req.session.user})
})
router.get('/pre-build/view-more/budget',verifyLogin,async(req,res)=>{
  let pc = await userHelper.getPreBuildPcB()
  category = pc[0].category
  res.render('user/view-more',{user:req.session.user,pc,category})
})

router.get('/pre-build/view-more/enthusiast',verifyLogin,async(req,res)=>{
  let pc = await userHelper.getPreBuildPcE()
  category = pc[0].category
  res.render('user/view-more',{user:req.session.user,pc,category})
})

router.get('/pre-build/view-more/extreme',verifyLogin,async(req,res)=>{
  let pc = await userHelper.getPreBuildPcX()
  category = pc[0].category
  console.log(pc);
  res.render('user/view-more',{user:req.session.user,pc,category})
})

router.get('/pre-build/view-more/streaming',verifyLogin,async(req,res)=>{
  let pc = await userHelper.getPreBuildPcS()
  category = pc[0].category
  res.render('user/view-more',{user:req.session.user,pc,category})
})
router.post('/add-build',(req,res)=>{
  userHelper.addCustomBuild(req.body).then((response)=>{
    req.session.customid=response
    res.redirect('/details')
  })
})
router.get('/pre-build/buy-pre-build/',verifyLogin,(req,res)=>{
  let userId = req.session.user._id
  let email = req.session.user.email
  let price = req.query.price
  let pcName = req.query.pcName
  res.render('user/pre-details',{pcName,price,email,userId})
})

router.get('/details',verifyLogin,(req,res)=>{
  userHelper.getTotal(req.session.customid).then((response)=>{
   let amount = parseInt(response.rprice)+parseInt(response.mprice)+parseInt(response.proprice)+parseInt(response.sprice)+parseInt(response.hprice)+parseInt(response.cprice)+parseInt(response.wprice)+parseInt(response.gprice)+parseInt(response.kprice)
    req.session.amount =amount
    userEmail = req.session.user.email
    userId = req.session.user._id
    let customId = req.session.customid
    res.render('user/details',{amount,userEmail,userId,customId,user:req.session.user})
  })
})

router.post('/buy-now',verifyLogin,(req,res)=>{
  userHelper.addBuy(req.body).then((response)=>{
    req.session.buyId = response.insertedId
    if(req.body.payment === "Cod"){

      res.redirect('/congrats')
    }else{
      res.redirect('/payment')
    }
  })
})
router.post('/buy-now-pre',verifyLogin,(req,res)=>{
  userHelper.addBuyPre(req.body).then((response)=>{
    console.log(req.body);
    req.session.amount = req.body.amount
    req.session.buyId = response.insertedId
    if(req.body.payment === "Cod"){

      res.redirect('/congrats')
    }else{
      res.redirect('/payment')
    }
  })
})

router.get('/payment',verifyLogin,async(req,res)=>{
  amount = req.session.amount
  buyId = req.session.buyId
  userId = req.session.user._id
  res.render('user/payment',{amount,buyId,userId})
})

router.post('/payment',verifyLogin,(req,res)=>{
  userHelper.addPayment(req.body,req.session.buyId).then((response)=>{
    res.redirect('/congrats')
  })
})

router.get('/congrats',verifyLogin,(req,res)=>{
  res.render('user/congrats')
})

router.get('/view-orders',verifyLogin,async(req,res)=>{
 let order =await userHelper.getUserOrders(req.session.user._id)
 console.log(order,req.session.user._id);
  res.render('user/view-orders',{order,user:req.session.user})
})
router.get('/view-custom-orders',verifyLogin,async(req,res)=>{
 let order =await userHelper.getUserCustomOrders(req.session.user._id)
  res.render('user/view-custom-pc',{order,user:req.session.user})
})

router.get('/view-pre-shipment/:name',verifyLogin,async(req,res)=>{
  let orderPc = await userHelper.getOrderPc(req.params.name)
  res.render('user/view-my-pc',{orderPc})
})
router.get('/view-custom-shipment/:id',verifyLogin,async(req,res)=>{
  let orderPc = await userHelper.getOrderCustomPc(req.params.id)
  console.log(orderPc);
  res.render('user/view-custom-order',{orderPc})
})

module.exports =router
