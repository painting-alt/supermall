<template>
<div class="cart-list">
  <scroll class="content" ref="scroll">
<!--    组件最好是有绑定key的-->
    <cart-list-item
      v-for="(item,index) in cartList"
      :key="index"
      :item-info="item"/>
  </scroll>
</div>
</template>

<script>
import Scroll from "@/components/common/scroll/Scroll";
import CartListItem from "@/views/cart/childComps/CartListItem";

import {mapGetters} from 'vuex'
export default {
  name: "CartList",
  components:{
    Scroll,
    CartListItem
  },
  computed:{
    ...mapGetters([
      'cartList'
    ])
  },
  activated() {
    this.$refs.scroll.refresh()
  }
}
</script>

<style scoped>
.cart-list {
  height: calc(100% - 44px - 49px - 40px);
}

/*这样做时，父元素是要有确定的高度的，所以我们一般都会给父元素一个100vh的高度*/
.content{
  height: 100%;
}
</style>
