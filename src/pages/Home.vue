<template>
  <q-page class="pageWidth q-pa-md">
    <div class="row q-col-gutter-lg q-mt-md">
      <div class="col-12 col-sm-8">
        <template v-if="loadingPosts">
          <q-card v-for="post in posts" :key="post.id" class="my-card q-mb-md">
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <img src="../assets/me.jpg">
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>danieldhoang</q-item-label>
                <q-item-label caption>{{ post.location}}</q-item-label>
              </q-item-section>
            </q-item>

            <img :src="post.imageUrl">

            <q-card-section class="q-pt-md">
              <div class="text-grey q-pb-sm">
                {{ post.date | dateFormat }}
              </div>
              <div>
                {{ post.caption }}
              </div>
          </q-card-section>

          </q-card>
        </template>

        <template v-else>
          <q-card flat bordered>
            <q-item>
              <q-item-section avatar>
                <q-skeleton type="QAvatar" animation="fade" />
              </q-item-section>

              <q-item-section >
                <q-item-label>
                  <q-skeleton type="text" animation="fade" />
                </q-item-label>
                <q-item-label caption>
                  <q-skeleton type="text" animation="fade" />
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-skeleton height="200px" square animation="fade" />

            <q-card-section>
              <q-skeleton type="text" class="text-subtitle2" animation="fade" />
              <q-skeleton type="text" width="50%" class="text-subtitle2" animation="fade" />
            </q-card-section>
          </q-card>
        </template>
        
      </div>
      <div class="col-4 largeScreen">
        <q-item class="fixed">
            <q-item-section avatar>
              <q-avatar>
                <img src="../assets/me.jpg">
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>danieldhoang</q-item-label>
              <q-item-label caption>Me</q-item-label>
            </q-item-section>

          </q-item>
      </div>
    </div>
   
  </q-page>
</template>

<script>
import { date } from 'quasar'
export default {
  data () {
    return {
      lorem: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      posts: [],
      loadingPosts: false
    }
  },
  filters: {
    dateFormat(value) {
      return date.formatDate(value, 'MMM D YYYY h:mm A')
    }
  },
  methods: {
    getPosts() {
      setTimeout(() => {
        this.loadingPosts = true;
        //get response from promise at URL
        this.$axios.get(`${process.env.API}/posts`).then(response => {
          this.posts = response.data;
          
        }).catch(error => {
            this.$q.dialog({
            title: 'Error',
            message: 'Cannot get posts'
          })
        })
      }, 3000);
      this.loadingPosts = false;
    }
  },
  created() {
    this.getPosts();
  }
}
</script>

<style lang="scss">
</style>
