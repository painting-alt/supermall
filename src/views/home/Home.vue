<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
        <scroll class="content">
          <home-swiper :banners="banners"/>
          <recommend-view :recommends="recommends"/>
          <feature-view/>
          <tab-control
            class="tab-control"
            :titles="['流行','新款','精选']"
            @tabClick="tabClick"/>
          <goods-list :goods="showGoods"/>
        </scroll>
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

import {
  getHomeMultidata,
  getHomeGoods
} from "@/network/home";


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
    data(){
      return {
        banners:[],
        recommends:[],
        goods:{
          'pop': {page:0,list:[]},
          'new': {page:0,list: []},
          'sell': {page:0,list:[]}
        },
        currentType: 'pop'
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
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9;
}
.tab-control{
  position: sticky;
  top:44px;
  z-index: 9;
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

/*动态计算方法*/
/*.content{
  height: calc(100% - 93px);
  overflow: hidden;
  margin-top: 44px;
}*/
</style>
