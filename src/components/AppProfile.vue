<!--
- src/components/AppProfile.vue
-
- Information about the user. Possibility to sign out.
- Only visible when signed in.
-
- NOTE: It would be so nice if Vue had built-in Promise support, like Svelte 3's '{await}'.
-
- References:
-   - TylerPottsDev / vue-dropdown (GitHub) -> https://github.com/TylerPottsDev/vue-dropdown
-     - adapted dropdown menu approach
-->
<template>
  <!-- #Snip: Using 'nav' like 'App.vue' uses 'header' etc. (either embrace this HTML5 or just remove them as unneeded)
  -->
  <!-- Using 'nav' simply as the container. '#user-name' holds the top menu, '.sub-menu' the sub-menu (it could be an id).
  -->
  <nav class="app-profile fixed-top-right">
    <div id="user-name" @click.stop="toggleMenu">
      {{ user ? user.displayName : '...' }}
      <!-- tbd. Bring in Font Awesome, at some point?
      <font-awesome-icon :icon="appIcon" />
      -->
      <!-- triangle -->
      <svg viewBox="0 0 1030 638" width="10">
        <path d="M1017 68L541 626q-11 12-26 12t-26-12L13 68Q-3 49 6 24.5T39 0h952q24 0 33 24.5t-7 43.5z" />
      </svg>
    </div>

    <transition name="fade" appear>
      <div v-if="isOpen" class="sub-menu">
        <div v-for="(item, i) in items" :key="i" class="menu-item">
          <template v-if="item.to === signOut">
            <a href="#" @click="signOut">{{ item.title }}</a>
          </template>
          <template v-else>
            <a :href="item.to">{{ item.title }}</a>
          </template>
        </div>
      </div>
    </transition>
  </nav>
</template>

<style scoped>
  /* Vue Note: CSS within Vue single-file-component declaration doesn't seem to allow inner objects, so there's some
  *       repetition.
  */
  .app-profile {
    display: flex;

    padding: 10px;

    background-color: #222;
    color: #ddd;
    /*border-radius: 0px 0px 0 16px;*/    /*uncomment to curve the lower left corner*/
  }

  .app-profile svg {
    width: 10px;
    margin-left: 10px;
  }

  .app-profile svg path {
    fill: #888;
  }

  .menu-item {
    padding: 10px 20px;
    position: relative;
    text-align: center;
    border-bottom: 3px solid transparent;
    display: flex;
    transition: 0.2s;
  }

  .user-name,
  .menu-item {
    border-bottom: 3px solid transparent;   /* underlining when hovered on */
  }
  .user-name:hover,
  .menu-item:hover {
    background-color: #444 !important;
    border-bottom-color: #FF5858 !important;
  }

  .sub-menu {
    background-color: #222;
  }
  .sub-menu a {
    color: inherit;
    text-decoration: none;
  }

  .app-profile .sub-menu {
    position: absolute;
    background-color: #222;
    top: calc(100% + 3px);
    /*left: 50%;*/
    right: 10px;
    /*transform: translateX(-50%);*/
    width: max-content;
    /*border-radius: 0px 0px 16px 16px;*/
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: all .2s ease-out;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  .fixed-top-right {
    position: fixed;
    top: 0;
    right: 0;
  }
</style>

<script>
  // We expect the user to be signed in and not to change, during our lifespan (there's no UI option to change the user).

  import { signOut as authSignOut } from '../util/auth.js';
  import { userMixin } from '../mixins/user.js';

  export default {
    name: 'AppProfile',
    mixins: [userMixin],
    data() {
      return {
        isOpen: false,

        items: [    // read-only constant   (tbd. is there a better way, in Vue 2? #help)
          { title: "Sign out", to: this.signOut }
        ]
      }
    },
    mounted() {
      const vm = this;

      // If taps/clicks are found at the body level, close the menu. This relies on rest of the app letting such clicks
      // flow through.
      //
      // Note: Removing the listener would be nice (as a sample), but not really crucial since there's one menu,
      //    throughout the app's life span. #help
      //
      document.addEventListener("click", (ev) => {
        vm.isOpen = false;
      }, {
        passive: true   // we never will 'preventDefault()' (helps browser optimize)
      })
    },
    methods: {
      signOut() {
        // Note: We need to fly directly to sign-in page (not e.g. '/'). Pushing like this seems to bypass route guards.
        //
        authSignOut().then( () => {
          this.$router.push('/signin');
        });
      },
      toggleMenu() {
        this.isOpen = !this.isOpen;
      }
    }
  };
</script>
