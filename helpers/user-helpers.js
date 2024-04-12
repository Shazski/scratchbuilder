var db = require ('../config/connection')
var collName = require("../config/collections") 
const bcrypt = require('bcrypt')
const promise = require('promise')
const { reject, resolve } = require('promise')
const async = require('hbs/lib/async')
const { ObjectId } = require('mongodb')
const { response } = require('express')
const res = require('express/lib/response')

module.exports = {
    doSignup:(userData)=>{
        return new promise(async(resolve,reject)=>{
            
            let respo ={}
            userData.password =await bcrypt.hash(userData.password,10)
            db.get().collection(collName.user_collection).findOne({$or:[{email:userData.email},{firstname:userData.firstname}]}).then((status)=>{
                if(status){
                    respo.status=true
                    resolve(respo)
                }else{
                    db.get().collection(collName.user_collection).insertOne(userData)
                    resolve({status:false})
                }
            })
                
            
            })
            
        
    },


    doLogin:(loginData)=>{
        return new promise(async(resolve,reject)=>{
            let Status = false
            let response= {}
            let user = await db.get().collection(collName.user_collection).findOne({email:loginData.email})
            if(user){
               
                bcrypt.compare(loginData.password,user.password).then((status)=>{
                    
                    if(status){
                        response.user = user
                        response.status =true
                        resolve(response)
                        
                    }else{
                        resolve({status:false})
                    }

                })  
            }else{
                console.log("login failed");
                resolve({status:false})
            }
        })
    },


    addCustomBuild:(customPc)=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collName.custom_collection).insertOne(customPc).then((response)=>{
                resolve(response.insertedId)
            })
        });
    },

    getTotal:(id)=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collName.custom_collection).findOne({_id:ObjectId(id)}).then((response)=>{
                resolve(response)
            })
     
        })
    },

    addBuy:(details)=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collName.buy_collection).insertOne(details).then((response)=>{
                resolve(response)
            })
        });
    },
    addBuyPre:(details)=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collName.preBuy_collection).insertOne(details).then((response)=>{
                resolve(response)
            })
        });
    },
    addPayment:(details,buyid)=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collName.payment_collection).insertOne(details).then((response)=>{
                db.get().collection(collName.buy_collection).updateOne({_id:ObjectId(buyid)},{
                    $set:{
                        paymentStatus:"done"
                    }
                }).then((response)=>{
                    resolve(response)
                })
            })
        });
    },

    getPreBuildPcB:()=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collName.pc_collection).find({category:"budget"}).toArray().then((response)=>{
                resolve(response)
            })
        });
    },
    getPreBuildPcE:()=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collName.pc_collection).find({category:"enthusiast"}).toArray().then((response)=>{
                resolve(response)
            })
        });
    },
    getPreBuildPcX:()=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collName.pc_collection).find({category:"extream"}).toArray().then((response)=>{
                resolve(response)
            })
        });
    },
    getPreBuildPcS:()=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collName.pc_collection).find({category:"streaming"}).toArray().then((response)=>{
                resolve(response)
            })
        });
    },

    getBuyOrders:()=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collName.buy_collection).find({status:"placed"}).toArray().then((response)=>{
                resolve(response)
            })
        });
    },
    getPreBuyOrders:()=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collName.preBuy_collection).find({status:"placed"}).toArray().then((response)=>{
                resolve(response)
            })
        });
    },
    getShippedOrders:()=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collName.buy_collection).find({$or:[{status:"shipped"},{status:"delivered"}]}).toArray().then((response)=>{
                resolve(response)
            })
        });
    },
    getShippedPreOrders:()=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collName.preBuy_collection).find({$or:[{status:"shipped"},{status:"delivered"}]}).toArray().then((response)=>{
                resolve(response)
            })
        });
    },    

    getUserOrders:(userId)=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collName.preBuy_collection).find({userId:userId}).toArray().then((response)=>{
                resolve(response)
            })
        });
    },
    getUserCustomOrders:(userId)=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collName.buy_collection).find({userId:userId}).toArray().then((response)=>{
                resolve(response)
            })
        });
    },

    getOrderPc:(pcName)=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collName.pc_collection).findOne({name:pcName}).then((response)=>{
                resolve(response)
            })
        });
    },
    getOrderCustomPc:(customId)=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collName.custom_collection).findOne({_id:ObjectId(customId)}).then((response)=>{
                resolve(response)
            })
        });
    },

}
