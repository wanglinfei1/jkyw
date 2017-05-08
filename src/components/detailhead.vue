<template>
    <div>
      <header class="header">
        <h1 class="logo login"><a href="javascript:;" class="fff"><img src="../assets/logo.png"/>健科电子病历平台</a></h1>
        <h6 class="loginOut size18 fff" @click="exit"><em class="out_icon"></em><i>退出</i></h6>
      </header>
    </div>
</template>
<style>
    .login{
      position: inherit;
    }
    /**修改*/
    .logo img {
      margin: -0.1rem 0.2rem 0 0.52rem;
      width:0.51rem; height:0.49rem;
    }

    .header {
      height: 1rem;
      background: #00bab9;
      box-shadow: 0 1px 16px 4px rgba(10, 117, 113, 0.31);
      width: 100%;
      overflow: hidden;
    }

    .loginOut {
      float: right;
      width: 74px;
      margin-right: 66px;
      line-height: 1rem;
      cursor: pointer;
    }

    .out_icon {
      background: url("../assets/sprit.png") no-repeat 0 -137px;
      height: 27px;
      width: 23px;
      float: left;
      margin-right: 0.14rem;
      margin-top: 0.36rem;
    }

    .loginOut i {
      float: left;
    }

    .logo {
      line-height: 1rem;
      float: left;
    }

    .logo a {
      font-size: 0.28rem;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    }
</style>
<script>
    export default{
       methods:{
         exit(){
           this.$confirm('您确定要退出系统吗?', '提示', {
             confirmButtonText: '确定',
             cancelButtonText: '取消',
             // type: 'warning'
           }).then(() => {
             console.log('跳转登录界面');
             this.$router.push({path: '/'});
             /*this.$message({
              type: 'success',
              message: '删除成功!'
              });*/
           }).catch(() => {
             /*this.$message({
              type: 'info',
              message: '已取消删除'
              });*/
           });
         }
       }
    }

</script>
