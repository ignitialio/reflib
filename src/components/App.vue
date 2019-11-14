<template>
  <v-app class="app-layout"
    :class="{ 'login': $router.currentRoute.name === 'Sign in' }"
    :dark="$store.state.ui.darkTheme">

    <div>
      <v-app-bar dense dark
        :flat="$store.state.ui.flatToolbar"
        :color="$store.state.ui.toolbarColor ">

        <v-app-bar-nav-icon v-if="$router.currentRoute.name !== 'Sign in'"
          @click="leftSidenav = !leftSidenav">
          <img class="app-logo" src="assets/reflib-32.png"/>
        </v-app-bar-nav-icon>

        <v-toolbar-title v-if="$router.currentRoute.name !== 'Sign in'"
          class="app-title">
          {{ $t($router.currentRoute.name) }}</v-toolbar-title>

        <div  v-if="$router.currentRoute.name !== 'Sign in'"
          class="app-divider"></div>

        <div  v-if="$router.currentRoute.name !== 'Sign in'"
          class="app-ctx flex-grow-1">
          <!-- Show where we are - app section -->
          <component v-if="contextComponent" :is="contextComponent"></component>
        </div>

        <!--<div v-if="!user" style="width: 100%" class="ig-centered">
          <img v-show="connected" class="app-logo" src="assets/reflib-32.png"/>

          <v-progress-circular v-show="!offline && !connected"
            indeterminate :size="20" :width="1" color="primary">
          </v-progress-circular>

          <v-icon v-show="offline && !connected"
            color="red">cloud_off</v-icon>
        </div>-->

        <div v-if="user" class="ig-clickable app-avatar-small"
          @click="showNotifications = !showNotifications">
          <v-badge overlap color="rgba(205, 133, 63, 0.8)">
            <span slot="badge" v-if="userNotifications.length > 0">
              {{ userNotifications ? userNotifications.length : 0 }}</span>

            <v-avatar :size="32" style="border: 1px solid slategrey!important;">
              <img :src="user ? $utils.fileUrl(user.picture.thumbnail) :
                'assets/user.png'" alt=""/>
            </v-avatar>
         </v-badge>
        </div>

        <div v-if="!user && $router.currentRoute.name !== 'Sign in'">
          <v-btn icon color="green" @click.stop="$router.push('/login')">
            <v-icon>open_in_browser</v-icon>
          </v-btn>
        </div>

        <v-progress-circular v-show="!offline && !connected && user"
          indeterminate :size="20" :width="1" color="primary">
        </v-progress-circular>

        <v-icon v-show="offline && !connected && user"
          color="red">cloud_off</v-icon>
      </v-app-bar>
    </div>

    <v-navigation-drawer app dark
      :mini-variant.sync="mini"
      temporary
      ref="leftSideNav" v-model="leftSidenav">

      <v-list-item>
        <v-list-item-avatar>
          <v-img v-if="user" :src="user && user.picture && user.picture.thumbnail ?
            $utils.fileUrl(user.picture.thumbnail) :
            'assets/user.png'" alt=""></v-img>
          <v-img v-if="!user" class="app-logo" src="assets/reflib-32.png"></v-img>
        </v-list-item-avatar>

        <v-list-item-title
          @click="$router.push('/profile')">
          <span v-if="user">{{ $t(user.name.first + ' ' + user.name.last) }}</span>
          <v-icon v-if="user && user.role === 'admin'" color="orange">star_border</v-icon>
        </v-list-item-title>

        <v-btn icon @click.stop="mini = !mini">
          <v-icon>chevron_left</v-icon>
        </v-btn>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <template v-for="(item, index) in $store.state.menuItems">
          <div style="display: none" :key="index">{{ index }}</div> <!-- lint -->
          <v-divider v-if="item.divider && (item.anonymousAccess || !!user)"
            :inset="item.inset" :key="item.inset"></v-divider>
          <v-subheader
            v-if="!mini && item && item.header && (item.anonymousAccess || !!user)"
            :key="item.header">
            {{ $t(item.header) }}</v-subheader>
          <v-list-item :key="item.title"
            v-if="(item.title && !item.hidden && (!!user && !item.hideIfLogged))
              || (item.anonymousAccess && item.title && !item.hidden && !user)"
            @click="item.event ? $services.emit(item.event) :
              $router.push({ path: item.route.path, query: item.route.query })">
              <v-list-item-action class="app-menu-item-icon">
                <v-icon v-if="!item.svgIcon">{{ item.icon }}</v-icon>
                <img v-if="item.svgIcon" class="ig-menu-icon" :src="item.svgIcon" alt=""/>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title
                  :class="{ 'app-menu-item-selected':
                    $store.state.route.path === item.path }">
                  {{ $t(item.title) }}</v-list-item-title>
              </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>

      <v-list v-if="!mini" dense>
        <v-divider></v-divider>
        <v-subheader>{{ $t('Version') }}</v-subheader>

        <v-list-item v-if="packageInfo" @click="navTo('/admin')">
          <v-list-item-action>
            <img style="width: 24px; height: 24px;"
              src="assets/reflib-32.png" alt=""/>
          </v-list-item-action>
          <v-list-item-content>
            {{ packageInfo.name }} v{{ packageInfo.version }}
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-content class="app-view">
      <transition name="fade">
        <router-view class="app-router"></router-view>
      </transition>

      <v-snackbar v-model="notificationSnack"
        :timeout="5000">
        {{ notification }}
      </v-snackbar>

      <!-- Confirm dialog -->
      <v-dialog v-model="confirmDialog" max-width="500px"
        @close="handleConfirmClose">
        <v-card>
          <v-card-title>
            <div v-if="confirmationPrompt !== null">
              {{ confirmationPrompt }}
            </div>
          </v-card-title>

          <v-card-text>
          </v-card-text>

          <v-card-actions>
            <v-btn color="primary" flat
              @click="handleConfirm('ok')">
              {{ $t('Apply') }}
            </v-btn>

            <v-btn color="error" flat
              @click="handleConfirm('cancel')">
              {{ $t('Cancel') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-bottom-sheet v-model="showNotifications">
        <v-list>
          <v-subheader>{{ $t('Notifications') }}</v-subheader>
          <v-list-item
            v-for="notification in userNotifications" :key="notification._id"
            @click="ackNotification(notification)">

            <v-list-item-avatar>
              <img :src="notification.image" alt=""/>
            </v-list-item-avatar>

            <v-list-item-title>
              <span>{{ notification.message }}</span>
              <span class="app-notification-date">
                {{ $utils.fromNow(notification._lastModified) }}</span>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-bottom-sheet>
    </v-content>
  </v-app>
</template>

<script>
import findIndex from 'lodash/findIndex'
import map from 'lodash/map'
import sortBy from 'lodash/sortBy'

import LoginView from '../views/LoginView.vue'
import MainView from '../views/MainView.vue'
import ServicesView from '../views/ServicesView.vue'
import AccessControlView from '../views/AccessControlView.vue'
import ListView from '../views/ListView.vue'
import ItemView from '../views/ItemView.vue'

import ListContextBar from '../views/context/ListContextBar.vue'
import ItemContextBar from '../views/context/ItemContextBar.vue'

export default {
  data: () => {
    return {
      mini: true,
      showMenu: false,
      showProgressBar: false,
      notification: null,
      contextComponent: null,
      progress: 50,
      userNotifications: [],
      lastNotification: null,
      showNotifications: false,
      packageInfo: {},
      dataInfo: {},
      leftSidenav: false,
      notificationSnack: false,
      confirmDialog: false,
      confirmationPrompt: null
    }
  },
  computed: {
    offline() {
      return this.$config.offline ? this.$config.offline.activated : false
    },
    user() {
      return this.$store.state.user
    },
    connected() {
      return this.$store.state.connected
    }
  },
  components: {
    'list-ctx': ListContextBar,
    'item-ctx': ItemContextBar
  },
  methods: {
    /*
      Shows Snack (app) notification (used from any where with this.$root)
    */
    showAppNotification(msg) {
      this.notification = msg
      this.notificationSnack = true
    },
    handleConfirmClose() {
      this.$services.emit('app:confirmation:response', 'cancel')
    },
    handleConfirm(what) {
      if (this.confirmDialog) {
        this.confirmDialog = false

        this.$services.emit('app:confirmation:response', what)
      }
    },
    handleMenuItemsAdd(items) {
      let routes = []
      let menuItems = this.$store.state.menuItems

      for (let item of items) {
        let idx = findIndex(menuItems, e => e.title === item.title)

        if (idx === -1) {
          item.selected = false
          if (item.index === undefined) {
            let indexes = map(menuItems, e => e.index)
            let maxIndex = Math.max(...indexes)
            item.index = maxIndex + 1
          }

          menuItems.push(item)

          if (item.route) {
            if (!item.anonymousAccess) {
              item.route.beforeEnter = (to, from, next) => {
                let token = localStorage.getItem('token')

                if (token && token !== null) {
                  next()
                } else {
                  next({ path: '/login' })
                }
              }
            }

            routes.push(item.route)
          }
        }
      }

      menuItems = sortBy(menuItems, 'index')
      this.$store.commit('menuItems', menuItems)

      if (routes.length > 0) {
        this.$router.addRoutes(routes)
        // console.log('routes added', map(routes, e => e.path))
      }
    },
    handleMenuItemsRemove(items) {
      let menuItems = this.$store.state.menuItems

      for (let item of items) {
        let idx = findIndex(menuItems, e => e.path === item.path)

        if (idx) {
          menuItems.splice(idx, 1)
        }
      }

      this.$store.commit('menuItems', menuItems)
    },
    handleNotification(data) {
      console.log('notification', data)
    },
    checkIfAdminRole() {
      this.$utils.waitForProperty(this.$store.state, 'user').then(user => {
        this.$services.waitForService(this.$config.auth.service).then(auth => {
          auth.role(user.login.username).then(role => {
            user.role = role
            this.$store.commit('user', user)
          }).catch(err => console.log('failed to get user\'s role', err))
        }).catch(err => console.log('auth service not available', err))
      }).catch(err => console.log('not connected user', err))
    }
  },
  mounted() {
    // set RPC timeout client side in accordance with config file
    this.$services.rpcTimeout = this.$config.unified.settings.rpcTimeout

    console.log('rpc timeout= ', this.$services.rpcTimeout)
    
    // reset menu
    this.$store.commit('menuItems', [])

    // menu items registering
    this.$services.on('app:menu:add', this.handleMenuItemsAdd)
    this.$services.on('app:menu:remove', this.handleMenuItemsRemove)

    // base menu
    this.$services.emit('app:menu:add', [
      {
        index: 0,
        title: 'Dashboard',
        icon: 'dashboard',
        anonymousAccess: true,
        route: {
          name: 'Dashboard',
          path: '/',
          component: MainView
        },
        selected: false
      },
      {
        index: 1,
        title: 'Users',
        icon: 'supervisor_account',
        anonymousAccess: true,
        route: {
          name: 'Users',
          path: '/users',
          component: ListView,
          query: {
            collection: 'users'
          }
        },
        selected: false
      },
      {
        index: 2,
        divider: true,
        anonymousAccess: false,
        /* Test section */
        header: 'Test'
      },
      {
        index: 3,
        /* List route, no menu */
        title: 'List view',
        icon: 'list',
        hidden: true, /* do not show it in the menu */
        anonymousAccess: false,
        route: {
          path: '/list',
          component: ListView
        },
        selected: false
      },
      {
        index: 4,
        /* Item route, no menu */
        title: 'Item view',
        icon: 'view_column',
        hidden: true, /* do not show it in the menu */
        anonymousAccess: false,
        route: {
          path: '/item',
          component: ItemView
        },
        selected: false
      },
      {
        index: 5,
        title: 'My items test',
        icon: 'explore',
        anonymousAccess: false,
        route: {
          name: 'My items',
          path: '/myitems',
          component: ListView,
          query: {
            collection: 'myitems'
          }
        },
        selected: false
      },
      {
        index: 6,
        title: 'Services',
        icon: 'view_module',
        anonymousAccess: false,
        route: {
          name: 'Services',
          path: '/services',
          component: ServicesView
        },
        selected: false
      },
      {
        index: 7,
        title: 'Access control',
        icon: 'explore',
        anonymousAccess: false,
        route: {
          name: 'Access control',
          path: '/accesscontrol',
          component: AccessControlView
        },
        selected: false
      },
      {
        index: 20,
        /* Test section */
        header: 'User management'
      },
      {
        index: 100,
        title: 'Sign out',
        icon: 'lock_open',
        anonymousAccess: false,
        event: 'app:signout',
        selected: false
      },
      {
        index: 101,
        title: 'Sign in',
        icon: 'open_in_browser',
        anonymousAccess: true,
        hideIfLogged: true,
        route: {
          name: 'Sign in',
          path: '/login',
          component: LoginView
        },
        selected: false
      },
      {
        index: 102,
        title: 'Sign up',
        icon: 'person_pin',
        anonymousAccess: true,
        hideIfLogged: true,
        route: {
          name: 'Sign up',
          path: '/signup',
          component: LoginView
        },
        selected: false
      }
    ])

    // update router with redirection
    this.$router.addRoutes([
      {
        path: '*',
        redirect: '/'
      }
    ])

    // app sign in event
    this.$services.on('app:signin', info => {
      console.log(info)
      this.$store.commit('user', info.user)
      localStorage.setItem('token', info.token)
      // determine if admin role when login
      this.checkIfAdminRole()

      this.$router.push('/')
    })

    // app sign out event
    this.$services.on('app:signout', () => {
      this.$ws.resetLocalCredentials()
    })

    this.$ws.socket.on('service:event:dlake:notifications:add',
      this.handleNotification)

    // determine if admin role when authentication without login
    this.checkIfAdminRole()

    // context bar management
    this.$services.on('app:context:bar', ctxComponent => {
      // use null to disable
      this.contextComponent = ctxComponent
    })

    // application notifications
    this.$services.on('app:notification', message => {
      this.notification = message
      this.notificationSnack = true
    })

    // progress bar events
    this.$services.on('app:progress:show', show => {
      this.showProgressBar = show
      this.$forceUpdate()
      console.log('SHOW', show)
    })

    this.$services.on('app:progress', val => {
      this.progress = val
    })

    this.$modules.waitForModule('utils').then(utils => {
      utils.appInfo().then(packageJson => {
        this.packageInfo = packageJson
      }).catch(err => console.log('failed to get app info', err))
    }).catch(err => console.log('utils service module not available', err))

    if (this.$store.state.user) {
      this.$db.collection('users').then(users => {
        this.$utils.waitForProperty(this.$store.state, 'user').then(async () => {
          let nu = await users.dGet({ 'login.username': this.$store.state.user.username })
          this.$store.commit('user', nu)
          // BUG: persisted state b*ing -> no more persisted state: to be tested
          /* setTimeout(() => {
            this.$store.commit('user', nu)
          }, 1000) */
        })
      }).catch(err => console.log(err))
    }
  }
}
</script>

<style scoped>
.app-layout {
  background: white!important;
}

.app-layout.login {
  background-image: url(~/assets/bk_aerial.jpg)!important;
  background-size: cover!important;
  background-position: center!important;
  background-repeat: no-repeat!important;
}

.app-view {
  height: 100vh!important;
}

.app-ctx {
  height: calc(100% - 0px);
  overflow: hidden;
}

.app-title {
  user-select: none;
  color: dimgray;
}

.app-divider {
  height: 32px;
  border-left: 1px solid gainsboro;
  margin: 0 32px;
}

.app-router {
  top: 48px;
  height: calc(100% - 48px);
}

.app-avatar-small {
  margin-left: 8px;
}

@media screen and (max-width: 800px) {

}
</style>
