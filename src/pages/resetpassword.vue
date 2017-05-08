<template>
  <div>
    <!--<login-head></login-head>-->
    <div class="loginWapper">
      <section class="loginCon">
        <h1 class="jlogo"><img src="../assets/logo1.png">&nbsp;&nbsp;&nbsp;北京健科电子病历平台</h1>
        <section class="cont">
          <img src="../assets/login2.png" class="bgL">
          <div class="flag"></div>
          <div class="loginOne" v-on:keyup.enter="sibOk">
            <form class="loginBox loginBoxSet" id="loginBoxSet">
              <h4 class="lin_title size28">首次登录，请重置密码！<span v-cloak class="Lin_error errorColor size16"
                                                            :class="{error:cue}">{{errorInfo}}</span></h4>
              <section>
                <h4 class="form-control  loginH58 loginMT28 clearfix mT15">
                  <label>原始密码：</label>
                  <input type="password" class="loginH58" placeholder="请输入原始登录密码" v-model="password" @input="change()">
                  <i :class="{loginSucc:isA,loginError:isB}"></i>
                </h4>
                <h4 class="form-control  loginH58 loginMT28 clearfix">
                  <label>新密码：</label>
                  <input type="password" class="loginH58" placeholder="请输入新密码" v-model="newPassword" @input="change()">
                  <i :class="{loginSucc:isA,loginError:isB}"></i>
                </h4>
                <h4 class="form-control  loginH58 loginMT28 clearfix">
                  <label>确认密码：</label>
                  <input type="password" class="loginH58" placeholder="请确认新密码" v-model="reNewPassword"
                         @input="change()">
                  <i :class="{loginSucc:isA,loginError:isB}"></i>
                </h4>
                <div class="loginBtn">
                  <button type="button" class="btn btn_success " @click="sibOk()">确&nbsp;&nbsp;认</button>
                  <button type="button" class="btn btn_default" @click="sibCancle()">取&nbsp;&nbsp;消</button>
                </div>
              </section>
            </form>
          </div>
        </section>
      </section>
    </div>
    <login-footer></login-footer>
  </div>

</template>

<script>
  import loginFooter from '../components/footer.vue';
  import url from '../url';

  export default {
    data(){
      return {
        id: '',
        password: '',
        newPassword: '',
        reNewPassword: '',
        wordInfo: '',
        errorInfo: '',
        cue: true,
        isA: false,
        isB: false
      }
    },
    components: {loginFooter},
    methods: {
      sibOk(){
        if (this.password != '' && this.newPassword != '' && this.reNewPassword != '') {
          if (/^\d+$/.test(this.password) && /^\d+$/.test(this.newPassword) && /^\d+$/.test(this.reNewPassword)) {
            if (/^\d+$/.test(this.password)) {
              if (this.newPassword != this.password) {
                if (this.newPassword == this.reNewPassword) {
                  this.isA = true;
                  this.isB = false;
                  this.cue == true;
                  this.$http.post(url.url + '/sys/updatePassword', {
                    id: sessionStorage.getItem('user'),
                    password: this.password,
                    newPassword: this.reNewPassword,
                  }, {emulateJSON: true}).then((response)=> {
                    if (response.data.result == 200) {
                      console.log(response);
                      this.isActive = true;
                      window.setTimeout(()=> {
                        this.$router.push({path: '/'});
                      }, 1000);
                    } else {
                      this.isActive = false;
                      this.errorInfo = response.data.msg;
                    }

                  }, (response) => {
                    this.isActive = false;
                    this.errorInfo = '请求失败';
                  });
                } else {
                  this.isA = true;
                  this.isB = true;
                  this.cue = false;
                  this.errorInfo = '新密码和确认密码不一样!'
                }
              } else {
                this.isA = true;
                this.isB = true;
                this.cue = false;
                this.errorInfo = '新密码和旧密码不能一致!'
              }

            } else {
              this.isA = true;
              this.isB = true;
              this.cue = false;
              this.errorInfo = '新密码不正确!'
            }

          } else {
            this.isA = true;
            this.isB = true;
            this.cue = false;
            this.errorInfo = '密码为数字！'
          }
        } else {
          this.isA = true;
          this.isB = true;
          this.cue = false;
          this.errorInfo = '请输入密码！'
        }
      },
      change(){
        this.isA = false;
        this.isB = false;
        this.cue == true;

      },
      sibCancle(){
        this.password = '',
          this.newPassword = '',
          this.reNewPassword = ''
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


  .forgotM {
    text-decoration: underline;
    color: #11b998;
    float: right
  }

  .loginBox .lin_title {
    padding-top: 0;
  }

  .loginBox button {
    clear: both;
    height: 0.80rem;
    border-radius: 0;
    margin-top: 0.30rem;
    font-size: 0.24rem;
  }

  .loginBtn button {
    width: 43.5%;
  }

  .loginBtn button:nth-child(1) {
    margin-right: 0.24rem;
  }

  .loginBoxSet section h4 {
    line-height: 0.58rem;
    position: relative
  }

  .loginBoxSet button:nth-child(2) {
    color: #fff
  }

  .form-control .loginSucc, .loginError {
    right: 0.17rem;
    top: 0.20rem;
  }

  /***login**/

  .loginH58 {
    height: 0.58rem;
  }

  .loginMT28 {
    margin-top: 0.28rem;
  }

  .loginBtn button:nth-child(1) {
    margin-right: 0.24rem;
  }

  .loginBoxSet section h4 {
    line-height: 0.58rem;
    position: relative
  }

  .loginBoxSet button:nth-child(2) {
    color: #fff
  }


</style>
