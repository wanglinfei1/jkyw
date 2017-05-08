<template>
        <section>
          <hgroup>
            <h2><router-link to="/main">首页</router-link> | 病例管理</h2>
            <form action="form_action.asp" method="get" class="seach">
              <input type="text" placeholder="输入姓名/身份证号/患者编号快捷查询" v-model="query"/>
              <button type="button" @click="selfsubmit">搜索</button>
            </form>
          </hgroup>
          <template>
            <el-table :data="tableData" style="width:100%">
              <el-table-column prop="index" label="序号" width="80"></el-table-column>
              <el-table-column prop="subDate" label="提交日期"></el-table-column>
              <el-table-column prop="patientName" label="患者姓名"></el-table-column>
              <el-table-column prop="sexName" label="性别"></el-table-column>
              <el-table-column prop="age" label="年龄"></el-table-column>
              <el-table-column prop="practiceTypeName" label="类别"></el-table-column>
              <el-table-column prop="diagnosis" label="初步诊断"></el-table-column>
              <el-table-column inline-template :context="_self" label="操作">
                  <span>
                    <el-button type="text" @click="watch($index,row)">查看</el-button>
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
        query: '',
        change:true,
        pageData:{
          now:0,
          size:0,
          total:0,
        },
        tableData: [],
      }
    },
    mounted(){
      let page=1;
      let pageSize=20;
      this.$http.post(url.url+'/patientcase?page='+page+'&pageSize='+pageSize+'&status=1',{emulateJSON:true}).then((response) => {
        if(response.data.result==200){
          for(var i in response.data.data.list){
           // response.data.data.list[i].sexName==0?response.data.data.list[i].sexName='男':response.data.data.list[i].sexName='女';
           //console.log(response.data.data)
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
    methods: {
      /*搜索*/
      selfsubmit(){

      },
      /*查看跳转页面*/
      watch(index, row){
        let id = row.patientId;
        this.$router.push({path: '/main/checkcase', query: {id: id}});
      },
      /*分页*/
      handleCurrentChange(val) {
        let pageSize = 20;
        this.$http.post(url.url+'/patientcase?page='+val+'&pageSize=' + pageSize + '&status=1', {emulateJSON: true}).then((response) => {
          if (response.data.result == 200) {
            for(var i in response.data.data.list){
             // response.data.data.list[i].sexName==0?response.data.data.list[i].sexName='男':response.data.data.list[i].sexName='女';
              if(val>1){
                response.data.data.list[i].index=(val-1)*pageSize+(Number(i)+1);
              }else{
                response.data.data.list[i].index=Number(i)+1;
              }
            }
            this.tableData=response.data.data.list;
          } else {
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
    width: 950px;
    height: 56px;
    border: 1px solid #00bab9;
    border-radius: 6px;
    margin: 18px auto 40px auto;

  }

  .seach input {
    width: 777px;
    height: 56px;
    background: #fff;
    border: 0;
    border-radius: 6px 0 0 6px;
    padding-left: 33px;
    font-size: 16px;
    color: #c2c2c2;
  }

  .seach button {
    width: 140px;
    height: 57px;
    background: #00bab9;
    border-radius: 0 6px 6px 0;
    border: 0;
    float: right;
    font-size: 18px;
    color: #ffffff;cursor:pointer;
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


</style>
