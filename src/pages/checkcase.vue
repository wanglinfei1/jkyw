<template>

        <section >
          <hgroup>
            <h2><router-link to="/main">首页</router-link> | <router-link to="/main/case">病例管理</router-link> | 病例查看</h2>
          </hgroup>
          <section class="casessee1">
            <h3><i></i>基本信息</h3>
            <article class="casessee1_con">
              <ul @click="show" :class="{shadow:shadow}">
                <li><b>姓名 :</b>
                  <p>{{obj.patientName}}</p></li>
                <li><b>性别 :</b>
                  <p>{{obj.sex}}</p></li>
                <li><b>年龄 :</b>
                  <p>{{obj.age}}</p></li>
                <span class="slide" :class="{up:up,down:down}"></span>
              </ul>
              <aside class="casessee1_con_show" v-show="pan">
                <ul class="clearfix">
                  <li><b>身份证 :</b>
                    <p>{{obj.idCard}}</p></li>
                  <li><b>电&nbsp;&nbsp;话 :</b>
                    <p>{{obj.phone}}</p></li>
                </ul>
                <ul>
                  <li><b>地&nbsp;&nbsp;&nbsp;&nbsp;址 :</b>
                    <p>{{obj.address}}</p></li>
                  <li><b>备&nbsp;&nbsp;注 :</b>
                    <p>{{obj.memo}}</p></li>
                </ul>
              </aside>
            </article>
          </section>
          <!--/////////////-->
          <section class="casessee1 casessee2">
            <h3><i></i>病程记录</h3>
            <i class="position"></i>
            <article class="casessee1_con casessee2_con">
              <div v-for="(i,index) in arr">
                <pan :message="i" :index="index">
                  <aside class="casessee1_con_show casessee2_con_show">
                    <ul>
                      <li><b>诊疗类型 :</b>
                        <p>{{i.practiceType}}</p></li>
                      <li><b>主诉 :</b>
                        <p>{{i.complain}}</p></li>
                      <li><b>现病史 :</b>
                        <p>{{i.presentHistory}}</p></li>
                      <li><b>检查检验 :</b>
                        <p>{{i.inspection}}</p></li>
                      <li><b>初步诊断 :</b>
                        <p>{{i.diagnosis}}</p></li>
                      <li><b>医嘱建议 :</b>
                        <p>{{i.advice}}</p></li>
                    </ul>
                  </aside>
                </pan>
              </div>
            </article>
          </section>
        </section>

</template>
<script>
  /*引进主键*/
  import pan from '../components/pan.vue';
  import url from '../url';

  export default {
    data () {
      return {
        up: true,
        down: false,
        pan: false,
        shadow: false,
        obj: {},
        arr: [],
      }
    },
    /*当引进一个自定义主键的时候需要在这注册一下*/
    components: {pan},
    mounted(){
      let id = this.$route.query.id;
      this.$http.post(url.url+'/patientcase/viewcase?id=' + id, {emulateJSON: true}).then((response) => {
        if (response.data.result == 200) {
          if (response.data.data.patient != null) {
            this.obj = response.data.data.patient;
          }

          this.arr=response.data.data.caseList;
          //console.log(this.arr)
        } else {
          this.errorInfo = response.data.msg;
        }
      }, (response) => {
        this.errorInfo = '请求失败';
      });

    },
    methods: {
      show(){
        this.pan = !this.pan;
        this.up = !this.up;
        this.down = !this.down;
        this.shadow = !this.shadow;
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .main h2 {
    font-size: 20px;
    padding-top: 36px;
  }

  /**病例查看**/
  .casessee1 {
    margin-top: 38px;
    position: relative;
  }

  .casessee1 .position {
    position: absolute;
    width: 10px;
    height: 20px;
    left: 93px;
    background: #fff;
    z-index: 999;
  }

  .casessee1 h3 {
    font-size: 18px;
    color: #00bab9;
    margin-bottom: 21px;
  }

  .casessee1 h3 i {
    display: inline-block;
    width: 18px;
    height: 18px;
    background: url("../assets/sprit.png") 0 -350px no-repeat;
    margin: 3px 9px 0 0;
    float: left;
  }

  .casessee1_con {
    clear: both;
  }

  .casessee1_con ul {
    height: 68px;
    padding-left: 93px;
    position: relative;
  }

  .casessee1_con ul.shadow {
    box-shadow: 1px 2px 21px -8px rgba(0, 0, 0, 0.6);
    margin: 4px 0;
  }

  .casessee1_con ul li {
    float: left;
    margin-right: 1.49rem;
    line-height: 0.68rem;
    font-size: 18px;
    color: #666666;
  }

  .casessee1_con ul li b {
    margin-right: 16px;
    font-weight: normal;
    float: left;
  }

  .casessee1_con ul li p, .casessee1_con .casessee1_con_show ul li p {
    float: left;
  }
  .casessee1_con ul span{cursor:pointer;}
  .casessee1_con ul .up {
    width: 18px;
    height: 10px;
    background: url("../assets/sprit.png") -33px -11px no-repeat;
    position: absolute;
    right: 34px;
    top: 25px;
  }

  .casessee1_con ul .down {
    width: 18px;
    height: 10px;
    background: url("../assets/sprit.png") -33px 0 no-repeat;
    position: absolute;
    right: 34px;
    top: 25px;
  }

  .casessee1_con .casessee1_con_show {
    clear: both;
    background: #f9fafc;
    height: 128px;
    /*padding-left:54px;*/
  }

  .casessee1_con .casessee1_con_show ul {
    height: 0;
    clear: both;

  }

  .casessee1_con .casessee1_con_show ul li {
    line-height: 0;
    margin-top: 32px;
    height: 16px;
    font-size: 16px;
    color: #999999;
    width: 35%;
    float:left;
  }

  .casessee1_con .casessee1_con_show ul b {
    color: #666666;
    width: 116px;
    display: inline-block;
    text-align: right;
    float: left;
    height: 16px;
  }
</style>
