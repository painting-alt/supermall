<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control
      :titles="['流行','新款','精选']"
      @tabClick="tabClick"
      ref="tabControl1"
      class="tab-control" v-show="isTabFixed"/>
        <scroll class="content"
                ref="scroll"
                :probe-type="3"
                @scroll="contentScroll" :pull-up-load="true" @pullingup="loadMore">
          <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
          <recommend-view :recommends="recommends"/>
          <feature-view/>
          <tab-control
            :titles="['流行','新款','精选']"
            @tabClick="tabClick"
            ref="tabControl2"/>
          <goods-list :goods="showGoods"/>
        </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
//公共组件
import NavBar from "@/components/common/navbar/NavBar";
import TabControl from "@/components/content/tabControl/TabControl";
import GoodsList from "@/components/content/goods/GoodsList";
import Scroll from "@/components/common/scroll/Scroll";

//子组件
import HomeSwiper from './childComps/HomeSwiper'
import RecommendView from "@/views/home/childComps/RecommendView";
import FeatureView from "@/views/home/childComps/FeatureView";

import {itemListenerMixin,backTopMinxin} from "@/common/mixin";

import {
  getHomeMultidata,
  getHomeGoods
} from "@/network/home";
import {debounce} from "common/utils";

export default {
    name: "Home",
    components:{
      NavBar,
      TabControl,
      GoodsList,
      Scroll,
      HomeSwiper,
      RecommendView,
      FeatureView,
    },
  mixins:[itemListenerMixin,backTopMinxin],
    data(){
      return {
        banners:[],
        recommends:[],
        goods:{
          'pop': {page:0,list:[]},
          'new': {page:0,list: []},
          'sell': {page:0,list:[]}
        },
        currentType: 'pop',
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0
      }
    },
    computed:{
      showGoods(){
        return this.goods[this.currentType].list
      }
    },
    created() {
      //1.请求多个数据
      this.getHomeMultidata()

      //2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
    },
    //这里用了混入 所以不需要了
    mounted() {
      /*//1.监听item中图片加载完成
      const refresh = debounce(this.$refs.scroll.refresh,200)
      //对监听的事件进行保存
      this.itemImgListener = () => {
        refresh()
      }
      this.$bus.$on('itemImageLoad',this.itemImgListener)*/
    },
  activated() {
    this.$refs.scroll.scrollTo(0,this.saveY,0)
    this.$refs.scroll.refresh()
  },
  deactivated() {
    //1.保存Y值
    this.saveY = this.$refs.scroll.getScrollY()
    //2.取消全局事件的监听
    this.$bus.$off('itemImgLoad',this.itemImgListener)
  },
  methods:{
      //事件监听相关的方法
      tabClick(index){
        switch (index){
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },
   /*   backClick(){
        //console.log('回到顶部');
        //第三个参数传一个毫秒数
        //this.$refs.scroll先拿到scroll组件
        // this.$refs.scroll.scroll再拿到scroll对象
        //this.$refs.scroll.scroll.scrollTo()再去调用scrollTo这个方法
        //this.$refs.scroll.scroll.scrollTo(0,0,500);
        this.$refs.scroll.scrollTo(0,0);
      },*/
      contentScroll(position){
        // console.log(position);
        //1.判断BackTop是否显示
        this.isShowBackTop = -position.y > 1000
      //  2.决定tabControl是否吸顶(position: fixed)
        this.isTabFixed = (-position.y) > this.tabOffsetTop

      },
      loadMore(){
        //console.log('上拉加载更多');
        this.getHomeGoods(this.currentType)
      },
      swiperImageLoad(){
        //2.获取tabControl的offsetTop
        //所有的组件都有一个属性$el:用于获取组件中的元素
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
      },

      //网络请求相关的方法
      getHomeMultidata(){
        getHomeMultidata().then(res => {
          //this.result = res;
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        })
      },
      getHomeGoods(type){
        const page = this.goods[type].page + 1;
        getHomeGoods(type,page).then(res =>{
          this.goods[type].list.push(...res.data.list);
          this.goods[type].page += 1
          this.$refs.scroll.finishPullUp();
        })
      }
    }
  }
</script>
<!--scoped:作用域-->
<style scoped>
#home{
  position: relative;
  /*vh:视口 100vh相当于100%的高度*/
  height: 100vh;
}
.home-nav{
  background-color: var(--color-tint);
  color: #ffffff;

 /* 在使用浏览器原生滚动时，为了让导航不跟随一起滚动*/
 /* position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9;*/
}

/*使用定位*/
.content{
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}
.tab-control{
  position: relative;
  z-index: 9;
}
/*动态计算方法*/
/*.content{
  height: calc(100% - 93px);
  overflow: hidden;
  margin-top: 44px;
}*/
</style>
