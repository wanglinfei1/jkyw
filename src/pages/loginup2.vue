<template>
  <div>
    <div class="loginWapper">
      <section class="loginCon">
        <h1 class="jlogo"><img src="../assets/logo1.png">&nbsp;&nbsp;&nbsp;北京健科电子病历平台</h1>
        <section class="cont">
          <div class="flag"></div>
          <ul>
            <li><span></span>注册信息<i></i></li>
            <li><span class="blue"></span>信息完善<i></i></li>
            <li><span></span>信息验证<i></i></li>
            <li><span></span>成功登录</li>
          </ul>
          <div class="change fontColor">
            <a :class="{blue:on,lineA:on}" @click="converseA">个人用户</a>
            <i>|</i>
            <a :class="{blue:off,lineB:off}" @click="converseB">机构用户</a>
          </div>
          <form class="loginUpBox" v-if="on">
            <h4 class="form-control   clearfix">
              <label for="name">姓&nbsp;名</label>
              <input type="text" id="name" placeholder="张三" v-model="content.name" @input="change()">
              <i :class="{loginSucc:isT.name,loginError:isT.nameE}"></i>
            </h4>

            <h4 class="form-control clearfix ">
              <label for="name">机&nbsp;构</label>
              <input type="text" id="institute" placeholder="输入所在医疗机构" v-model="content.institute"
                     @input="change()">
              <i :class="{loginSucc:isT.institute,loginError:isT.instituteE}"></i>
            </h4>

            <h4 class="form-control clearfix ">
              <label for="name">科&nbsp;室</label>
              <input type="text" id="depart" placeholder="输入所在科室" v-model="content.depart"
                     @input="change()">
              <i :class="{loginSucc:isT.depart,loginError:isT.departE}"></i>
            </h4>

            <h4 class="form-control clearfix ">
              <label for="name">职业编号</label>
              <input type="text" id="code" placeholder="请输入职业编号" v-model="content.code" @input="change()">
              <i :class="{loginSucc:isT.code,loginError:isT.codeE}"></i>
            </h4>
            <button type="button" class="btn btn_success submit" @click="submit()">提&nbsp;&nbsp;交</button>
          </form>

          <!--机构用户-->

          <form class="loginUpBox" v-else>
            <h4 class="form-control   clearfix ">
              <label for="inst">名&nbsp;称</label>
              <input type="text" id="inst" placeholder="输入所在医疗机构" v-model="contentB.institute" @input="change()">
              <i :class="{loginSucc:isTB.institute,loginError:isTB.instituteE}"></i>
            </h4>

            <h4 class="form-control clearfix ">
              <label for="address">地&nbsp;址</label>
              <input type="text" id="address" placeholder="输入机构所在地址" v-model="contentB.address" @input="change()">
              <i :class="{loginSucc:isTB.address,loginError:isTB.addressE}"></i>
            </h4>

            <h4 class="form-control clearfix ">
              <label for="na" class="childT">联系人</label>
              <input type="text" id="na" placeholder="张三" v-model="contentB.name" @input="change()">
              <i :class="{loginSucc:isTB.name,loginError:isTB.nameE}"></i>
            </h4>

            <h4 class="form-control clearfix ">
              <label for="phone">联系方式</label>
              <input type="text" id="phone" placeholder="输入手机号码 / 电话号码" v-model="contentB.phone" @input="change()">
              <i :class="{loginSucc:isTB.phone,loginError:isTB.phoneE}"></i>
            </h4>
            <button type="button" class="btn btn_success submit" @click="submitB()">提&nbsp;&nbsp;交</button>
          </form>
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
        on: true,
        off: false,
        blue: true,
        content: {name: '', institute: '', depart: '', code: ''},
        isT: {},
        contentB: {institute: '', address: '', name: '', phone: ''},
        isTB: {},
        total:{}
      }
    },
    components: {loginFooter},
    methods: {
      converseA(){
        if (this.on == true) return;
        this.on = !this.on;
        this.off = !this.off;
      },
      converseB(){
        if (this.off == true) return;
        this.on = !this.on;
        this.off = !this.off;
      },
      submit(){
        this.isT = {};
        for (let key in this.content) {
          this.isT[key] = this.content[key];
          this.isT[key + 'E'] = !this.content[key]
        }
        this.$http.post(url.url + '/sys/consumPopUser', {
          doctorName: this.content.name,
          hospitalName: this.content.institute,
          orgName: this.content.depart,
          practiceNo: this.content.code,
          userId:sessionStorage.getItem('user')
         }, {emulateJSON: true}).then((response) => {
          if (response.data.result == 200) {
            //console.log(response);
            this.$router.push({path: '/'});
          }
        }, (response) => {
          this.errorInfo = '请求失败';
        });
      },
      submitB(){
        this.isTB = {};
        let ret='';
        for (let key in this.contentB) {
          this.isTB[key] = this.contentB[key];
          this.isTB[key + 'E'] = !this.contentB[key]
        }
        this.total.hospitalName=this.contentB.institute;
        this.total.address=this.contentB.address;
        this.total.contactMan=this.contentB.name;
        this.total.contactPhone=this.contentB.phone;
        this.total.userId= sessionStorage.getItem('user');
        this.$http.post(url.url + '/sys/consumOrgUser', this.total, {emulateJSON: true}).then((response) => {
          if (response.data.result == 200) {
            sessionStorage.setItem('hostid', response.data.data.hospitalId);
            this.$router.push({path: 'loginup3'});
          }
        }, (response) => {
          this.errorInfo = '请求失败';
        });
      },
      change(){
        this.isT = {};
        this.isTB = {}
      }
    },
  }
</script>

<style scoped>
  .loginCon{
    margin-top: 0.97rem;
  }
  .cont {
    padding-bottom:0.47rem;
    height: initial;
  }

  ul li:nth-child(2) {
    color: #00bab9;
  }

  .change {
    position: relative;
    padding-top: 0.61rem;
    text-align: center;
  }

  .fontColor {
    color: #666;
  }

  .change .blue {
    color: #00bab9;
  }

  .change a {
    cursor: pointer;
    font-size: 0.18rem;
  }

  .change i {
    color: #f5f5f5;
    margin: 0 0.17rem;
  }

  .change .lineA:after, .lineB:after {
    content: '';
    position: absolute;
    top: 0.91rem;
    left: 3.9rem;
    height: 0.02rem;
    width: 0.39rem;
    background: #00bab9;
  }

  .change .lineB:after {
    left: 5rem;
  }

  form {
    padding-top: 0.48rem;
  }

  .loginUpBox input {
    width: 4.24rem;
    padding-left: 0.14rem;
  }

  .loginUpBox h4:nth-child(4) label{
    padding-left:1.8rem;
  }
.loginUpBox h4 .childT{
  padding-left: 1.98rem;
}
  .form-control .loginSucc, .loginError {
    right: 1.7rem;
    top: 0.16rem;
  }

  .loginUpBox .submit {
    border: 0;
    margin-left: 2.67rem;
    width: 4.48rem;
  }


</style>
