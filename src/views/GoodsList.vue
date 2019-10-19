<template>
<div>
    <NavHeader/>
    <NavBread>
        <span>Goods</span>
    </NavBread>
    <div class="accessory-result-page accessory-page">
    <div class="container">
        <div class="filter-nav">
        <span class="sortby">Sort by:</span>
        <a href="javascript:void(0)" class="default cur">Default</a>
        <a href="javascript:void(0)" class="price" @click="sortGoods">Price <svg class="icon icon-arrow-short" v-bind:class="{'sort-up':!sortFlag}"><use xlink:href="#icon-arrow-short"></use></svg></a>
        <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
        </div>
        <div class="accessory-result">
        <!-- filter -->
        <div class="filter stopPop" id="filter" :class="{'filterby-show':filterby}" >
            <dl class="filter-price">
            <dt>Price:</dt>
            <dd><a href="javascript:void(0)" :class= "{'cur':priceChecked == 'all'}" @click="priceChecked='all'">All</a></dd>
            <dd v-for="(price,index) in priceFilter" :key="index" >
                <a href="javascript:void(0)" :class= "{'cur':priceChecked == index}" @click="setprice(index)" >{{price.startPrice}} - {{price.endPrice}}</a>
            </dd>
            </dl>
        </div>

        <!-- search result accessories list -->
        <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
            <ul>
                <li v-for="(item,index) in goodsList" v-bind:key="index">
                <div class="pic">
                    <a href="#"><img v-lazy="'static/img/'+item.productImage" alt=""></a>
                </div>
                <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area">
                    <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">Add to Cart</a>
                    </div>
                </div>
                </li>
            </ul>
            <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
            <img src="static\loading-svg\loading-spinning-bubbles.svg" alt="" v-show="loading">
        </div>
            </div>
        
        </div>
        </div>
    </div>
    </div>
    <div class="md-overlay" v-show="overlayFlag" @click.stop="closePop"></div>
    <Modal v-bind:mdShow="mdShow" v-on:close="closeModal">
        <p slot="message">pls login first</p>
        <div slot="btnGroup">
            <a href="javascript:;" class="btn btn--m" @click="mdShow=false">close</a>
        </div>
    </Modal>
    <Modal v-bind:mdShow="mdShowCart" v-on:close="closeModal">
        <p slot="message">add to cart success</p>
        <div slot="btnGroup">
            <a href="javascript:;" class="btn btn--m" @click="mdShowCart=false">close</a>
            <router-link href="javascript:;" class="btn btn--m" to="/cart">see your cart</router-link>
        </div>
    </Modal>
    <NavFooter/>
</div>
</template>

<script>
import './../assets/css/base.css'
import './../assets/css/product.css'
import NavHeader from '@/components/NavHeader'
import NavFooter from '@/components/NavFooter'
import NavBread from '@/components/NavBread'
import Modal from '@/components/Modal'
import axios from 'axios'


export default {
  name: 'GoodsList',
  data () {
    return {
      goodsList: 'Welcome to Your Vue.js App',
      priceChecked: 'all',
      filterby: false,
      overlayFlag:false,
      sortFlag:true,
      page:1,
      pageSize:8,
      busy: false,
      loading:false,
      mdShow:false,
      mdShowCart:false,
      priceFilter:[
                  {
                      startPrice:'0.00',
                      endPrice:'100.00'
                  },
                  {
                    startPrice:'100.00',
                    endPrice:'500.00'
                  },
                  {
                    startPrice:'500.00',
                    endPrice:'1000.00'
                  },
                  {
                    startPrice:'1000.00',
                    endPrice:'5000.00'
                  }
                ],
    }
  },
  components:{
      NavHeader,
      NavFooter,
      NavBread,
      Modal
  },
  mounted() {
      this.getGoodsList()
  },
  methods: {
      getGoodsList(flag){
          var param = {
              page:this.page,
              pageSize:this.pageSize,
              sort:this.sortFlag?1:-1,
              priceLevel:this.priceChecked
          }
          loading:true
          axios.get('/goods/list',{params:param}).then((result)=>{
              var res = result.data
              loading:false
              if(flag){
                  this.goodsList = this.goodsList.concat(res.result.list)
                //   this.goodsList = res.result
                  if(res.result.count==0){
                      this.busy=true
                  }else{
                      this.busy=false
                  }
              }else{
                  this.goodsList = res.result.list
                  this.busy=false
              }
              
          })
      },
      showFilterPop(){
          this.filterby = true
          this.overlayFlag=true
      },
      setprice(index){
          this.priceChecked = index
          this.page = 1
          this.getGoodsList()
          this.closePop()
      },
      closePop(){
          this.filterby = false
          this.overlayFlag=false

      },
      sortGoods(){
          this.sortFlag = ! this.sortFlag
          this.page=1
          this.getGoodsList()
      },
      loadMore: function() {
        this.busy = true;
 
        setTimeout(() => {
            this.page++
            this.getGoodsList(true)
            // this.busy = true;
         }, 500)
      },
      addCart(productId){
          axios.post('/goods/cart',{productId:productId}).then((res)=>{
              if(res.data.status==0){
                  this.mdShowCart=true
              }else{
                  this.mdShow=true
              }
          })
      },
      closeModal(){
          this.mdShow=false
          this.mdShowCart=false
      },
    
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.sort-up{
    transform: rotate(180deg);
    transition: all .3s ease-out;
}
.btn:hover{
    background-color: coral;
    transition: all .3s ease-out;
}
</style>
