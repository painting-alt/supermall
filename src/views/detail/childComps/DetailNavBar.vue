<template>
<div>
  <nav-bar><div slot="center">详情页</div></nav-bar>
</div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar";
export default {
  name: "DetailNavBar",
  components: {
    NavBar
  },
  data(){
    return{
      titles: ['商品','参数','评论','推荐']
    }
  }
}
</script>

<style scoped>

</style>
