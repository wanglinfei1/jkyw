<template>
  <div id="mains">
      <!--头部-->
      <detail-head></detail-head>
      <article class="content clearfix">
        <!--左侧菜单-->
        <detail-nav></detail-nav>
        <article class="main floatL" id="main">
          <section class="mainBox clearfix">
             <router-view class="mainCont"></router-view>
          </section>
        </article>
      </article>
    </div>
</template>

<script>
  import {mapState} from 'vuex';
  import detailHead from '../components/detailhead';
  import detailNav from '../components/detailnav';
  import url from '../url';

  export default{
        name: 'mains',
        data (){
          return {
            userType:JSON.parse(sessionStorage.getItem('loginDate')).userType,
            hosId:''
          }
        },
    components: {detailHead, detailNav},
        mounted(){
          if(this.userType==2){
            this.hosId=JSON.parse(sessionStorage.getItem('loginDate')).hospitalId;
          }else{
            this.hosId=JSON.parse(sessionStorage.getItem('loginDate')).doctorId;
          }
          this.$http.post(url.url + '/sys/init', {
            hospitalId:this.hosId
          }, {emulateJSON: true}).then((response) => {
            if (response.data.result == 200) {
              sessionStorage.setItem('initData',JSON.stringify(response.data.data));
            } else {
              this.errorInfo = response.data.msg;
            }
          }, (response) => {
            this.errorInfo = '请求失败';
          });
        }
    }
</script>

<style scoped>

</style>
