<template>
    <div>
        <div class="shopcart">
            <div class="content" @click="totaleList">
                <div class="content-left">
                    <div class="logo-wrapper">
                        <div class="logo" :class="{'highlight':totalCount>0}">
                            <i class="icon-shopping_cart"
                            :class="{'highlight':totalCount>0}"></i>
                        </div>
                        <div class="num" v-show="totalCount>0">{{totalCount}}</div>                   <!--选择多少个-->
                    </div>
                    <div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}元</div>
                    <div class="desc">另需配送费 ￥{{deliveryPrice}}元</div>
                </div>
                <div class="content-right" @click.stop.prevent="pay">
                    <div class="pay" :class="payClass">
                        {{payDesc}}
                    </div>
                </div>
                <!--小球-->
                <div class="ball-container">
                    <transition name="drop"  v-for="(ball,index) in balls" :key="index"
                        @before-enter="beforeEnter"
                        @enter="enter"
                        @after-enter="afterEenter"
                    > 
                        <div v-show="ball.show" class="ball">
                            <div class="inner inner-hook"></div>
                        </div>
                    </transition>
                </div>
                <transition name="fold">
                    <div class="shopcart-list" v-show="listShow">
                        <div class="list-header">
                            <h1 class="title">购物车</h1>
                            <span class="empty" @click="empty">清空</span>
                        </div>
                        <div class="listContent" ref="listContent">
                            <ul>
                                <li class="food" v-for="(food,index) in selectFoods" :key="index">
                                    <span class="name">{{food.name}}</span>
                                    <div class="price">                           
                                        <span>￥{{food.price*food.count}}</span>
                                    </div>
                                    <div class="cartcontrol-wrapper">
                                        <cartcontrol :food="food"></cartcontrol>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </transition>
                
            </div>
        </div>
        <transition name="fade">
            <div class="list-mask" v-show="listShow" @click="hideList"></div>
        </transition>
    </div>
</template>

<script>

import BScroll from 'better-scroll';
import cartcontrol from '../cartcontrol/cartcontrol'
export default {
    props:{
        selectFoods:{                       //关联选择商品的数组        状态属性的关联
            type:Array,                     //这个方法接收到的数组  是选中所有商品的数组 每个单独的都是一个对象重复的不覆盖 他接收所有选中商品的信息 一边购物组件的显示购买的信息
            default() {
                return [
                   
                ];
            }
        },
        deliveryPrice:{
            type:Number,
            default:0
        },
         minPrice:{
            type:Number,
            default:0
        },
    },
    data(){
        return {
            balls:[{
                show:false
            },
            {
                 show:false
            },
            {
                 show:false
            },
            {
                 show:false
            },
            {
                 show:false
            }],
            dropBalls:[],
            fold:true
        }
    },
    computed:{
        totalPrice() {
            let total = 0;
            this.selectFoods.forEach((food)=>{
                total += food.price * food.count;           //单价：price
            })
            // return total+this.deliveryPrice
                return total
        },
        totalCount() {
            let count = 0;
            this.selectFoods.forEach((food)=>{
                count += food.count;
            });
            return count;
        },
        payDesc(){
            if(this.totalPrice === 0){
                let diff = this.minPrice;
                // console.log(diff)
                return `￥${diff}元起送`;
            }else if(this.totalPrice<this.minPrice){
                let diff = this.minPrice - this.totalPrice              //最小起送价-物品总价
                return `还差 ￥${diff}元起送`
            }else{
                return '去结算';
            }
        },
        payClass(){
            if(this.totalPrice < this.minPrice){
                return 'not-enough';
            }else{
                return 'enough';
            }
        },
        listShow(){
            if(!this.totalCount){           //没有购买商品时
                this.fold = true;
                return false;
            }
            let show = !this.fold;
            if(show){
                this.$nextTick(() => {      //数据变了DOM并还没有变化需要$nextTick去让他等到Dom变化后执行
                // console.log(this.$refs.listContent)
                    if (!this.scroll){
                        this.scroll = new BScroll(this.$refs.listContent,{
                            click: true
                        })
                    }else{
                        this.scroll.refresh();
                    }   
                }) 
            }
            return show;
        }
        
    },
    // methods:{
    //     drop(el){
    //         for(let i = 0;i < this.balls.length; i++){
    //             let ball = this.balls[i];
    //             // console.log(ball)
    //             if(!ball.show){
    //                 ball.show = true;
    //                 ball.el = el;
    //                 this.dropBalls.push(ball);
    //                 return;
    //             }
    //         };
    //         // this.$nextTick(()=>{
    //         //     beforeEnter();
    //         //     enter();
    //         //     afterEenter()
    //         // })
    //     },
    //     beforeEnter: function(el){          //动画开始前确定开始位置
    //     console.log(this.dropBalls)
    //         let count = this.balls.length;
    //         // console.log(count)                  //小球的个数
    //         while (count--){                       //当小球存在时
    //             let ball = this.balls[count];      //拿到某个
    //             // console.log(ball)
    //             if(ball.show){                     //当某个小球显示时
    //                 let rect = ball.el.getBoundingClientRect();     //用浏览器接口方法获取待点击区域的位置（坐标）
    //                 let x = rect.left - 22;
    //                 let y = -(window.innerHeight - rect.top - 22);
    //                 el.style.display = '';
    //                 el.style.webkitTransform = `translate3d(0,${y}px,0)`;
    //                 el.style.transform = `translate3d(0,${y}px,0)`;
    //                 let inner = el.getElementsByClassName('inner-hook')[0];     //获取到小球
    //                 // console.log(inner)
    //                 inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
    //                 inner.style.transform = `translate3d(${x}px,0,0)`;
    //             }
    //         }
    //     },  
    //     enter: function(el,done) {              //动画开始改变位置  在js中设置动画时间 
    //         let rf = el.offsetHeight;           //触发浏览器重绘        必须重绘
    //         this.$nextTick( function() {

    //             el.style.webkitTransform = 'translate3d(-20px,0,0)';
    //             el.style.transform = 'translate3d(-20px,0,0)';

    //             el.style.transition = "all 0.6s cubic-bezier(0.49,-0.29,0.75,0.41)";

    //             let inner = el.getElementsByClassName('inner-hook')[0];     //获取到小球
    //             inner.style.webkitTransform = 'translate3d(0,0,0)';
    //             inner.style.transform = 'translate3d(0,0,0)';
    //         })
    //         done();
    //     },
    //     afterEenter:function(el) {          //动画结束后消失
    //         let ball = this.dropBalls.shift();
    //         if(ball){
    //             ball.show = false;
    //             el.style.disply = 'none';
    //         }

    //     }
    // }
    //                                                  ---------------https://www.cnblogs.com/yuxingyoucan/p/7063881.html(解决方法的解释)--------------
    methods: {
      drop(el) { 
      //触发一次事件就会将所有小球进行遍历
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) { //将false的小球放到dropBalls
            ball.show = true;
            ball.el = el; //设置小球的el属性为一个dom对象
            this.dropBalls.push(ball); 
            return;
          }
        }
      },

       beforeEnter: function(el) { //这个方法的执行是因为这是一个vue的监听事件
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect(); //获取小球的相对于视口的位移(小球高度)
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22); //负数,因为是从左上角往下的的方向
            el.style.display = ''; //清空display
            el.style.webkitTransform = `translate3d(0,${y}px,0)`; 
            el.style.transform = `translate3d(0,${y}px,0)`;
            //处理内层动画
            let inner = el.getElementsByClassName('inner-hook')[0]; //使用inner-hook类来单纯被js操作
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
      },

      enter: function(el,done) { //这个方法的执行是因为这是一个vue的监听事件
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight; //触发重绘html
        this.$nextTick(() => { //让动画效果异步执行,提高性能
          el.style.webkitTransform = 'translate3d(-20px,0,0)';
          el.style.transform = 'translate3d(-20px,0,0)';
          //处理内层动画
          let inner = el.getElementsByClassName('inner-hook')[0]; //使用inner-hook类来单纯被js操作
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
          el.addEventListener('transitionend', done); //Vue为了知道过渡的完成，必须设置相应的事件监听器。
        });
      },

      afterEenter:function(el) { //这个方法的执行是因为这是一个vue的监听事件
        let ball = this.dropBalls.shift(); //完成一次动画就删除一个dropBalls的小球
        if (ball) {
          ball.show = false;
          el.style.display = 'none'; //隐藏小球
        }
      },
      totaleList(){
          if(!this.totalCount){
              return
          }
          this.fold = !this.fold;
      },
      hideList(){
          this.fold = true
      },
      empty(){
          this.selectFoods.forEach((food)=>{
              food.count = 0;
          })
      },
      pay(){
          if(this.totalPrice<this.minPrice){
              return;
          }
          window.alert(`需要支付${this.totalPrice+this.deliveryPrice}元`)
      }
    },
    components:{
        cartcontrol
    }
}
</script>

<style lang="stylus">
@import '../../common/stylus/mixin';
    .shopcart
        position fixed
        left 0
        bottom 0
        z-index 50
        width 100%
        height 48px
        background-color red
        .content
            display flex
            background-color #141d27
            font-size 0
            .content-left
                flex 1
                .logo-wrapper
                    display inline-block
                    vertical-align top 
                    box-sizing border-box
                    background-color #141d27
                    border-radius 50%
                    position relative
                    top -10px
                    margin 0 12px
                    padding 6px 
                    width 56px
                    height 56px
                    .logo
                        width 100%
                        height 100%
                        border-radius 50%
                        background-color #2b343c
                        text-align center
                        &.highlight
                            background-color rgb(0,160,220)
                            .icon-shopping_cart
                                font-size 24px
                                line-height 44px
                                color #80858a
                                &.highlight
                                    color #fff
                    .num
                        position absolute
                        top 0
                        right 0
                        width 24px
                        height 16px
                        line-height 16px
                        text-align center
                        border-radius 16px
                        font-size 9px
                        font-weight 700
                        color #fff
                        background-color rgb(240,20,20)
                        box-shadow 0 4px 8px 0 rgba(0,0,0,.4)
                .price
                    display inline-block
                    vertical-align top 
                    line-height 24px
                    box-sizing border-box
                    margin-top 12px
                    padding-right 12px
                    border-right 1px solid rgba(255,255,255,.1)
                    font-size 16px
                    font-weight 700
                    color rgba(255,255,255,.4)
                    &.highlight
                        color #fff
                .desc
                    display inline-block
                    vertical-align top 
                    line-height 24px
                    margin 12px 0 0 12px
                    font-size 10px
                    line-height 24px
                    color rgba(255,255,255,.4)

            .content-right
                flex 0 0 105px
                width 105px
                .pay
                    height 48px
                    line-height 48px
                    text-align center
                    font-size 12px
                    color rgba(255,255,255,.4)
                    font-weight 700
                    &.not-enough
                        background-color #2b333b
                    &.enough 
                        background-color #00b43c
                        color #fff
        .ball-container
            &.drop-transition
                transition all 0.4s
            .ball
                position fixed
                left 32px
                bottom 32px
                z-index 40
                transition: all .6s cubic-bezier(0.49, -0.29, 0.75, 0.41)
                .inner
                    width 16px
                    height 16px
                    background-color rgb(0,160,220)
                    border-radius 50%
                    transition all 1s 
        .shopcart-list
            position absolute
            top 0
            left 0
            z-index -1
            width 100%
            transform translate3d(0, -100%, 0) //整个列表相对于当前自身的高度做一个偏移
            &.fold-enter-active, &.fold-leave-active 
                transition: all 0.4s linear 
                transform translate3d(0, -100%, 0) //每个表项相对于当前自身的高度做一个偏移
            &.fold-enter, &.fold-leave-active
                transform translate3d(0, 0, 0)
            .list-header
                height 40px
                line-height 40px
                padding 0 18px
                background #f3f5f7
                border-bottom 1px solid rgba(7, 17, 27, 0.1)
                .title
                    float left
                    font-size 14px
                    color rgb(7,17,27)
                    border none
                .empty
                    float right
                    font-size 12px
                    color rgb(0,160,220)
            .listContent
                padding 0 18px
                max-height 217px
                overflow hidden
                background  #ffffff
                .food
                    position relative
                    padding 12px 0
                    box-sizing border-box
                    border-1px(rgba(7,17,27,0.1))
                    .name
                        line-height 24px
                        font-size 14px
                        color rgb(7,17,27)
                    .price 
                        position absolute
                        right 90px
                        bottom 12px
                        line-height 24px
                        font-size 14px
                        font-weight 700
                        color rgb(240, 20, 20)
                    .cartcontrol-wrapper
                        position absolute
                        right 0
                        bottom 6px
    .list-mask
        position fixed
        top 0
        left 0
        width 100%
        height 100%
        z-index 40
        filter blur(10px)
        background rgba(7,17,27,.6)
        // transform all 0.5s
    .fade-enter-active, .fade-leave-active 
        transition: opacity .4s
    .fade-enter, .fade-leave-active
        transition: opacity .1s   
</style>
