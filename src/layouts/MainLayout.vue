<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar class="pageWidth header">
        <q-toolbar-title class="textMonoton">
          <router-link to="/" class="logoText"><h5 class="glow">レトロ</h5></router-link>
        </q-toolbar-title>
        
        <q-btn to="/camera" flat round dense color="white" icon="party_mode" class="largeScreen"/>
      </q-toolbar>
    </q-header>

    <q-footer elevated class="smallScreen">
      <q-toolbar class="footer cardBackground border">
        <q-toolbar-title>
          <q-tabs
            inline-label
            class="text-grey shadow-2"
            active-color="white"
            indicator-color="transparent"
          >
            <q-route-tab to="/" icon="home"/>
            <q-route-tab to="/Camera" icon="party_mode" />
          </q-tabs>

        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MainLayout',
  data () {
    return {
      leftDrawerOpen: false
    }
  }
}
</script>

<style lang="scss">
.logoText{
  color:white;
}

.q-footer {
  .q-tab__icon {
    font-size:25px;
    justify-content: center;
  }
}

.glow {
    color: #fff;
    -webkit-animation: glow 1s ease-in-out infinite alternate;
    -moz-animation: glow 1s ease-in-out infinite alternate;
    animation: glow 1s ease-in-out infinite alternate;
}
  
@keyframes glow {
  from {
    text-shadow: 0 0 1px #fff, 0 0 2px #fff, 0 0 3px #e60073, 0 0 4px #e60073, 0 0 5px #e60073, 0 0 6px #e60073, 0 0 7px #e60073;
  }

  to {
    text-shadow: 0 0 5px #fff, 0 0 7px #ff4da6, 0 0 7px #ff4da6, 0 0 7px #ff4da6, 0 0 7px #ff4da6, 0 0 7px #ff4da6, 0 0 7px #ff4da6;
  }
}

.q-header {
  background-color:rgb(24, 24, 24);
  border-bottom:1px solid rgb(48, 48, 48);
}

.header {
  height:50px;
}

.footer {
  height:20px;
}
</style>