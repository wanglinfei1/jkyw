<template>
  <div>
    <ul @click="show" :class="{shadow:shadow}">
      <span class="point" :class="{dian:dian,dians:dians}"></span>
      <li><p>{{message.subDate}}</p></li>
      <li><b>科室 :</b>
        <p>{{message.orgName}}</p></li>
      <li><b>医生 :</b>
        <p>{{message.doctorName}}</p></li>
      <li><p>{{message.diagnosis}}</p></li>
      <span class="slide" :class="{up:up,down:down}"></span>
    </ul>
    <div v-show="open">
      <slot></slot>
    </div>
  </div>
</template>
<script>
  export default{
    data(){
      return {
        open: false,
        up: true,
        down: false,
        shadow: false,
        dian: true,
        dians: false
      }
    },
    props: ['message','index'],
    methods: {
      show(){
        this.open = !this.open;
        this.up = !this.up;
        this.down = !this.down;
        this.shadow = !this.shadow;
        this.dian = !this.dian;
        this.dians = !this.dians;
      }
    },
    mounted(){
      if (this.index==0) {
        this.open = !this.open;
        this.up = !this.up;
        this.down = !this.down;
        this.shadow = !this.shadow;
        this.dian = !this.dian;
        this.dians = !this.dians;
      }
    }
  }
</script>
<style>
  /**病例查看**/
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
    margin-right: 149px;
    line-height: 68px;
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

  .casessee2_con .casessee2_con_show ul li {
    width: 100% !important;
    clear: both;
    height: auto !important;
  }

  .casessee1_con .casessee1_con_show ul b {
    color: #666666;
    width: 116px;
    display: inline-block;
    text-align: right;
    float: left;
    height: 16px;
  }

  .casessee2 h3 i {
    background: url("../assets/sprit.png") 0 -371px no-repeat;
  }

  .casessee2_con ul .point, .casessee2_con ul .pointtop {
    background: url("../assets/sprit.png") -34px -24px no-repeat;
    width: 16px;
    height: 44px;
    display: inline-block;
    float: left;
    margin: 24px 18px 0 0;
  }

  .casessee2_con ul .point {
    background: url("../assets/sprit.png") -34px -64px no-repeat;
    margin-top: 0;
    height: 68px;
  }

  .casessee2_con .casessee2_con_show {
    overflow: hidden;
    height: auto !important;
    margin-bottom: 4px;
    padding-bottom: 20px;
  }

  .casessee2_con .casessee2_con_show ul li p {
    width: 82%;
    line-height: 23px;
    margin-top: -12px;
    word-break: break-all;
  }

  .casessee1_con ul .point.dian {
    height: 68px;
    margin-top: 0;
  }

  .casessee1_con ul .point.dians {
    height: 60px;
    margin-top: 4px;
  }
</style>

