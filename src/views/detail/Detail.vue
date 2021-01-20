<template>
<div id="detail">
  <detail-nav-bar class="detail-nav"/>
  <scroll class="content" ref="scroll">
    <detail-swiper :top-images="topImages"/>
    <detail-base-info :goods="goods"/>
    <detail-shop-info :shop="shop"/>
    <detail-goods-info :detail-info = "detailInfo" @imageLoad = "imageLoad"/>
    <detail-param-info :param-info="paramInfo"/>
    <detail-comment-info :comment-info="commentInfo"/>
    <goods-list :goods="recommends"/>
  </scroll>
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

import GoodsList from "@/components/content/goods/GoodsList";

import Scroll from "@/components/common/scroll/Scroll";

import {getDetail,Goods,Shop,GoodsParam,getRecommend} from "@/network/detail";
import {debounce} from "@/common/utils";
import {itemListenerMixin} from "@/common/mixin";

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
    GoodsList,
    Scroll
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
    }
  },
  mixins:[itemListenerMixin],
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
      this.$refs.scroll.refresh()
    }
  },
  destroyed() {
    //2.取消全局事件的监听
    this.$bus.$off('itemImgLoad',this.itemImgListener)
  }
}
</script>

<style scoped>
/*盖住底部导航栏*/
  #detail{
    position: relative;
    z-index: 9;
    background-color: #ffffff;
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
  height: calc(100% - 44px);
}
</style>
