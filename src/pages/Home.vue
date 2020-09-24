<template>
  <q-page class="pageWidth q-pa-md text-white">
    <div class="row q-col-gutter-md q-pt-sm">
      <div class="col-12 col-md-8 col-sm-12">
        <template v-if="loadingPosts">
          <q-card v-for="post in posts" :key="post.id" class="cardBackground border my-card q-mb-md">
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <img src="../assets/me.jpg">
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>danieldhoang <span class="text-grey-8"><span style="font-size:10px"> • </span> {{ post.date | dateFormat }}</span></q-item-label>
                <q-item-label caption>{{ post.location}}</q-item-label>
              </q-item-section>
            </q-item>

            <img :src="post.imageUrl">

            <q-card-section class="q-pt-md">
              <div>
                {{ post.caption }}
              </div>
          </q-card-section>

          </q-card>
        </template>

        <template v-else>
          <q-card flat bordered dark>
            <q-item>
              <q-item-section avatar>
                <q-skeleton type="QAvatar" dark animation="fade" />
              </q-item-section>

              <q-item-section>
                <q-item-label>
                  <q-skeleton type="text" dark animation="fade" />
                </q-item-label>
                <q-item-label caption>
                  <q-skeleton type="text" dark animation="fade" />
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-skeleton height="200px" dark square animation="fade" />

            <q-card-section>
              <q-skeleton type="text" dark class="text-subtitle2" animation="fade" />
              <q-skeleton type="text" dark width="50%" class="text-subtitle2" animation="fade" />
            </q-card-section>
          </q-card>
        </template>
        
      </div>
      <div class="col-4 col-md-4 col-sm-5 largeScreen rightSide">
        <div class="fixed advertisement q-pa-xs cardBackground border">
          Advertisement
          
          <q-carousel
          animated
          v-model="slide"
          infinite
          :autoplay="autoplay"
          @mouseenter="autoplay = false"
          @mouseleave="autoplay = true"
          >
          
            <q-carousel-slide v-for="ad in advertisements" v-bind:key="ad.id" :name="ad.id" class="cardBackground">
              <a :href="ad.link" target="_blank"> 
                <img :src="ad.pic" class="adImage">
            </a>
            </q-carousel-slide>
          </q-carousel>
        </div>
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
      loadingPosts: false,
      advertisements: [
        {
          id:1,
          name: 'World Tutor',
          link: 'http://worldtutor.netlify.app',
          pic: require('../assets/thailand-square.jpg'),
          description: 'Find tutors from other countries to teach you their language, and about their country and culture. The page layout, country information, and tutor information is pulled from a Mongo database.'
        },
        {
          id:2,
          name: 'Plop',
          link: 'http://ddh-plop.netlify.app',
          pic: require('../assets/bathroom-square.jpg'),
          description: 'Looking for the nicest nearby bathroom to use? Find the best place to handle <span class="text-italic">your</span> business. Google Maps APIs are used to locate the user, and all nearby places with their information.'
        },
        {
          id:3,
          name: 'People Swiper',
          link: 'http://please-love-me.netlify.app',
          pic: require('../assets/love-square.jpg'),
          description: 'A dating app where you can swipe through a list of people pulled in from a REST API.'
        },
        {
          id:4,
          name: 'Weather',
          link: 'http://ddh-weather.netlify.app',
          pic: require('../assets/weather-square.jpg'),
          description: 'A simple weather app that shows you the current weather of anywhere you search. Coordinates are passed into an API to retrieve weather data.'
        }
      ],
      slide: 1,
      autoplay: true
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
.advertisement {
  border-radius: 5px;
  width:300px;
}

.adImage {
  width:100%;
  height:99%;
}

.q-item__label--caption {
  color:white;
}

.rightSide {
  width:100%;
}

.q-carousel__slide {
  padding:0;  
}
</style>
