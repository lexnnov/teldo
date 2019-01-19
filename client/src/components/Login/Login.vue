<template>
  <v-layout align-center justify-center>
    <notifications classes="notification_succses" group="foo" position="top center"/>
    <notifications classes="notification" group="error" position="bottom center"/>

    <v-form lazy-validation ref="form" style="width: 290px">
      <v-layout wrap>
        <v-flex xs12 sm12>
          <div v-if="!this.$store.state.auth.isAuth">
            <div>

              <v-text-field
                @keydown.enter.prevent="loginSubmit"
                ref="taskName"
                label="Telegram username"
                single-line
                @input="loginHendler"
                required
              ></v-text-field>

              <v-text-field
                @keydown.enter.prevent="loginSubmit"
                label="Password"
                single-line
                @input="passwordHendler"
                required
              ></v-text-field>

              <h5>
                <p style="line-height: 1;    font-family: Roboto,sans-serif; color: #a5a5a5;  font-weight: normal;">
                  Если вы забыли свой пароль или еще не заходили в панель,
                  введите свой логин и нажмите кнопку "Get Password"
                </p>

              </h5>

              <div class="text-xs-center" style="display: flex; justify-content: space-between;">
                <v-btn style="margin: 0" outline v-on:click="requestPassword" largest color="primary" dark>Get
                  Password
                </v-btn>
                <v-btn style="margin: 0" v-on:click="loginSubmit" largest color="primary" dark>Login</v-btn>
              </div>

            </div>
          </div>
          <div v-else class="text-xs-center">
            <Logout/>
          </div>

        </v-flex>
      </v-layout>
    </v-form>

  </v-layout>
</template>

<script>
  import Logout from "../Logout/Logout";

  export default {
    name: "Login",
   components: {Logout},
    data() {

      return {
        login: '',
        password: '',
        loggedIn: true,
      };
    },

    methods: {

      notify(type, title, text) {
        this.$notify({
          position: 'top center',
          group: type,
          title: title,
          text: text,
        });
      },

      loginHendler(value) {
        this.$store.dispatch('LOGIN', value);
        this.login = value;

      },

      requestPassword() {
        if (this.login) {
          this.$socket.emit("reqPassword", {username: this.login});
        }

      },
      passwordHendler(value) {
        this.$store.dispatch('PASSWORD', value);
        this.password = value;

      },

      loginSubmit() {
        if (this.login) {
          this.$socket.emit("login", {username: this.login, password: this.password});
        } else {
          this.notify('error', 'ERROR', 'Необходимо заполнить все поля!');
        }

        // console.log('1111111111111111')
      },


    },

    // response from the server

    socket: {

      events: {
        Login(res) {
          console.log(res.data)
          switch (res.data) {

            case 'admin':
              this.$store.dispatch('AUTH', true);
              this.$router.push('/');
              this.$localStorage.set('someBoolean', true);
              break;
            case 'no_admin':
              this.notify('error', 'ERROR', 'У вас нет доступа!');
              break;
            case 'stranger':
              this.notify('error', 'ERROR', 'Вы чужак!');
              break;
            case 'incorrect_password':
              this.notify('error', 'ERROR', 'Вы ввели неверный пароль!!');
              break;
            case 'no_password':
              this.notify('error', 'ERROR', 'Введите пароль!');
              break;
          }
        },

        resPassword(res) {
          switch (res.data) {
            case 'admin':
              this.notify('foo', 'Password', 'Пароль отправлен вам в телеграмм');
              break;
            case 'no_admin':
              this.notify('error', 'ERROR', 'У вас нет доступа!');
              break;
            case 'stranger':
              this.notify('error', 'ERROR', 'Вы чужак!');
              break;
          }

        }
      }
    }
  };
</script>

<style lang="scss">

  @import "./Login";

</style>
