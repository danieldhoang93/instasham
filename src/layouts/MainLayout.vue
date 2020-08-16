<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="pageWidth header">
        <q-toolbar-title class="textMonoton">
          <h3 class="glow">レトロ</h3>
        </q-toolbar-title>
        <div class="q-pr-md">
          <q-btn to="/" flat round dense color="secondary" icon="home" class="largeScreen"/>
        </div>
        
        <q-btn to="/camera" flat round dense color="secondary" icon="party_mode" class="largeScreen"/>
      </q-toolbar>
    </q-header>

    <q-footer elevated class="smallScreen">
      <q-toolbar class="footer">
        <q-toolbar-title>
          <q-tabs
            inline-label
            class="text-white shadow-2"
            active-color="secondary"
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
.q-footer {
  .q-tab__icon {
    font-size:25px;
    justify-content: center;
  }
}

.glow {
    color: #fff;
    text-align: center;
    -webkit-animation: glow 1s ease-in-out infinite alternate;
    -moz-animation: glow 1s ease-in-out infinite alternate;
    animation: glow 1s ease-in-out infinite alternate;
  }
  
  @keyframes glow {
    from {
     text-shadow: 0 0 1px #fff, 0 0 2px #fff, 0 0 3px #e60073, 0 0 40px #e60073, 0 0 50px #e60073, 0 0 60px #e60073, 0 0 70px #e60073;
  }
  
  to {
    text-shadow: 0 0 5px #fff, 0 0 10px #ff4da6, 0 0 15px #ff4da6, 0 0 20px #ff4da6, 0 0 25px #ff4da6, 0 0 30px #ff4da6, 0 0 80px #ff4da6;
  }
}

.header {
  height:75px;
}

.footer {
  height:20px;
}
</style>