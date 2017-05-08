<template>
  <section id="PerMan" class="floatL">
    <nav class="slider size18 floatL" id="nav" ref="nav">
      <figure class="Jphoto clearfix" @click="opendetail">
        <section class="photoBox p_default" :class="{dec:isA==1,host:isB==1}"></section>
        <figcaption class="j_title" >
            <summary>{{TypeName}}</summary>
            <p class="fff">{{name}}</p>
        </figcaption>
      </figure>
      <section class="menuBox" id="menuBox">
        <ul id="menuBoxCont">
          <li
              v-for="(nav,index) in navText"
            :class="{active:nav.checked}"
            @click="active(index)"
            v-bind:title="navclick[index]"
              >
            <i :class="{a:0==index && type==1,b:1==index && type==1,c:0==index && type==2,d:1==index && type==2,e:2==index && type==2}">
            </i>
            <span>{{nav.menuName}}</span>
          </li>
        </ul>
      </section>
    </nav>
    <el-dialog class='dialogDetail' title="部门信息"  v-model="dialogDetail" size="tiny" >
      <section class="photoBox p_default"><img src="../assets/photo_default-1.png"/></section>
      <div class="lines">基本信息</div>
      <el-form :model="BranDetail" label-width="94px">
        <el-form-item label="机构代码：">
          <p>{{BranDetail.hospitalCode}}</p>
        </el-form-item>
        <el-form-item label="名称：">
          <p>{{BranDetail.hospitalName}}</p>
        </el-form-item>
        <el-form-item label="级别：">
          <p>{{BranDetail.lev}}</p>
        </el-form-item>
        <el-form-item label="地址：">
          <p>{{BranDetail.hospitalAddress}}</p>
        </el-form-item>
        <el-form-item label="电话：">
          <p>{{BranDetail.contactPhone}}</p>
        </el-form-item>
      </el-form>
      <div class="lines">系统管理员信息</div>
      <el-form :model="BranAdmin" label-width="94px">
        <el-form-item label="管理员：">
          <p>{{BranAdmin.userName}}</p>
        </el-form-item>
        <el-form-item label="联系方式：">
          <p>{{BranAdmin.loginName}}</p>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog class='dialogPer' title="个人信息"  v-model="dialogPer" size="tiny" >
      <section class="photoBox p_default"><img src="../assets/photo_default.png"/></section>
      <el-form :model="PerDetail" label-width="94px">
        <el-form-item label="姓名：">
          <p>{{PerDetail.name}}</p>
        </el-form-item>
        <el-form-item label="机构：">
          <p>{{PerDetail.code}}</p>
        </el-form-item>
        <el-form-item label="科室：">
          <p>{{PerDetail.level}}</p>
        </el-form-item>
        <el-form-item label="职业编号：">
          <p>{{PerDetail.address}}</p>
        </el-form-item>
        <el-form-item label="手机号：">
          <p>{{PerDetail.phone}}</p>
        </el-form-item>
      </el-form>
    </el-dialog>
  </section>
</template>
<script>
  import url from '../url';
  export default{
    data(){
      return{
        name:'',
        isA:0,
        isB:0,
        navDate:{ },
        TypeName:'',
        userType:JSON.parse(sessionStorage.getItem('loginDate')).userType,
        navText:[],
        navclick:[],
        index:0,
        type:0,
        hospitalId:'',
        userId:'',
        BranDetail:{
          code:'123',
          name:'河北省ssss',
          level:'心内科',
          address:'河北省ssss',
          phone:'18511866774'
        },
        BranAdmin:{
          name:'河北省ssss',
          phone:'18511866774'
        },
        dialogDetail:false,
        dialogPer:false,
        PerDetail:{
          code:'123',
          name:'河北省ssss',
          level:'心内科',
          address:'河北省ssss',
          phone:'18511866774'
        },
      }
    },
    props:['change'],
    mounted (){
      let dataNav=JSON.parse(sessionStorage.getItem('navDate')); //获取nav数据
      this.navDate=dataNav;
      this.navText=dataNav.text;
      this.navclick=dataNav.clickTh;
      this.type=dataNav.type;
      if(this.userType==1){
        this.name=JSON.parse(sessionStorage.getItem('loginDate')).doctorName;
        this.TypeName='主任医师';
        this.isA=1;
      }else if(this.userType==2){
        this.name=JSON.parse(sessionStorage.getItem('loginDate')).hospitalName;
        this.TypeName='机构代码';
        this.$router.push({path:this.navclick[0]});
        this.isB=1;
      }else{
         this.$router.push({path:'/loginup2'});
      }

      var iH=document.documentElement.clientHeight;
      var oNav = document.getElementById('menuBox');
      oNav.style.height=(iH-250)+'px';  //设置高度
      scroll('menuBox','menuBoxCont');
      function scroll(oDiv3,oDiv4){
        var oDiv3 = document.getElementById(oDiv3);
        var oDiv4 = document.getElementById(oDiv4);
        var disY = 0;
        var bBtn = true;
        var T = 0;
        if(oDiv4.addEventListener){
          oDiv4.addEventListener('DOMMouseScroll',toChange,false);
        }
        oDiv4.onmousewheel = toChange;

        function toChange(ev){
          var ev = ev || window.event;
          if(ev.detail){
            bBtn =  ev.detail>0  ? true : false;
          }
          else{
            bBtn =  ev.wheelDelta<0 ? true : false;
          }
          if(bBtn){  //下
            T =T - 30;
            if(T< -(oDiv4.offsetHeight - oDiv3.offsetHeight)){
              T = -(oDiv4.offsetHeight - oDiv3.offsetHeight);
            }
          }
          else{  //上
            T =T + 30;
            if(T>0){
              T = 0;
            }
          }
          oDiv4.style.top = T + 'px';
          if(ev.preventDefault){
            ev.preventDefault();
          }
          else{
            return false;
          }
        }
      }
    },
    watch: {
      '$route': 'fetchData'
    },
    methods:{
      fetchData(){
        let self=this;
        let index = (function () {
            for (var i = 0; i < self.navclick.length; i++) {
              if (self.$route.path ==self.navclick[i] ) {
                return i
              }
            }
        })();
        this.select(index);
      },
      select(index){
          if(index!=undefined){  for (var i = 0; i < this.navText.length; i++) {
            this.navText[i].checked = false;
            this.navText[index].checked = true;}
        }
      },

      active(index){
          this.$router.push({path:this.navclick[index]});
          this.select(index);
      },
      opendetail(){
        if(this.userType==2){ //机构用户
          this.hospitalId=JSON.parse(sessionStorage.getItem('loginDate')).hospitalId;
          this.dialogDetail=true;
          this.$http.get(url.url+'/hospital/view/'+this.hospitalId,{emulateJSON:true}).then((response) => {
            if(response.data.result==200){
              this.BranDetail=response.data.data.hospital
              this.BranAdmin=response.data.data.admin;
            }else{
              this.$message({
                type: 'error',
                message:response.data.msg
              });
              return;
            }
          }, (response) => {
            this.$message({
              type: 'error',
              message:"请求失败"
            });
          });

        }else{
          this.userId=JSON.parse(sessionStorage.getItem('loginDate')).userId;
          this.dialogPer=true;
          this.$http.post(url.url+'/user/get/'+this.userId,{emulateJSON:true}).then((response) => {
            if(response.data.result==200){
              //console.log(response);
              this.PerDetail=response.data.data;
            }else{
              this.$message({
                type: 'error',
                message:response.data.msg
              });
              return;
            }
          }, (response) => {
            this.$message({
              type: 'error',
              message:"请求失败"
            });
          });
        }
      }
    }
  }
</script>
<style>
  .slider {
    width: 13%;
    min-width:2.4rem;
    background: #293d50;
    height: 100%;
    -margin-bottom: -10rem;
    -padding-bottom:8.98rem;
  }

  .Jphoto {
    height: 0.94rem;
    background: #1a2734;
    text-align: center;
    padding: 16% 0 0 16%
  }

  .photoBox {
    width: 0.6rem;
    height: 0.6rem;
    border: 1px solid #dfdfdf;
    border-radius: 50%;
    line-height: 0.58rem;
    float: left;
  }
.photoBox.dec{
  background:url(../assets/photo_default.png) no-repeat center center;
  background-size:50% 50%;
}
.photoBox.host{
  background:url(../assets/photo_default-1.png) no-repeat center center;
  background-size:50% 50%;
}
  .p_default {
    border: 1px solid #638389
  }

  .photoBox img {
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 50%;
  }

  .p_default img {
    text-align: center;
    width: 0.25rem;
    height: 0.31rem;
    border-radius: 0
  }

  .j_title {
    float: left;
    text-align: left;
    margin-left: 0.2rem;
  }

  .j_title p {
    line-height: 0.3rem;
  }

  .j_title summary {
    line-height: 0.3rem;
    color: #a0d2d1
  }

  .menuBox {
    /*height: 855px;*/
    width:100%;
    height:100%
  }

  .menuBox li {
    height: 0.8rem;
    background: #293d50;
    line-height: 0.8rem;
    color: #a0d2d1;
    padding-left: 0.48rem;
    border-left: 0.06rem solid #293d50;cursor:pointer;
  }

  .menuBox li i {
    display: inline-block;
    vertical-align: middle;
    margin-right: 0.15rem;
    width:22px;
    height:22px;
  }
  .menuBox li i.a{
    background: url("../assets/sprit.png") no-repeat 0 -257px;
  }
  .menuBox li.active i.a{
    background: url("../assets/sprit.png") no-repeat 0 -227px;
  }
  .menuBox li:hover i.a{
    background: url("../assets/sprit.png") no-repeat -22px -166px;
  }

  .menuBox li i.b{
    background: url("../assets/sprit.png") no-repeat 0 -197px;
  }
  .menuBox li.active i.b{
    background: url("../assets/sprit.png") no-repeat 0 -167px;
  }
  .menuBox li:hover i.b{
    background: url("../assets/sprit.png") no-repeat -24px -197px;
  }
  .menuBox li i.c{
    background: url("../assets/sprit.png") no-repeat -53px 0;
  }
  .menuBox li.active i.c{
    background: url("../assets/sprit.png") no-repeat -76px 0;
  }
  .menuBox li:hover i.c{
    background: url("../assets/sprit.png") no-repeat -99px 0;
  }
  .menuBox li i.d{
    background: url("../assets/sprit.png") no-repeat -53px -26px;
  }
  .menuBox li.active i.d{
    background: url("../assets/sprit.png") no-repeat -76px -26px;
  }
  .menuBox li:hover i.d{
    background: url("../assets/sprit.png") no-repeat -99px -26px;
  }
  .menuBox li i.e{
    background: url("../assets/sprit.png") no-repeat -53px -51px;
  }
  .menuBox li.active i.e{
    background: url("../assets/sprit.png") no-repeat -76px -51px;
  }
  .menuBox li:hover i.e{
    background: url("../assets/sprit.png") no-repeat -99px -51px;
  }
  /*  .menuBox li:nth-child(1) i {
      background: url("../assets/sprit.png") no-repeat 0 -257px;
      width: 22px;
      height: 22px;
    }

    .menuBox li:nth-child(2) i {
      background: url("../assets/sprit.png") no-repeat 0 -197px;
      width: 22px;
      height: 22px;
    }

    .menuBox li:nth-child(1).active i {
      background: url("../assets/sprit.png") no-repeat 0 -227px;
      width: 22px;
      height: 22px;
    }
    .menuBox li:nth-child(1):hover i{
      background: url("../assets/sprit.png") no-repeat -22px -166px;
      width: 22px;
      height: 22px;
    }
    .menuBox li:nth-child(2).active i{
      background: url("../assets/sprit.png") no-repeat 0 -167px;
      width: 22px;
      height: 22px;
    }
    .menuBox li:nth-child(2):hover i {
      background: url("../assets/sprit.png") no-repeat -24px -197px;
      width: 22px;
      height: 22px;
    }*/

  .menuBox li.active{
    color: #1bacab;
    background: #203140;
    border-left: 6px solid #1bacab
  }
  .menuBox li:hover {
    color:#a1f9f7;
  }

  /*.menuBox li:nth-child(1)*/
  .mainBox {
    background: #f5f5f5;
  }
  #menuBox{overflow:hidden;position:relative;margin-bottom:0.2rem;}
  #menuBoxCont{/*position: absolute;*/width:100%;}

</style>
