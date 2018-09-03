<template>
    <!--加号减号按钮组件-->
    <div class="cartcontrol">
        <transition name="move" class="move">
            <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart">
                <span class="inner  icon-remove_circle_outline "></span>
            </div>
        </transition>
        <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
        <div class="cart-add icon-add_circle " @click.stop.prevent="addCart" ></div>
    </div>
</template>

<script>
import Vue from 'vue';
export default {
    props:{
        food:{
            type:Object
        }
    },
    created(){
        // console.log(this.food)
    },
    methods:{
        addCart(event){
            // console.log('1')
            if(!event._constructed){
                return;
            }
            // console.log('click')
            if(!this.food.count){                           //设置一个新属性 count
                Vue.set(this.food,'count',1);           //Vue.set直接赋值组件检测不到，要通过Vue.set的方法去改变
                // this.food.count = 1
            }else{
                this.food.count++;
            }
            this.$emit('cartAdd',event.target);        //点击的同时派发一个事件  dom对象作为时间传入
            // console.log(event.target)
        },
        decreaseCart(event){
            if(!event._constructed){
                return;
            }
            if(this.food.count){
                this.food.count--;
            }
        }
    }
}
</script>

<style lang="stylus">
    .cartcontrol
        font-size 0
        .move-enter-active, .move-leave-active
            transition all 0.4s linear
            opacity 1
            transform translate3d(0,0,0)
        .cart-decrease
            display inline-block
            padding 6px
            .inner
                display inline-block
                font-size 24px
                line-height 24px
                color rgb(0,160,220)
                transition all 0.4s linear
                transform rotate(0)
        .move-enter, .move-leave-to
            transition all 0.4s linear
            opacity 0
            transform translate3d(24px,0,0)
            .inner
                transform rotate(180deg)
        .cart-count
            display inline-block
            vertical-align top
            width 12px
            padding-top 6px
            line-height 24px
            text-align center
            font-size 10px
            color rgb(147,153,159)
        .cart-add
            display inline-block
            font-size 24px
            line-height 24px
            padding 6px
            color rgb(0,160,220)
</style>
