<template>
  <section id="archives">
    <ul class="wrapper_contents_archives">
      <li class="each_book_archives" v-for="(comic, index) in comics" :key="index">
        <Card class="card" :to="/comics/+comic.id">
          <img :src="comic.thumbnail" />
        </Card>
      </li>
    </ul>
  </section>
</template>


<script>
export default {
  props: {
    comics: {
      type: Array,
      require: true
    }
  },
  methods: {
    goDetail(id) {
      this.$router.push("/comics/" + id);
    }
  }
};
</script>


<style scoped>
/* #archives {
  padding: 100px 0vw;
  width: 100vw;
  overflow-x: scroll;
} */
/* #archives .wrapper_contents_archives {
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
  justify-content: space-between;
  min-width: 800px;
  padding: 0;
  margin: 0 5vw;
  
  justify-content: center;
  align-content: space-between;
  margin: 0 5vw;
  display: flex;
  flex-wrap: wrap;
}
#archives .each_book_archives {
  width: 44%;
  padding: 20px;
  overflow: hidden;
  margin-bottom: 45px;
  border-radius: 4px;
  letter-spacing: normal;
  vertical-align: top;
  margin-right: 2.5vw;
  margin-left: 2.5vw;
  width: 100%;
  margin-bottom: 45px;
  padding-right: 1.25vw;
  padding-left: 1.25vw;
  width: 15vw;
}

#archives .card {
  width: 12.5vw;
  align-self: stretch;
} */

#archives .thumbnail_archives {
  box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.2);
  background-color: #f5f5f5;
}
#archives .thumbnail_archives > div > img {
  display: block;
  width: 100%;
  height: 100%;
}

@media screen and (max-width: 639px) {
  #archives {
    padding: 5vh 0vw;
    width: 100vw;
    overflow-x: scroll;
  }
  #archives .wrapper_contents_archives {
    justify-content: center;
    align-content: space-between;
    display: flex;
    flex-wrap: wrap;
  }
  #archives .each_book_archives {
    margin-bottom: 45px;
    padding-right: 2.5vw;
    padding-left: 2.5vw;
    width: 50vw;
  }

  #archives .card {
    width: 45vw;
    align-self: stretch;
  }
}

@media only screen and (min-width: 640px) and (max-width: 1023px) {
  #archives {
    padding: 100px 0vw;
    width: 100vw;
    overflow-x: scroll;
  }
  #archives .wrapper_contents_archives {
    justify-content: center;
    align-content: space-between;
    display: flex;
    flex-wrap: wrap;
  }
  #archives .each_book_archives {
    margin-bottom: 45px;
    padding-right: 2.5vw;
    padding-left: 2.5vw;
    width: 50vw;
  }

  #archives .card {
    width: 45vw;
    align-self: stretch;
  }
}

@media screen and (min-width: 1024px) {
  #archives {
    padding: 100px 0vw;
    width: 100vw;
    overflow-x: scroll;
  }
  #archives .wrapper_contents_archives {
    justify-content: center;
    align-content: space-between;
    margin: 0 5vw;
    display: flex;
    flex-wrap: wrap;
  }
  #archives .each_book_archives {
    margin-bottom: 45px;
    padding-right: 1.25vw;
    padding-left: 1.25vw;
    width: 15vw;
  }

  #archives .card {
    width: 12.5vw;
    align-self: stretch;
  }
}
</style>
