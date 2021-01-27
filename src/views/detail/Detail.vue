<template>
<div id="detail">
  <detail-nav-bar
    class="detail-nav"
    @titleClick="titleClick" ref="nav"/>
  <scroll class="content"
          ref="scroll"
          :probe-type="3"
          @scroll="contentScroll" >
    <detail-swiper :top-images="topImages"/>
    <detail-base-info :goods="goods"/>
    <detail-shop-info :shop="shop"/>
    <detail-goods-info :detail-info = "detailInfo" @imageLoad = "imageLoad"/>
    <detail-param-info ref="params" :param-info="paramInfo"/>
    <detail-comment-info ref="comment" :comment-info="commentInfo"/>
    <goods-list ref="recommend" :goods="recommends"/>
  </scroll>
  <detail-bottom-bar @addCart="addToCart"/>
  <back-top @click.native="backClick" v-show="isShowBackTop"/>
<!--  <toast :message="message" :show="show"/>-->
</div>
</template>

<script>
import DetailNavBar from "@/views/detail/childComps/DetailNavBar";
import DetailSwiper from "@/views/detail/childComps/DetailSwiper";
import DetailBaseInfo from "@/views/detail/childComps/DetailBaseInfo";
import DetailShopInfo from "@/views/detail/childComps/DetailShopInfo";
import DetailGoodsInfo from "@/views/detail/childComps/DetailGoodsInfo";
import DetailParamInfo from "@/views/detail/childComps/DetailParamInfo";
import DetailCommentInfo from "@/views/detail/childComps/DetailCommentInfo";
import DetailBottomBar from "@/views/detail/childComps/DetailBottomBar";

import GoodsList from "@/components/content/goods/GoodsList";
// import Toast from "@/components/common/toast/Toast";


import Scroll from "@/components/common/scroll/Scroll";

import {getDetail,Goods,Shop,GoodsParam,getRecommend} from "@/network/detail";
import {debounce} from "@/common/utils";
import {itemListenerMixin,backTopMinxin} from "@/common/mixin";

export default {
  name: "Detail",
  components:{
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    GoodsList,
    Scroll,
    // Toast
  },
  data(){
    return {
      iid: null,
      topImages: [],
      goods:{},
      shop:{},
      detailInfo: {},
      paramInfo:{},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      currentIndex: 0,
     /* message: '',
      show: false*/
    }
  },
  mixins:[itemListenerMixin,backTopMinxin],
  created() {
    //1.保存传入的iid
    this.iid = this.$route.params.iid
    //2.根据iid请求详情数据
    getDetail(this.iid).then(res => {
      //(1)获取数据
      const data = res.result;

      //console.log(res);
      //(2)取出轮播图的数据
      this.topImages = data.itemInfo.topImages

      //(3)获取商品信息
      this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services);

      //(4)创建店铺信息的对象
      this.shop = new Shop(data.shopInfo);

      //(5)保存商品的详细数据
      this.detailInfo = data.detailInfo;

      //(6)获取商品的参数信息
      this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule);

      //(7)去除评论的信息
      if(data.rate.cRate !==0){
        this.commentInfo = data.rate.list[0]
      }


      /*this.$nextTick(() => {
        //根据最新的数据，对应的DOM是已经被渲染出来
        //但是图片依然是没有加载完的，目前获取到offsetTop不包含其中的图片
        this.themeTopYs = []
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      })*/
    })
    //3.请求推荐数据
    getRecommend().then(res => {
      console.log(res);
      this.recommends = res.data.list;
    })
  },
  mounted() {

  },
  methods:{
    imageLoad(){
      //this.$refs.scroll.refresh()
      //混入
      this.newRefresh();

      //点击标题滚动到对应位置
      this.themeTopYs = []
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      this.themeTopYs.push(Number.MAX_VALUE)
      console.log(this.themeTopYs);
    },
    titleClick(index){
      // console.log(index);
      this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],200);
    },
    contentScroll(position){
      //1.获取y值
      const positionY = -position.y
      //2.positionY和主题中值进行对比
      let length = this.themeTopYs.length
      for(let i = 0;i < length - 1;i++){
        if(this.currentIndex !== i &&(positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])){
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex
        }
      }
      //3.判断BackTop是否显示
      this.isShowBackTop = -position.y > 1000
    },
    addToCart(){
      //1.获取购物车需要展示的信息
      const product = {}
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      //iid为商品的唯一标识，也是必须要传的
      product.iid = this.iid;

      //2.将商品添加到购物车里
      //mutations时用commit
      // this.$store.commit('addCart',product)
      // actions时用dispatch
      this.$store.dispatch('addCart',product).then(res => {
       /* this.show = true;
        this.message = res;
        setTimeout(() =>{
          this.show = false;
          this.message = ''
        },1500)
        console.log(res);*/
        this.$toast.show(res,2000)
      })
    }
  },
  destroyed() {
    //2.取消全局事件的监听
    this.$bus.$off('itemImgLoad',this.itemImgListener)
  },
}
</script>

<style scoped>
/*盖住底部导航栏*/
  #detail{
    position: relative;
    z-index: 9;
    /*让父元素为整个视口的高度*/
    height: 100vh;
  }
.detail-nav{
  /*一般相对定位就是来做一些微调和z-index不要随便用绝对定位*/
  position: relative;
  z-index: 9;
  background-color: #ffffff;
}
.content{
  background-color: #ffffff;
  height: calc(100% - 44px - 49px);
}
</style>
