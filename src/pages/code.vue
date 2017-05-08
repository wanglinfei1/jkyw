<template>
  <div>
    <div class="loginWapper">
      <section class="loginCon">
        <h1 class="jlogo"><img src="../assets/logo1.png">&nbsp;&nbsp;&nbsp;北京健科电子病历平台</h1>
        <section class="cont">
          <img class="bgL" src="../assets/login2.png">
          <div class="flag"></div>
          <div class="loginOne">
            <form class="loginBox loginWap">
              <div class="loginT80 size18">提示：请输入手机号验证码，提交后进行密码重置</div>
              <section>
                <h4 class="form-control  loginH78 loginMT28">
                  <label>手机号&nbsp;:</label>
                  <input type="text" class="loginH78 loginW330" v-model="phone" @input="change()">
                  <i :class="{loginSucc:isA,loginError:isB}"></i>
                </h4>
                <div class="possWapper clearfix loginH78 loginMT28">
                  <h4 class="form-control    ">
                    <label>验证码&nbsp;:</label>
                    <input type="text" class="loginH78" placeholder="" v-model="code">
                  </h4>
                  <button type="button" class="loginH78  btn btn_default" :class="{btn_success:blue}" @click="send()">
                    {{codeCont}}
                  </button>
                </div>

                <div class="wrong size14" :class="{active:isActive}"><!--验证码已经过期，请重新发送验证码-->{{errorInfo}}</div>
                <button type="button" class="btn btn_success con submit" @click="submit()">提&nbsp;&nbsp;交</button>
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
    data () {
      return {
        phone: '',
        code: '',
        errorInfo: '',
        isA: false,
        isB: false,
        codeCont: '发送验证码',
        a: 61,
        blue: false,
        isActive: false,
        codeType:''
      }
    },
    watch: {
      phone: function (val) {
        if (val.length == 11) {
          this.blue = true;
        } else {
          this.blue = false
        }
      }
    },
    components: {loginFooter},
    methods: {
      submit(){
        this.$http.post(url.url + '/sys/verifyCode', {
          phone: this.phone,
          verifyCode: this.code,
          codeType:'3'
        }, {emulateJSON: true}).then((response) => {
          if (response.data.result == 200) {
            //console.log(response);
            this.$router.push({path: 'password'});
          } else {
            this.errorInfo = response.data.msg;
          }
        }, (response) => {
          this.errorInfo = '请求失败';
        });
      },
      change(){
        this.isA = false;
        this.isB = false;
        this.codeCont = '发送验证码';
      },
      send(){
        this.errorInfo = '';
        if (/^(1[3|5|8|7]{1}\d{9})$/.test(this.phone)) {
          if(this.tab){
            return;
          }
          this.tab=true;
          this.a = 61;
          this.$http.post(url.url + '/sys/smsmes', {
            phone: this.phone,
            codeType:2,
          }, {emulateJSON: true}).then((response) => {
            if (response.data.result == 200) {
              this.isA = true;
              this.isB = false;

              let self = this;
              let timer = setInterval(function () {
                if (self.a > 0) {
                  self.a--;
                  self.codeCont = self.a + 's后重新发送'
                } else {
                  clearInterval(timer);
                  self.codeCont = '发送验证码'
                  self.tab=false;
                  console.log(self.tab);
                }
              }, 1000);
            }
          }, (response) => {
            this.errorInfo = '请求失败';
          });
        } else {
          this.isA = false;
          this.isB = true;
          this.errorInfo = '请输入正确的手机号';
        }
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .loginBox .loginT80 {
    padding-top: 0.8rem;
    color: #00bab9;
  }

  .loginBox .loginW330 {
    width: 3.3rem;
  }

  .loginBox .wrong {
    height: 0.51rem;
    line-height: 0.51rem;
    color: #ff6b6e;
    margin-top:0.02rem;
  }

  .loginBox input {
    width: 1.43rem;
  }

  .loginBox label {
    padding-left: 0;
  }

  .loginBox .submit {
    margin-top: 0;
    width: 5rem;;
  }

  .possWapper button {
    width: 2.32rem;
    margin-left:0.14rem;
    font-size: 0.16rem;
    height: 0.8rem;
  }

  .loginWap h4, .possWapper {
    float: none;
    height: 0.78rem;
    width: 4.98rem;
    line-height: 0.78rem;
  }

  .loginWap .possWapper h4 {
    width: 2.49rem;
    float: left;
  }
</style>
