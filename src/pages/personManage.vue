<template>
  <section id="PerMan">
    <hgroup>{{this.$store.state.username}}
      <h2>
        <router-link to="/main/personManage" @click="goFirst()">首页</router-link>
        | 人员管理
      </h2>
      <button type="button" class="addbtn" @click="add()"><i></i>新增人员</button>
      <form action="form_action.asp" method="get" class="seach">
        <input type="text" placeholder="输入姓名/身份证号/患者编号快捷查询" v-model="queryStr"/>
        <button type="button" @click="selfsubmit">搜索</button>
      </form>
    </hgroup>
    <template>
      <el-table :data="tableData" style="width:100%">
        <el-table-column prop="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="doctorName" label="姓名"></el-table-column>
        <el-table-column prop="orgName" label="部门"></el-table-column>
        <el-table-column prop="doctorPhone" label="电话"></el-table-column>
        <el-table-column prop="roleName" label="角色"></el-table-column>
        <el-table-column inline-template :context="_self" label="操作" width="300">
          <span>
            <el-button type="text" @click="watch($index,row)">查看</el-button>
            <el-button type="text" @click="edit($index,row)">编辑</el-button>
            <el-button type="text" @click="resize($index,row)">密码重置</el-button>
          </span>
        </el-table-column>
      </el-table>
    </template>
    <div class="block" id="pageToolbar">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page=pageData.now
        :page-size=pageData.size
        layout="prev, pager, next, jumper"
        :total=pageData.total class="ui-paging-container">
      </el-pagination>
    </div>

  </section>

</template>

<script>
  import url from '../url';
  export default {
    data () {
      return {
        queryStr: '',
        orgId:'',
        hospitalId:'',
        roleId:'',
        change:true,
        pageData:{
          now:0,
          size:0,
          total:0,
        },
        tableData: [],
      }
    },
    watch: {
      '$route': 'list'
    },
    mounted(){
      this.list();
    },
    methods: {
      list(){
        //通过url判断查询条件
      this.$route.query.orgId!=undefined?this.orgId=this.$route.query.orgId:this.orgId='';
      this.$route.query.roleId!=undefined?this.roleId=this.$route.query.roleId:this.roleId='';
      this.hospitalId=JSON.parse(sessionStorage.getItem('loginDate')).hospitalId;
      let page=1;
      let pageSize=20;
      this.$http.post(url.url+'/doctor/findDocManList?page='+page+'&pageSize='+pageSize+'&hospitalId='+this.hospitalId+'&roleId='+this.roleId+'&orgId='+this.orgId+'&queryStr='+this.queryStr,{emulateJSON:true}).then((response) => {
        if(response.data.result==200){
          for(var i in response.data.data.list){
            response.data.data.list[i].index=Number(i)+1;
          }
          this.tableData=response.data.data.list;
          this.pageData.now=response.data.data.pageNum;
          this.pageData.size=response.data.data.size;
          this.pageData.total=response.data.data.total;
        }else{
          this.errorInfo = response.data.msg;
        }
      }, (response) => {
        this.errorInfo = '请求失败';
      });


    },
      /*搜索*/
      selfsubmit(){
        //通过url判断查询条件
        this.$route.query.orgId!=undefined?this.orgId=this.$route.query.orgId:this.orgId='';
        this.$route.query.roleId!=undefined?this.roleId=this.$route.query.roleId:this.roleId='';
        this.hospitalId=JSON.parse(sessionStorage.getItem('loginDate')).hospitalId;
        let page=1;
        let pageSize = 5;
        this.$http.post(url.url+'/doctor/findDocManList?page='+page+'&pageSize='+pageSize+'&hospitalId='+this.hospitalId+'&roleId='+this.roleId+'&orgId='+this.orgId+'&queryStr='+this.queryStr,{emulateJSON:true}).then((response) => {
          if(response.data.result==200){
            for(var i in response.data.data.list){
              response.data.data.list[i].index=Number(i)+1;
            }
            this.tableData=response.data.data.list;
            this.pageData.now=response.data.data.pageNum;
            this.pageData.size=response.data.data.size;
            this.pageData.total=response.data.data.total;
          }else{
            this.errorInfo = response.data.msg;
          }
        }, (response) => {
          this.errorInfo = '请求失败';
        });
      },
      add(){  //添加跳转添加界面
        this.$router.push({path: '/main/personManAdd'});
      },
      watch(index, row){ //跳转详情界面
        let id = row.doctorId;
        let roleCode = row.roleCode;
        console.log(id);
        this.$router.push({path: '/main/personManAdd', query: {id: id,roleCode:roleCode,int:'watch'}});
      },
      edit(index, row){  //跳转编辑界面
        let id = row.doctorId;
        let roleCode = row.roleCode;
        console.log(id);
        this.$router.push({path: '/main/personManAdd', query: {id: id,roleCode:roleCode,int:'edit'}});
      },
      resize(index, row){
        let id = row.doctorId;
        console.log(id);
        this.$confirm('是否为"'+row.doctorName+'"重置密码?', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
        }).then(() => {
          this.$http.post(url.url+'/doctor/resetPwd?phone=',row.doctorPhone,{emulateJSON:true}).then((response) => {
            if(response.status==200){
              this.$message({
                type: 'success',
                message: response.data.msg
              });
            }else{
              this.$message({
                type: 'error',
                message: response.data.msg
              });
            }
          }, (response) => {
            this.$message({
              type: 'error',
              message: '请求失败'
            });
          });
        }).catch(() => {
        });
      },
      /*分页*/
      handleCurrentChange(val) {
        let pageSize = 5;
        this.$http.post(url.url+'/doctor/findDocManList?page='+val+'&pageSize='+pageSize+'&hospitalId='+this.hospitalId+'&roleId='+this.roleId+'&orgId='+this.orgId+'&queryStr='+this.queryStr,{emulateJSON:true}).then((response) => {
          if(response.data.result==200){
            for(var i in response.data.data.list){
              if(val>1){
                response.data.data.list[i].index=(val-1)*pageSize+(Number(i)+1);
              }else{
                response.data.data.list[i].index=Number(i)+1;
              }
            }
            this.tableData=response.data.data.list;
          }else{
            this.errorInfo = response.data.msg;
          }
        }, (response) => {
          this.errorInfo = '请求失败';
        });

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

  .main .addbtn {
    margin-bottom: 22px;
  }

  .seach {
    width: 61.2%;
    height: 56px;
    border: 1px solid #00bab9;
    border-radius: 6px;
    margin: 18px auto 40px auto;

  }

  .seach input {
    width: 80%;
    height: 56px;
    background: #fff;
    border: 0;
    border-radius: 6px 0 0 6px;
    padding-left: 31px;
    font-size: 16px;
    color: #c2c2c2;
  }

  .seach button {
    width: 15%;
    height: 57px;
    background: #00bab9;
    border-radius: 0 6px 6px 0;
    border: 0;
    float: right;
    font-size: 18px;
    color: #ffffff;
    cursor: pointer;
  }

  #pageToolbar {
    margin-top: 29px;
  }

  .ui-paging-container {
    color: #666;
    font-size: 16px;
  }

  .ui-paging-container ul {
    overflow: hidden;
    text-align: center;
  }

  .ui-paging-container ul, .ui-paging-container li {
    list-style: none;
  }

  .ui-paging-container li {
    display: inline-block;
    width: 30px;
    height: 30px;
    margin-left: 14px;
    color: #999999;
    font-size: 16px;
    line-height: 30px;
    text-align: center;
  }

  .ui-paging-container li.ui-pager {
    cursor: pointer;
    border: 1px solid #f5f5f5;
  }

  .ui-paging-container li.js-page-prev i {
    width: 9px;
    height: 12px;
    display: inline-block;
    background: url("../assets/sprit.png") 0 -287px no-repeat;
  }

  .ui-paging-container li.js-page-next i {
    width: 9px;
    height: 12px;
    display: inline-block;
    background: url("../assets/sprit.png") -10px -287px no-repeat;
  }

  .ui-paging-container li.ui-pager:hover, .ui-paging-container li.focus {
    background-color: #00bab9;
    color: #FFFFFF;
  }

  .ui-paging-container li.ui-paging-ellipse {
    border: 1px solid #f5f5f5;
  }

  .ui-paging-container li.ui-paging-toolbar {
    width: auto;
    margin-left: 23px;
  }

  .ui-paging-container li.ui-paging-toolbar input {
    text-align: center;
    line-height: 28px;
    height: 28px;
    width: 28px;
    border: 1px solid #00bab9;
    margin-left: 11px;
  }

  .ui-paging-container li.ui-paging-toolbar a {
    margin-left: 7px !important;
    text-decoration: none;
    display: inline-block;
    width: 30px;
    height: 30px;
    margin-left: 14px;
    color: #999999;
    font-size: 16px;
    line-height: 30px;
    text-align: center;
    cursor: pointer;
    border: 1px solid #f5f5f5;
  }

  .ui-paging-container li.ui-pager-disabled, .ui-paging-container li.ui-pager-disabled:hover {
    background-color: #f6f6f6;
    cursor: default;
    border: none;
    color: #ddd;
  }

  #PerMan .addbtn {
    margin-top: 28px;
  }

  .el-table__body .el-button {
    color: #01b7b8;
    margin-right: 30px;
  }

</style>
