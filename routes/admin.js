var express = require('express');
const async = require('hbs/lib/async');
const { response } = require('../app');
const adminHelper = require('../helpers/admin-helper');
var router = express.Router();
var productHelpers= require('../helpers/product-helpers');
const { getAllShippedProducts } = require('../helpers/user-helpers');
const userHelpers = require('../helpers/user-helpers');
var user=require('../routes/users')
const verifyLogin = (req,res,next)=>{
  if(req.session.admin){
    next()
  }else{
    res.redirect('/admin/admin-login')
  }
}

router.get('/',verifyLogin,async function(req, res) {
  if(req.session.loggeIn){
    let admin=req.session.admin
    let count = await productHelpers.getCount()
    let count2 = await productHelpers.getPreCount()
    console.log(count);
    productHelpers.getallPc().then((pc)=>{

      res.render('admi/view-products',{admin,pc,count,count2});
    })
  
  }else{
    res.render('admi/admin-login')
  }
});

router.get("/admin-login",(req,res)=>{
    res.render('admi/admin-login',{admin:true})
})

router.post("/admin-login",(req,res)=>{
  adminHelper.adminLogin(req.body).then((adminres)=>{
    if(adminres.stat){
      req.session.loggeIn=true
      req.session.admin=adminres.admin
      res.redirect('/admin')
    }else{
      res.render('admi/admin-login')
    }
  })
})

router.get('/add-pc',verifyLogin,async(req,res)=>{
  let count = await productHelpers.getCount()
  let count2 = await productHelpers.getPreCount()
  res.render('admi/add-pc',{admin:true,count,count2})
})

router.post('/add-pc',(req,res)=>{
  productHelpers.addPc(req.body,(id)=>{
    let image = req.files.image
    image.mv('./public/images/'+id+'.jpg')
    res.render('admi/add-pc',{admin:true})
  })

})

router.get('/delete-products/:id',(req,res)=>{
  let proId =req.params.id
  productHelpers.deletePc(proId).then((response)=>{
    res.redirect('/admin')
  })
})

router.get('/edit-products/:id',async(req,res)=>{
  let count = await productHelpers.getCount()
  let count2 = await productHelpers.getPreCount()
  let newPro =await productHelpers.pcDetails(req.params.id)

    res.render('admi/edit-products',{admin:true,newPro,count,count2})
})    

router.get('/admin-logout',(req,res)=>{
  req.session.admin=null
  req.session.loggeIn=null
  res.redirect('/admin')
})

router.post('/edit-products/:id',(req,res)=>{
  productHelpers.updatePc(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
    if(req.files.image){
      let id = req.params.id
      let image = req.files.image
    image.mv('./public/images/'+id+'.jpg')
    }
  })
})

router.get('/view-custom-bookings',verifyLogin,async(req,res)=>{
  let customOrder =  await userHelpers.getBuyOrders()
  let count = await productHelpers.getCount()
  let count2 = await productHelpers.getPreCount()
  res.render('admi/view-ordered-products',{admin:true,customOrder,count,count2})
})
router.get('/view-pre-build-bookings',verifyLogin,async(req,res)=>{
  let preOrder =  await userHelpers.getPreBuyOrders()
  let count = await productHelpers.getCount()
  let count2 = await productHelpers.getPreCount()
  res.render('admi/view-pre-ordered-products',{admin:true,preOrder,count,count2})
})
router.get('/view-shipped-custom',verifyLogin,async(req,res)=>{
  let count = await productHelpers.getCount()
  let count2 = await productHelpers.getPreCount()
  let Order =  await userHelpers.getShippedOrders()
  res.render('admi/view-updated-orders',{admin:true,Order,count,count2})
})
router.get('/view-shipped-pre',verifyLogin,async(req,res)=>{
  let count = await productHelpers.getCount()
  let count2 = await productHelpers.getPreCount()
  let Order =  await userHelpers.getShippedPreOrders()
  res.render('admi/view-pre-updated-orders',{admin:true,Order,count,count2})
})

router.get("/view-custom-pc-order/:id",verifyLogin,async(req,res)=>{
  let count = await productHelpers.getCount()
  let count2 = await productHelpers.getPreCount()
  let view = await productHelpers.getCustomBuild(req.params.id)
  res.render('admi/custom-build',{admin:true,view,count,count2})
})

router.get('/update-shipment/',async(req,res)=>{
  productHelpers.updateShipment(req.query.email,req.query.id)
    res.redirect('/admin/view-custom-bookings')
  
})
router.get('/update-pre-shipment/',async(req,res)=>{
  productHelpers.updatePreShipment(req.query.email,req.query.id)
    res.redirect('/admin/view-pre-bookings')
  
})
router.get('/update-delivery/',async(req,res)=>{
  productHelpers.updateDelivery(req.query.email,req.query.id)
    res.redirect('/admin/view-shipped-custom')
  
})
router.get('/update-pre-delivery/',async(req,res)=>{
  productHelpers.updatePreDelivery(req.query.email,req.query.id)
    res.redirect('/admin/view-shipped-pre')
  
})

router.get('/all-users',async(req,res)=>{
  let count = await productHelpers.getCount()
  let count2 = await productHelpers.getPreCount()
 let users =await productHelpers.getAllUsers()
 res.render('admi/all-users',{users,admin:true,count,count2})
})


module.exports = router;
