<template>
  <button class="common_button" @click="$emit('click')">{{ title }}</button>
</template>


<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    }
  }
};
</script>


<style scoped>
.common_button {
  background: #fff100;
  height: 40px;
  font-family: "Oswald", sans-serif;
  appearance: none;
  border-radius: 20px;
  width: 110px;
  text-align: center;
  font-weight: bold;
  border: none;
  font-size: 14px;
  display: block;
}
</style>
