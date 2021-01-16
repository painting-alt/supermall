<template>
<div class="goods">
  <goods-list-item v-for="item in goods" :goods-item="item"/>
</div>
</template>

<script>
import GoodsListItem from "@/components/content/goods/GoodsListItem";

export default {
  name: "GoodsList",
  components:{
    GoodsListItem
  },
  props:{
    goods:{
      type:Array,
      default(){
        return []
      }
    }
  }
}
</script>

<style scoped>
.goods{
  display: flex;
  /*设置为不包裹 则一行可以显示指定的数量*/
  flex-wrap: wrap;
  /*均等分*/
  justify-content: space-around;
}

</style>
