<template>
  <div id="app">
    <div class="header">
        <v-header :seller = "seller"></v-header>
    </div>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="goods">商品</router-link>
        <!-- <a v-link="{path:'/goods'}">商品</a> -->
      </div>
      <div class="tab-item">
        <router-link to="ratings">评论</router-link>
        <!-- <a v-link="{path:'/ratings'}">评论</a> -->
      </div>
      <div class="tab-item">
        <router-link to="seller">商家</router-link>
        <!-- <a v-link="{path:'/seller'}">商家</a> -->
      </div>
    </div>
    <div class="content">
      <keep-alive>
        <router-view :seller="seller"></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import vHeader from './components/header/header'
import {urlParse} from './common/js/util.js'
const ERR_OK = 0;
const debug = process.env.NODE_ENV !== 'production';

export default {
  name: 'App',
  data() {
    return {
      seller:{
        id:(()=>{
            let queryParam = urlParse();
            // console.log(queryParam)
            return queryParam.id;
        })()
      }
    }
  },
  created() {
    // this.$http.get('/api/seller').then((response) => {
    //   // console.log(response.body)
    //   response = response.body;
    //   if(response.errno===ERR_OK){
    //     this.seller = response.data;
    //     // console.log(this.seller)
    //   }
    //   // console.log('1')
    // })
    const url = debug ? '/api/seller' : 'http://ustbhuangyi.com/sell/api/seller';
      this.$http.get(url + '?id=' + this.seller.id).then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.seller = Object.assign({}, this.seller, response.data);
          //Object.assign ES6语法合并对象
        }
      });
  },
  components:{
    vHeader
  }
}
</script>

<style lang="stylus">
  @import './common/stylus/mixin.styl'
  @import './common/stylus/style.css'
  #app
    .tab
      display flex
      width 100%
      height 40px
      line-height 40px
      /*border-bottom 1px solid #ccc*/
      border-1px(#ccc)
      .tab-item
        flex 1
        text-align center
        & > a
          display block
          color  #000
          text-decoration none
          font-size 14px
        .router-link-active
          color red
</style>
