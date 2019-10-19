var mongoose = require('mongoose')
var Goods = require('../models/goods')
mongoose.connect('mongodb://127.0.0.1:27017/mydb')

mongoose.connection.on("connected", function(){
    console.log('ok success')
})

var User = require('./../models/users')
var useId = '100000077'

function myfoo(obj,f,params) {
    // return new Promise(function (resolve, reject) {
    //     User.findOne({userId:useId}, (err, dataStr) => {
    
    //       if (err) return reject(err)
    //       resolve(dataStr)
    
    //     })
    //   })


    if(f == 'findOne'){
       return new Promise(function (resolve, reject) {
        obj.findOne(params, (err, dataStr) => {
    
            if (err) return reject(err)
            resolve(dataStr)
      
          })
        })
    }
    else if(f == 'save'){
               return new Promise(function (resolve, reject) {
            obj.save((err, dataStr) => {
              if (err) return reject(err)
              resolve(dataStr)
            })
        })
    }
    // if(f == 'save'){
    //     return new Promise(function (resolve, reject) {
    //         obj.save((err, dataStr) => {
    //           if (err) return reject(err)
    //           resolve(dataStr)
    //         })
    //     })
    // }
 }

 myfoo(User,'findOne',{userId:useId})
    .then(function(doc){
        console.log(String(doc))
        console.log('1111111111111111')
        // return myfoo(Goods,'findOne',{productId:productId})
    })
    .catch(function(err){
        console.log(err.message)
    })


    //    User.findOne({userId:useId},function(err,doc){
    //     if(err){
    //         console.log('1')
    //     }else{
    //         console.log(String(doc))
    //     }
    // })

