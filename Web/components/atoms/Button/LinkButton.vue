<template>
  <nuxt-link
    :to="to"
    class="link_button"
    @click.prevent="$emit('click-prevent')"
    >{{ title }}</nuxt-link
  >
</template>


<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    to: {
      type: String,
      required: true
    }
  }
};
</script>


<style scoped>
.link_button {
  appearance: none;
  background: #fff100;
  border: none;
  border-radius: 20px;
  font-family: "Oswald", sans-serif;
  font-size: 18px;
  font-weight: bold;
  height: 40px;
  line-height: 1;
  margin-left: 10px;
  padding: 10px;
  text-align: center;
  width: 110px;
}
</style>
