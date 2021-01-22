import {debounce} from "@/common/utils";
import BackTop from "@/components/content/backTop/BackTop";
export const itemListenerMixin = {
  data(){
    return {
      itemImgListener: null,
      newRefresh: null
    }
  },
  mounted(){
    this.newRefresh = debounce(this.$refs.scroll.refresh,100)
    this.itemImgListener = () => {
      this.newRefresh()
    }
    this.$bus.$on('itemImgLoad',this.itemImgListener)
    //console.log('我是混入内容');
  }
}

//生命周期函数里面的部分内容可以抽取到mixin中，但是methods里面的函数里面的部分内容不可抽取，否则会进行覆盖
export const backTopMinxin = {
  components:{
    BackTop
  },
  data(){
    return {
      isShowBackTop:false,
    }
  },
  methods: {
    backClick(){
      //console.log('回到顶部');
      this.$refs.scroll.scrollTo(0,0);
    }
  }
}
