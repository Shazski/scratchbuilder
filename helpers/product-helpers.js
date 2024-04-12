var db = require ('../config/connection')
var nodemailer = require('nodemailer')
var collName = require("../config/collections") 
var promise = require("promise")
const { resolve, reject } = require('promise')
const { response } = require('express')
const async = require('hbs/lib/async')
var objectId = require('mongodb').ObjectId
const { Db } = require('mongodb')

module.exports ={

    addPc:(product,callback)=>{
        db.get().collection(collName.pc_collection).insertOne(product).then((data)=>{
            callback(data.insertedId)
        })
    },
    getallPc:()=>{
        return new promise(async(resolve,reject)=>{
            let product =await db.get().collection(collName.pc_collection).find().toArray()
            resolve(product)
        })
    },
    deletePc:(proId)=>{
        return new promise((resolve,reject)=>{
            db.get().collection(collName.pc_collection).deleteOne({_id:objectId(proId)}).then((response)=>{
                resolve(response)
            })
        })
    },
    pcDetails:(proId)=>{
        return new promise((resolve,reject)=>{
            db.get().collection(collName.pc_collection).findOne({_id:objectId(proId)}).then((products)=>{
                resolve(products)
            })
        })
    },
    updatePc:(proId,proDetails)=>{
        return new promise((resolve,reject)=>{
            db.get().collection(collName.pc_collection)
            .updateOne({_id:objectId(proId)},
            {$set:{
                category:proDetails.category,
                name:proDetails.name,
                processor:proDetails.processor,
                motherboard:proDetails.motherboard,
                graphics:proDetails.graphics,
                ssd:proDetails.ssd,
                hdd:proDetails.hdd,
                ram:proDetails.ram,
                cabinet:proDetails.cabinet,
                cooler:proDetails.cooler,
                psu:proDetails.psu,
                price:proDetails.price
            }}).then((response)=>{
                resolve(response)
            })
            
        })
    },

    getCustomBuild:(id)=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collName.custom_collection).findOne({_id:objectId(id)}).then((response)=>{
                resolve(response)
            })
        });
    },
    updateShipment:(email,buyId)=>{
        var transporter = nodemailer.createTransport({
            secure: true,
            port: 465,
            service: 'gmail',
            auth: {
              user: "ecommerce1419@gmail.com",
              pass: "iqtyaldszzgoweap"
            }
          });
          
          var mailOptions = {
            from: 'ecommerce1419@gmail.com',
            to: email,
            subject: 'Custom Pc build Update',
            text: 'Your custom pc build has been completed and will be delivered to your given address within 5 working days "'
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
              resolve('mail not sent')
            } else {
                console.log('Email sent: ' + info.response);
            }
        })
        db.get().collection(collName.buy_collection).updateOne({_id:objectId(buyId)},{
            $set:{
                status:"shipped"
            }
        })
    },
    updatePreShipment:(email,preBuyId)=>{
        var transporter = nodemailer.createTransport({
            secure: true,
            port: 465,
            service: 'gmail',
            auth: {
              user: "ecommerce1419@gmail.com",
              pass: "iqtyaldszzgoweap"
            }
          });
          
          var mailOptions = {
            from: 'ecommerce1419@gmail.com',
            to: email,
            subject: 'Pre build PC Shipped ',
            text: 'Your pc  has been shipped and will be delivered to your given address within 5 working days "'
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
              resolve('mail not sent')
            } else {
                console.log('Email sent: ' + info.response);
            }
        })
        db.get().collection(collName.preBuy_collection).updateOne({_id:objectId(preBuyId)},{
            $set:{
                status:"shipped"
            }
        })
    },

    updateDelivery:(email,buyId)=>{
        var transporter = nodemailer.createTransport({
            secure: true,
            port: 465,
            service: 'gmail',
            auth: {
              user: "ecommerce1419@gmail.com",
              pass: "iqtyaldszzgoweap"
            }
          });
          
          var mailOptions = {
            from: 'ecommerce1419@gmail.com',
            to: email,
            subject: 'Custom Pc build Update',
            text: 'Your custom pc build has been delivered successfully"'
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
              resolve('mail not sent')
            } else {
                console.log('Email sent: ' + info.response);
            }
        })
        db.get().collection(collName.buy_collection).updateOne({_id:objectId(buyId)},{
            $set:{
                status:"delivered"
            }
        })
    },
    updatePreDelivery:(email,preBuyId)=>{
        var transporter = nodemailer.createTransport({
            secure: true,
            port: 465,
            service: 'gmail',
            auth: {
              user: "ecommerce1419@gmail.com",
              pass: "iqtyaldszzgoweap"
            }
          });
          
          var mailOptions = {
            from: 'ecommerce1419@gmail.com',
            to: email,
            subject: 'Custom Pc build Update',
            text: 'Your custom pc build has been delivered successfully"'
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
              resolve('mail not sent')
            } else {
                console.log('Email sent: ' + info.response);
            }
        })
        db.get().collection(collName.preBuy_collection).updateOne({_id:objectId(preBuyId)},{
            $set:{
                status:"delivered"
            }
        })
    },

    getAllUsers:()=>{
        return new promise((resolve,reject)=>{
            db.get().collection(collName.user_collection).find().toArray().then((response)=>{
                resolve(response)
            })
        })
    },


    getCount:()=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collName.buy_collection).find({status:"placed"}).count().then((response)=>{
                resolve(response)
            })
        });
    },
    getPreCount:()=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collName.preBuy_collection).find({status:"placed"}).count().then((response)=>{
                resolve(response)
            })
        });
    },

}