<template>
  <div>
    <div class="loginWapper">
      <section class="loginCon">
        <h1 class="jlogo"><img src="../assets/logo1.png">&nbsp;&nbsp;&nbsp;北京健科电子病历平台</h1>
        <section class="cont">
          <img class="bgL" src="../assets/login2.png">
          <div class="flag"></div>
          <div class="loginOne" v-on:keyup.enter="drump">
            <form class="loginBox">
              <h4 class="lin_title size28">欢迎登录&nbsp;!
                <span class="Lin_error errorColor size16" :class="{active:isActive}">{{errorInfo}}</span>
              </h4>
              <section>
                <h4 class="form-control  loginH78 loginMT28 clearfix mT15">
                  <label>用户名：</label>
                  <input type="text" class="loginH78" placeholder="" v-model="username">
                </h4>
                <h4 class="form-control  loginH78 loginMT28 clearfix">
                  <label>密码：</label>
                  <input type="password" class="loginH78" placeholder="" v-model="password" @input="change()">
                </h4>
                <div class="size18 forget floatR"><a class="forgotM floatR" @click="forget()">忘记密码</a><b
                  class="syb floatR">|</b><a class="forgotM floatR" @click="loginup()">立即注册</a></div>
                <button type="button" class="btn btn_success" @click="drump">登&nbsp;&nbsp;录
                </button>
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
        username: '',
        password: '',
        isActive: true,
        errorInfo: '',
        doctorName:'',
        navDate:{},
        Text:[]
      }
    },
    components: {loginFooter},
    methods: {
      loginup(){
        this.$router.push({path: '/loginup1'});
      },
      drump(){
        if (this.username != '' && this.password != '') {
          if (/^\d+$/.test(this.username) && /^\d+$/.test(this.password)) {
//                    this.$store.commit('add',username)
            this.$http.post(url.url + '/sys/login', {
              loginName: this.username,
              password: this.password
            }, {emulateJSON: true}).then((response) => {
              if (response.data.result == 200) {
                sessionStorage.setItem('user', response.data.data.userId);
                let navDate = new Array;
                let arr=[true,false,false];
                let menuList=response.data.data.menuInfoList;
                for(let i=0; i<menuList.length; i++){
                  let obj={}
                  obj.checked=arr[i];
                  obj.menuName=menuList[i].menuName;
                  navDate.push(obj);
                }
                if (this.password == '000000') {
                  this.$router.push({path: '/resetpassword'});
                }

                if (response.data.data.userType == '2') {  //如果是121121个人用户,后台接口好了之后判断用户的类型来显示不同数据
                  this.navDate = {
                    type: 2,
                    text: navDate,
                    clickTh: ['/main/personManage', '/main/branchManage', '/main/RoleManage']
                  }
                } else if(response.data.data.userType == '1'){
                  this.navDate = {type: 1, text: navDate, clickTh: ['/main', '/main/case']}
                }
                sessionStorage.setItem('navDate', JSON.stringify(this.navDate));
                sessionStorage.setItem('loginDate', JSON.stringify(response.data.data));
                if (this.password != '000000'&&response.data.data.userType) {
                  this.$router.push({path: '/main'});
                  return;
                }else if(response.data.data.userType==null){
                   this.$router.push({path: '/loginup2'});
                } else {
                  this.isActive = false;
                  this.errorInfo = response.data.msg;
                }
              }
            }, (response) => {
              this.isActive = false;
              this.errorInfo = '请求失败';
            });
          } else if (!/^\d+$/.test(this.username)) {
            this.isActive = false;
            this.errorInfo = '用户名为数字';
          } else if (!/^\d+$/.test(this.password)) {
            this.isActive = false;
            this.errorInfo = '密码为数字';
          }
        } else {
          this.isActive = false;
          this.errorInfo = '请输入用户名和密码！'
        }
      },
      change(){
        this.isActive = true;
      },
      forget(){
        this.$router.push({path: '/code'});
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /*y 1206*/
  .syb {
    margin: 0 0.20rem;
    color: #00bab9;
  }

  .forgotM {
    color: #00bab9;
    cursor: pointer;
  }

  .forgotM:hover {
    text-decoration: underline;
  }

  .forget {
    height: 0.2rem;
    padding: 0.16rem 0.5rem 0.26rem 0;
  }

  .active {
    display: none;
  }

</style>
