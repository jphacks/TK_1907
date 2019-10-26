<template>
  <div id="app">
    <section id="detail">
      <div class="wrapper_contents_detail">
        <div class="info_detail">
          <h2 class="title_book_detail">Upload manga files</h2>
          <p class="description_book_detail">Upload your manga files below.</p>
          <div class="wrapper_form_header">
            <input
              class="button_upload_header"
              type="file"
              @change="onFileChange"
              multiple
            />
          </div>
        </div>
      </div>
    </section>

    <section id="archives">
      <ul class="wrapper_contents_archives">
        <li
          class="each_book_archives"
          v-for="(url, index) in uploadedImageURLs"
          :key="index"
        >
          <article class="thumbnail_archives">
            <img :src="url" />
          </article>
        </li>
      </ul>
    </section>
  </div>
</template>


<script>
</script>


<style>
.button_upload_header {
  display: flex;
  justify-content: center;
}
</style>
