<template>
  <div>
    <file-upload />
  </div>
</template>


<script>
export default {
  components: { FileUpload: () => import("~/components/FileUpload.vue") }
};
</script>

<style>
</style>

