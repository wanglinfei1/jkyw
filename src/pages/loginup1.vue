<template>
  <div>
    <div>
      <div class="loginWapper">
        <section class="loginCon">
          <h1 class="jlogo"><img src="../assets/logo1.png">&nbsp;&nbsp;&nbsp;北京健科电子病历平台</h1>
          <section class="cont">
            <div data-v-3="" class="flag"></div>
            <ul>
              <li><span class="blue"></span>注册信息<i></i></li>
              <li><span></span>信息完善<i></i></li>
              <li><span></span>信息验证<i></i></li>
              <li><span></span>成功登录</li>
            </ul>
            <div class="past">{{errorInfo}}</div>
            <form class="loginUpBox">
              <h4 class="form-control clearfix ">
                <label for="phone">手机号</label>
                <input type="text" id="phone" placeholder="请输入手机号" v-model="phone" @input="change()">
                <i :class="{loginSucc:isA,loginError:isB}"></i>
              </h4>
              <h4 class="form-control clearfix ">
                <label for="phone">密&nbsp;&nbsp;&nbsp;码</label>
                <input type="password" id="password" placeholder="设置密码不少于8位" v-model="pass">
                <i :class="{loginSucc:isA,loginError:isB}"></i>
              </h4>
              <h4 class="form-control clearfix ">
                <label for="code">验证码</label>
                <input type="text" class="w148" id="code" placeholder="请输入验证码" v-model="code">
                <button type="button" class="w148  code btn_default" :class="{btn_success:blue}" @click="send()">
                  {{codeCont}}
                </button>
              </h4>
              <button type="button" class="btn btn_success submit" @click="submit()">提&nbsp;&nbsp;交</button>
            </form>
          </section>
        </section>
      </div>
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
        isA: false,
        isB: false,
        blue: false,
        tab:false,
        errorInfo: '',
        codeCont: '发送验证码',
        a: 61,
        pass:''
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
        this.$http.post(url.url + '/sys/register', {
          phone: this.phone,
          verifyCode: this.code,
          codeType:2,
          password:this.pass
        }, {emulateJSON: true}).then((response) => {
          if (response.data.result == 200) {
            console.log(response)
            sessionStorage.setItem('user', response.data.data.userId);
                        this.$router.push({path: 'loginup2'});

          } else {
            this.errorInfo = response.data.msg;
          }
        }, (response) => {
          this.errorInfo = '请求失败';
        });
      },
      change(){
        this.errorInfo='';
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
  ul li:nth-child(1) {
    color: #00bab9;
  }

  .cont {
    height:auto;
    padding-bottom: 0.86rem;
  }

  .cont .past {
    padding-top: 0.57rem;
    padding-left: 3rem;
    color: #ec6941;
    font-size: 0.16rem;
    height: 0.16rem;
  }

  .loginUpBox input {
    width: 3.57rem;
    padding-left: 0.28rem;
  }

  .form-control .loginSucc, .loginError {
    right: 2.1rem;
    top: 0.16rem;
  }

  .cont .w148 {
    width: 1.48rem;
  }

  .cont .code {
    margin-left: 0.12rem;
    background: #dddddd;
    color: #f6f6f6;
    border: 0;
    font-size: 0.18rem;
    height: 0.5rem;
    width: 1.94rem;
  }

  .cont .code:hover{
    background: #d8d8d8;;
  }
.cont .btn_success {
  background: #00bab9;
  color: #fff
}

.cont .btn_success:hover {
  background: #019d9c;
}
  .loginUpBox .submit {
    margin-top: 0.09rem;
    font-size: 0.18rem;
    margin-left: 2.9rem;
    width: 3.93rem;
    height: 0.55rem;
    padding: 0;
  }

</style>
