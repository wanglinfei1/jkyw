<template>
  <div>
    <div class="loginWapper">
      <section class="loginCon">
        <h1 class="jlogo"><img src="../assets/logo1.png">&nbsp;&nbsp;&nbsp;北京健科电子病历平台</h1>

        <section class="cont">
          <div class="flag"></div>
          <ul>
            <li><span></span>注册信息<i></i></li>
            <li><span></span>信息完善<i></i></li>
            <li><span class="blue"></span>信息验证<i></i></li>
            <li><span></span>成功登录</li>
          </ul>
          <h3>工作人员会在2个工作日内，联系您，请保持联系方式畅通！</h3>
          <dl>
            <dt>名 称&nbsp;:&nbsp;</dt>
            <dd class="hospital">{{obj.hospitalName}}</dd>
            <dt class="rightT">联系人&nbsp;:&nbsp;</dt>
            <dd>{{obj.contactMan}}</dd>
            <br>
            <dt>地 址&nbsp;:&nbsp;</dt>
            <dd class="address">{{obj.hospitalAddress}}</dd>
            <dt class="rightF">联系方式&nbsp;:&nbsp;</dt>
            <dd>{{obj.contactPhone}}</dd>
          </dl>
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
        obj: {},
        id:sessionStorage.getItem('hostid')
      }
    },
    components: {loginFooter},
    mounted(){
      this.$http.get(url.url + '/hospital/view/'+this.id,{}, {emulateJSON: true}).then((response) => {
        if (response.data.result == 200) {
            this.obj = response.data.data.hospital;
        }
      }, (response) => {
        this.errorInfo = '请求失败';
    });
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  ul li:nth-child(3) {
    color: #00bab9;
  }

  .cont h3 {
    color: #00bab9;
    margin: 0.99rem auto 0.88rem;
    text-align: center;
    font-size: 0.2rem;
  }

  .cont dt, dd {
    display: inline-block;
    height: 0.16rem;
    line-height: 0.16rem;
    margin-bottom: 0.34rem;
    font-size: 0.18rem;
    color: #999;
  }

  .cont dt {
    color: #666;
    padding-left: 1.65rem;
  }

  .cont dt:nth-child(4) {
    padding-left: 5.7rem;
  }

 dl .hospital,.address{
    width: 3.6rem;
    color: #999;
  }

  .cont .rightF {
    padding-left: 0;
  }

  .cont .rightT {
    padding-left: 0.17rem;
  }

</style>
