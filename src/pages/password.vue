<template>
  <div>
    <div class="loginWapper">
      <section class="loginCon">
        <h1 class="jlogo"><img src="../assets/logo1.png">&nbsp;&nbsp;&nbsp;北京健科电子病历平台</h1>
        <section class="cont">
          <img src="../assets/login2.png" class="bgL">
          <div class="flag"></div>
          <div class="loginOne" v-on:keyup.enter="drump">
            <form class="loginBox">
              <div class="loginT80">提示：请重新设置新的密码！</div>
              <section>
                <h4 class="form-control  loginH78 loginMT28 clearfix ">
                  <label>新密码&nbsp;:&nbsp;</label>
                  <input type="password" class="loginH78" placeholder="请输入8-15位的数字" v-model="password" @input="change()">
                  <i :class="{loginSucc:isA,loginError:isB}"></i>
                </h4>
                <h4 class="form-control  loginH78 loginMT28 clearfix">
                  <label>确认密码&nbsp;:&nbsp;</label>
                  <input type="password" class="loginH78" placeholder="请输入8-15位的数字" v-model="againPassword" @input="change()">
                  <i :class="{loginSucc:isA,loginError:isB}"></i>
                </h4>
                <div class="wrong size14 floatL" :class="{active:isActive}">{{errorInfo}}</div>
                <div class="loginBtn floatL">
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
    data () {
      return {
        isA: false,
        isB: false,
        againPassword: '',
        password: '',
        errorInfo: '',
        isActive: false
      }
    },
    components: {loginFooter},
    methods: {
      sibCancle(){
        this.$router.push({path: 'login'});
      },
      sibOk(){
        if (this.password != '' && this.againPassword != '') {
          if (/^\d{8,15}$/.test(this.password) && /^\d{8,15}$/.test(this.againPassword)) {
            if (this.password == this.againPassword) {
              this.isA = true;
              this.isB = false;
              this.$http.post(url.url + '/sys/updatePassword', {
                password: this.password,
                newPassword:this.againPassword,
                id:sessionStorage.getItem('user')
              }, {emulateJSON: true}).then((response)=> {
                console.log(response);
                window.setTimeout(()=> {
                 this.$router.push({path: '/'});
                }, 1000);
              }, (response) => {
                this.isActive = false;
                this.errorInfo = '请求失败';
              });
            } else {
              this.isA = true;
              this.isB = true;
              this.isActive = false;
              this.errorInfo = '新密码和确认密码不一样!'
            }
          } else {
            this.isA = true;
            this.isB = true;
            this.isActive = false;
            this.errorInfo = '密码长度应为8-15位之间！';
          }
        } else {
          this.isA = true;
          this.isB = true;
          this.isActive = false;
          this.errorInfo = '密码不能为空！'
        }
      },
      change(){
        this.isActive = true;
        this.isA = false;
        this.isB = false;
      },
    },
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .loginBox .loginT80 {
    padding-top: 0.8rem;
    color: #00bab9;
    font-size: 0.18rem;
  }

  .loginBox .wrong {
    width: 4.97rem;
    height: 0.51rem;
    line-height: 0.51rem;
    color: #ff6b6e;
  }

  .loginBox .loginH78 {
    position: relative;
  }

  .loginBtn button {
    width: 2.35rem;
  }

  .loginBtn .btn_default {
    color: #ffffff;
    margin-left: 0.25rem;
  }

</style>
