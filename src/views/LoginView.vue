<template>
  <div class="login-layout">
    <v-card hover dark class="login-card">
      <v-card-title class="login-header">
        <v-avatar v-if="user" :size="32"
          style="border: 1px solid slategrey!important;">
          <v-img :src="user && user.picture && user.picture.thumbnail ?
            $utils.fileUrl(user.picture.thumbnail) :
            'assets/user.png'" alt=""></v-img>
        </v-avatar>

        <img v-if="!user" class="app-logo" src="assets/reflib-32.png"/>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <form @submit.stop.prevent="handleSubmit">
          <v-text-field dark :label="$t('Username')" v-model="username" required>
          </v-text-field>

          <v-text-field
            :append-icon="e1 ? 'visibility' : 'visibility_off'"
            @click:append="tooglePasswordVisibility"
            :type="e1 ? 'password' : 'text'"
            :label="$t('Password')" v-model="password"
            required>
          </v-text-field>

          <div class="login-actions">
            <v-btn type="submit" text color="green"
              v-bind:disabled="!valid">
              {{ $t('Sign in')}}
            </v-btn>
          </div>
        </form>
      </v-card-text>

      <v-divider></v-divider>
      <v-card-actions>
        <v-btn text color="orange">
          {{ $t('Sign up')}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      e1: true,
      user: null
    }
  },
  watch: {
    username: function(val) {
      this.$db.collection('users').then(users => {
        users.dGet({ 'login.username': this.username }).then(user => {
          this.user = user
          // console.log(global.$j(user))
        }).catch(err => console.log(err))
      }).catch(err => console.log(err))
    }
  },
  computed: {
    valid() {
      return this.username !== '' && this.password !== ''
    }
  },
  methods: {
    handleSubmit() {
      this.$services.auth.signin(this.username, this.password).then(async token => {
        this.$services.emit('app:signin', token)
      }).catch(err => console.log(err))
    },
    handleSignUpClick() {
      this.$router.push('/signup')
    },
    tooglePasswordVisibility() {
      this.e1 = !this.e1
    }
  },
  mounted() {
    // wait for authentication service
    this.$services.waitForService(this.$config.auth.service).then(authService => {
      this.$ws.resetLocalCredentials()
    }).catch(err => console.log(err))
  }
}
</script>

<style>
.login-layout {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
}

.login-header {
  width: 100%;
  justify-content: center;
}

.login-card {
  margin: 4px;
  width: 400px;
  max-height: calc(100% - 2em);
  overflow-y: auto;
  background-color: rgba(0, 0, 0, 0.7)!important;
  color: gainsboro!important;
}

.login-headline {
  width: 100%;
  font-size: 1.5em;
}

.login-actions {
  width: 100%;
  display: flex;
  flex-flow: row;
  justify-content: space-around;
  align-items: center;
}
</style>
