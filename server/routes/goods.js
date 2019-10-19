var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
var Goods = require('../models/goods')

mongoose.connect('mongodb://127.0.0.1:27017/mydb')

mongoose.connection.on("connected", function(){
    console.log('ok successaa')
})

function myfoo(obj,f,params) {

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
}

/* GET users listing. */
router.get('/list', function(req, res, next) {
  let page = parseInt(req.param('page'))
  let pageSize = parseInt(req.param('pageSize'))
  let priceLevel = req.param('priceLevel')
  var priceGt = '', priceLte = ''
  let params = {}
  if(priceLevel!='all'){
    switch(priceLevel){
        case '0': priceGt=0;priceLte=100;break
        case '1': priceGt=100;priceLte=500;break
        case '2': priceGt=500;priceLte=1000;break
        case '3': priceGt=1000;priceLte=5000;break
        default:priceGt=0;priceLte=5000;break
    }
    params = {
        salePrice:{
            $gt:priceGt,
            $lte:priceLte
        }
    }
  }
  let sort = req.param('sort')
  let skip = (page-1)*pageSize
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize)
  goodsModel.sort({'salePrice':sort})
  goodsModel.exec(function(err,doc){
    if(err){
        res.json({
            status:'1',
            msg:err.message
        })
    }else{
        res.json({
            status:'0',
            msg:'',
            result:{
                count:doc.length,
                list:doc  
            }
        })
    }
  })
});

router.post('/cart', function(req, res, next) {
    var useId = '100000077'
    var productId = req.body.productId
    var User = require('./../models/users')
    
    var userDoc = new Object
    var goodsItem = ''
    myfoo(User,'findOne',{userId:useId})
    .then(function(doc){
        userDoc = doc
        doc.cartList.forEach(element => {
            if(element.productId == productId){
                goodsItem = element
                element.productNum++
            }
        });
        if(goodsItem){
            return myfoo(doc,'save')
        }else{
            return myfoo(Goods,'findOne',{productId:productId})
        }   
    })
    .then(function(data){
        if(goodsItem){
            res.json({
                status:0,
                msg:'',
                result:'success'
            })
        }else{
            data.productNum = 1
            data.checked = 1
            userDoc.cartList.push(data)
            return myfoo(userDoc,'save')
        } 
    })
    .then(function(data){
        res.json({
            status:0,
            msg:'',
            result:'success'
        })
    })
    .catch(function(err){
        res.json({
            status:1,
            msg:err.message
        })
    })



});

module.exports = router;

