<template>
    <div class="goods">
        <div class="menu-wrapper" ref="menuWrapper">
            <ul>
                <li v-for="(item,index) in goods" :key="index" class="menu-item" :class="{'current':currentIndex===index}" @click="selectMent(index,$event)">
                    <span class="text border-1px">
                        <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>         <!--icon标签-->
                        {{item.name}}
                    </span>
                </li>
            </ul>
        </div>
        <div class="foods-wrapper" ref="foodsWrapper">
            <ul>
                <li v-for="(item,index) in goods" :key="index" class="food-list food-list-hook">
                    <h1 class="title">{{item.name}}</h1>
                    <ul>
                        <li @click="selectFood(food,$event)" v-for="(food,indexs) in item.foods" :key="indexs" class="food-item border-1px">
                            <div class="icon">
                                <img width="57" height="57" :src="food.icon" alt="">
                            </div>
                            <div class="content">
                                <h2 class="name">{{food.name}}</h2>
                                <p class="desc">{{food.description}}</p>
                                <div class="extra">
                                    <span class="conut">月售{{food.sellCount}}份</span>
                                    <span>好评率{{food.rating}}%</span>
                                </div>
                                <div class="price">
                                    <span class="now">￥{{food.price}}</span>        <!--原价-->
                                    <span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>        <!--现价-->
                                </div>
                                <div class="cartcontrol-wrapper">
                                    <cartcontrol :food="food" @cartAdd="cartAdd"></cartcontrol>
                                </div>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <shopcart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
        <food :food="selectedFood" ref="food"></food>
    </div>
</template>

<script>
import BScroll from 'better-scroll';
import shopcart from '../shopcart/shopcart';
import cartcontrol from '../cartcontrol/cartcontrol'
import food from '../food/food'
const ERR_OK = 0;
export default {
    name:"goods",
    props:{
        seller : {
            type:Object
        }
    },
    data(){
        return {
            goods:[],       //存储请求回来的数据
            listHeight:[],  //存储每个li的clientHeight
            scrollY:0,       //用来让高亮跟踪
            selectedFood:{}
        }
    },
    created(){                                                                                          //页面创建时
        this.$http.get('/api/goods').then((response)=>{
            //response是一个属性，将其转化为json对象
            response = response.body;
            if(response.errno ===ERR_OK){
                this.goods = response.data;                                                            //获取每个li块的高度，累加后吧每个值保存到data的数据中去，
                this.$nextTick(function(){                                                //方法     确定dom渲染好了在执行下边方法
                    this._initScroll();         //滚动
                    this._calculateHeight();    //滚动高亮
                })
            }
        }),
        this.classMap = ['decrease','discount','special','invoice','guarantee'];        //创建页面是创建生成个需要用到的icon图片的名字 ：class时绑定选择stylus样式（图片）
    },
    computed:{                                                                          //计算属性
        currentIndex() {
            for(let i=0;i<this.listHeight.length;i++){                                  //遍历高度数组 进行判断当到了最后一个 li 时或者当检测到的scrollY符合height1和height2的情况时 把i的下标返回出去用来给导航绑定class
                let height1 = this.listHeight[i];
                let height2 = this.listHeight[i+1];
                if(!height2 || this.scrollY >= height1 && this.scrollY < height2 ){
                    return i;
                }
            }
            return 0
        },
        selectFoods(){      //通过+ - 组件Vue.set的方法给数据添加count的属性并且传递数据回来，在这里遍历出来单个商品点的次数，在将这个方法传入购物车组件中去让它拿到count的值再续进行页面渲染（Vue.set创建之前是在购物组件内手动return count的数据做模拟）
            let foods = [];
            this.goods.forEach((good)=>{        //全部的商品 goods
                good.foods.forEach((food)=>{    //某类型的全部商品
                    if(food.count){             //判断某个商品有没有被选过
                        foods.push(food);       //选过就把他放进数组
                    }
                })
            })
            return foods;
        }
    },
    methods: {                                                                                      //创建方法的
        _initScroll(){                                                                              //实例better-scroll插件
            this.menuScroll = new BScroll(this.$refs.menuWrapper,{
                click:true
            });                                      //better-scroll的使用方法，拿到父级dom获取他的高度子元素高度超出就滚动

            this.foodScroll = new BScroll(this.$refs.foodsWrapper,{
                click:true,
                probeType : 3             //BScroll滚动时，能实时告诉我们滚动的位置，类似探针的效果                                                           //探针  监测滚动位置       插件参数
            })
            this.foodScroll.on('scroll',(pos) => {                                                  //监听foodScroll的scroll
                this.scrollY = Math.abs(Math.round(pos.y))                                           //pos.y 可能是小数可能是负值
            })
        },
        _calculateHeight() {                                                 
                let foodList =this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');      //原始的方法获得每个list的dom再从中拿到他们的高度放在data的数组中过去做判断
                // console.log(foodList)
                let height = 0;
                this.listHeight.push(height);
                for (let i = 0; i < foodList.length; i++) {
                    let item = foodList[i];                                                         //每个区间 累加 后的高度
                //    console.log(item)
                    height += item.clientHeight;                                                    //clientHeight 网页内容可见高度  scrollHeight网页高度（包括边框线）
                    this.listHeight.push(height)
                }
        },
        selectMent(index,event) {
            if(!event._constructed){
                return;
            }
            // console.log(index)
            let foodList =this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
            let el = foodList[index];                                                               //保存点击的元素
            this.foodScroll.scrollToElement(el,300);                                                //通过batter-scroll的接口去找到对应的位置 可设置滚动时间
        },
        selectFood(food,event){
            if(!event._constructed){
                return;
            }
            this.selectedFood = food;
            this.$refs.food.show();
            // console.log(this.$refs.food.show)
        },
        cartAdd(target) {   
            //优化体验,异步执行下落动画      
            this.$nextTick(()=>{
                this.$refs.shopcart.drop(target);
                // console.log(target)
            })                                                                  //通过$emit传递的参数在对应组件中@cartAdd接收，在创建cartAdd方法去调用完成子组件到父组件的通讯
            
        }
    },
    components:{
        shopcart,
        cartcontrol,
        food
    }
}
</script>

<style lang="stylus" >
@import "../../common/stylus/mixin.styl";
    .goods
        display flex
        position absolute
        top 174px
        bottom 46px
        width 100%
        overflow hidden
        .menu-wrapper
            flex 0 0 80px         //等分 缩放情况 占位
            width 80px
            background-color #f3f5f7
            .menu-item
                display table
                height 54px
                width 56px
                line-height 14px
                padding 0 12px
                text-align center
                &.current
                    position relative
                    margin-top -1px
                    z-index 10
                    background-color red
                    font-weight 700
                    .text
                        border none
                .icon
                    display inline-block
                    vertical-align top
                    width 12px
                    height 12px
                    margin-right 2px
                    background-size 12px 12px
                    background-repeat no-repeat
                    &.decrease
                            bg-image('decrease_3')
                        &.discount
                            bg-image('discount_3')
                        &.guarantee
                            bg-image('guarantee_3')
                        &.invoice
                            bg-image('invoice_3')
                        &.special
                            bg-image('special_3')
                .text
                    display table-cell
                    width 56px
                    vertical-align middle
                    font-size 12px
                    border-1px(rgba(7,17,27,.1))
        .foods-wrapper
            flex 1
            .title
                padding-left 14px
                height 26px
                line-height 26px
                border-left 2px solid #d9dde1
                font-size 12px
                color rgb(147,153,159)
                background-color #f3f5f7
            .food-item
                display flex
                margin 18px
                padding-bottom 18px
                border-1px(rgba(7,17,27,.1))
                &last-child
                    border-none()
                    margin-bottom  0
                .icon
                    flex 0 0 57px
                    margin-right 10px
                .content
                    flex 1
                    .name
                        height 14px
                        font-size 14px
                        line-height 14px
                        margin 2px 0 8px 0
                        color rgb(7,17,27)
                    .desc,.extra
                        line-height 10px
                        font-size 10px
                        color rgb(147,153,159)
                    .desc
                        margin-bottom 8px
                        line-height 12px
                    .extra
                        &.count
                            margin-right 12px
                    .price
                        font-weight 700
                        line-height 24px
                        .now
                            margin-right 18px
                            font-size 14px
                            color rgb(240,20,20)
                        .old
                            text-decoration line-through
                            font-size 10px
                            
                            color rgb(147,153,159)
                    .cartcontrol-wrapper
                        position absolute
                        right 0
                        bottom 12px
</style>
