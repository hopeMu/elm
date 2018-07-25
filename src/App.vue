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
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import vHeader from './components/header/header'
const ERR_OK = 0;


export default {
  name: 'App',
  data() {
    return {
      seller:{}
    }
  },
  created() {
    this.$http.get('/api/seller').then((response) => {
      // console.log(response.body)
      response = response.body;
      if(response.errno===ERR_OK){
        this.seller = response.data;
        console.log(this.seller)
      }
      // console.log('1')
    })
  },
  components:{
    vHeader
  }
}
</script>

<style lang="stylus">
  @import './common/stylus/mixin.styl'
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
