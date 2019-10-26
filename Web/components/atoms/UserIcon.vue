<template>
  <img :src="src" class="icon_img" />
</template>


<script>
export default {
  props: {
    src: {
      type: String,
      require: true
    }
  }
};
</script>


<style scoped>
.icon_img {
  border-radius: 50%;
  width: 104px;
  height: 104px;
  box-shadow: 5px 5px 5px #575758;
  margin: 10px;
}
</style>