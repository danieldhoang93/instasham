<template>
  <q-page class="smallerPageWidth q-pa-md">
    <div class="cameraframe q-pa-md">
      <video
      v-show="!imageTaken"
      ref="video"
      class="full-width"
      autoplay/>
      <canvas
      v-show="imageTaken"
      ref="canvas"
      class="full-width"
      height="240"/>
    </div>
    <div class="text-center">
      <q-btn :disable="imageTaken" flat color="white" icon="camera_alt" @click="takePicture"/>
      <div class="row justify-center q-ma-md">
        <q-input v-model="post.caption" label="Caption" class="col" filled dense></q-input>

        <q-file dark filled dense v-model="uploadImage" label="Upload" accept="image/*" @input="captureImageFallback">
          <template v-slot:append>
            <q-icon name="attach_file" />
          </template>
        </q-file>
      </div>
      <div class="row justify-center q-ma-md">
        <q-input dark v-model="post.location" label="Location" class="col" filled dense :loading="locationLoading">
          <template v-slot:append>
            <q-btn v-if="!locationLoading" dense flat icon="place" @click="getLocation"/>
          </template>
        </q-input>
      </div>

      <div class="row justify-center q-ma-md">
        <q-input dark v-model="post.caption" label="Caption" class="col" filled dense/>
      </div>
      
      <div class="row justify-center q-mt-md">
        <q-btn color="white" label="Post" @click="addPost" :disable="!post.photo" class="text-black"/>
      </div>
    </div>
  </q-page>
</template>

<script>
import { uid } from 'quasar'
import { QSpinnerFacebook } from 'quasar'

require('md-gum-polyfill'); //allows camera to work on older browsers

export default {
  name: 'Camera',
  data() {
    return {
      post: {
        id: uid(),
        caption: '',
        location: '',
        photo: null,
        date: Date.now(),
      },
        imageTaken: false,
        hasCameraSupport: true,
        uploadImage: [],
        locationLoading: false
      
    }
  },
  methods: {
    initCamera () {
      //gets devices camera, just video
      navigator.mediaDevices.getUserMedia({
        video: true
      }).then(stream => {
        this.$refs.video.srcObject = stream
      }).catch(error => {
        this.hasCameraSupport = false;
      })
    },
    takePicture() {
      //get video and canvas refs
      let video = this.$refs.video;
      let canvas = this.$refs.canvas;

      //get location of canvas to put picture there once taken
      canvas.width = video.getBoundingClientRect().width;
      canvas.height = video.getBoundingClientRect().height;

      let context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      this.imageTaken = true;
      
      //convert photo to blob using method
      this.post.photo = this.dataURItoBlob(canvas.toDataURL());

      this.disableCamera();
    },
    captureImageFallback(file) {
      this.post.photo = file;

      let canvas = this.$refs.canvas;
      let context = canvas.getContext('2d');

      var reader = new FileReader();
      reader.onload = event =>{
        var img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img,0,0);
            this.imageTaken = true;
        }
        img.src = event.target.result;
      }
      reader.readAsDataURL(file);     
    },
    disableCamera() {
      //needs work
      this.$refs.video.srcObject.getVideoTracks().forEach(track => {
        track.stop()
      })
    },
    dataURItoBlob(dataURI) {
      // convert base64 to raw binary data held in a string
      // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
      var byteString = atob(dataURI.split(',')[1]);

      // separate out the mime component
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

      // write the bytes of the string to an ArrayBuffer
      var ab = new ArrayBuffer(byteString.length);

      // create a view into the buffer
      var ia = new Uint8Array(ab);

      // set the bytes of the buffer to the correct values
      for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }

      // write the ArrayBuffer to a blob, and you're done
      var blob = new Blob([ab], {type: mimeString});
      return blob;

    },
    getLocation() {
      this.locationLoading = true;
      navigator.geolocation.getCurrentPosition(position => {
        //pass in position object into method to get city and country
        this.getCityAndCountry(position);
      }, error => {
        this.locationError();
      }, {timeout: 7000})
    },
    getCityAndCountry(position) {
      let apiURL = `https://geocode.xyz/${position.coords.latitude},${position.coords.longitude}?json=1`;
      this.$axios.get(apiURL).then(result => {
        console.log(result);
        this.post.location = result.data.city + ", " + result.data.state;
        this.locationLoading = false;
      }).catch(error => {
        console.log(error.message)
      })
    },
    locationError() {
      this.$q.dialog({
        title: 'Error',
        message: 'Could not find location'
      })
      this.locationLoading = false;
    },
    addPost() {
      //show loading screen
      this.$q.loading.show({
        spinner: QSpinnerFacebook,
        spinnerColor: 'yellow',
        spinnerSize: 140,
        backgroundColor: 'purple',
        message: 'Some important process is in progress. Hang on...',
        messageColor: 'black'
      })
      
      //create form data
      let formData = new FormData()
      formData.append('id', this.post.id)
      formData.append('caption', this.post.caption)
      formData.append('location', this.post.location)
      formData.append('date', this.post.date)
      formData.append('file', this.post.photo, this.post.id + 'png')

      //create using api
      this.$axios.post(`${process.env.API}/create`, formData).then
      (response => {
          this.$router.push('/')
          this.$q.notify({
            message: 'Post added',
            //color: 'primary',
            actions: [
              { label: 'Dismiss', color: 'white' }
            ]
          })
        
        }).catch(error => {
          this.$q.dialog({
            title: 'Error',
            message: 'Could not create post'
          })
        })
      
      }
  },
  mounted() {
    this.initCamera();
  },
  beforeDestroy() {
    if (this.hasCameraSupport) {
      this.disableCamera();
    }
  }
}
</script>

<style lang="scss">
.cameraFrame {

}
</style>