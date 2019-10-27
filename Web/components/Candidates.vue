<template>
  <div id="acounts">
    <ul class="wrapper_contents_acounts">
      <li
        v-for="(candidate, index) in candidates"
        :key="index"
        class="each_user_acounts"
      >
        <article class="user_icon_acounts">
          <span class="user_name_acounts">{{ candidate.name }}</span>
          <UserIcon :src="candidate.photo" />
          <span class="user_name_acounts"> 得票数 {{ candidate.acquiredVotes }}</span>
          <Button @click="$emit('vote', candidate.address)" title="投票する" />
        </article>
      </li>
    </ul>
  </div>
</template>


<script>
export default {
  components: {
    UserIcon: () => import("~/components/atoms/UserIcon.vue"),
    Button: () => import("~/components/atoms/Button")
  },
  props: {
    candidates: {
      type: Array,
      required: true
    }
  }
};
</script>


<style scoped>
#acounts {
  padding: 100px 0;
  width: 100vw;
  overflow-x: scroll;
}
#acounts .wrapper_contents_acounts {
  min-width: 800px;
  padding: 0;
  margin: 0 150px;
  height: 100%;
  display: flex;
  justify-content: space-between;
}
.each_user_acounts {
  height: 100%;
  width: 200px;
  margin: 0 0 30px;
}
.user_icon_acounts {
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.user_name_acounts {
  text-align: center;
}
</style>
