
<template>
        <section>
          <hgroup>
            <h2><router-link to="/main">首页</router-link> | 诊疗管理</h2>
            <button type="button" class="addbtn" @click="add()"><i></i>新增病例</button>
          </hgroup>
          <template>
            <el-table :data="tableData" style="width: 100%">
              <el-table-column prop="index" label="序号" width="80"></el-table-column>
              <el-table-column prop="subDate" label="提交日期" ></el-table-column>
              <el-table-column prop="patientName" label="患者姓名" ></el-table-column>
              <el-table-column prop="sexName" label="性别" ></el-table-column>
              <el-table-column prop="age" label="年龄" ></el-table-column>
              <el-table-column :context="_self" inline-template label="操作">
                <div>
                  <el-button type="text"  size="small" @click="handleEdit($index, row)">
                    编辑
                  </el-button>
                </div>
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
    data(){
      return {
        pageData:{
          now:0,
          size:0,
          total:0,
        },
        tableData: [],
      };
    },
    mounted(){
      let page=1;
      let pageSize=20;
      this.$http.post(url.url+'/patientcase?page='+page+'&pageSize='+pageSize+'&status=0', {emulateJSON:true}).then((response) => {
        if(response.data.result==200){
            for(var i in response.data.data.list){
              response.data.data.list[i].index=Number(i)+1;
            }
          this.tableData=response.data.data.list;
          this.pageData.now=response.data.data.pageNum;
          this.pageData.size=response.data.data.size;
          this.pageData.total=response.data.data.total;
        }else{
              this.isActive = false;
              this.errorInfo = response.data.msg;
        }
      }, (response) => {
             this.isActive = false;
             this.errorInfo = '请求失败';
      });
    },
    methods: {
      add(){
        this.$router.push({path: '/main/newcase'});
      },
      handleEdit(index, row) {
        let isId=row.id;
        sessionStorage.setItem('doc_time',row.subDate);
        this.$router.push({path: '/main/newcase', query: {id: isId}});
      },
      handleCurrentChange(val) {
        let pageSize=20;
        this.$http.post(url.url+'/patientcase?page='+val+'&pageSize='+pageSize+'&status=0', {emulateJSON:true}).then((response) => {
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
            this.isActive = false;
            this.errorInfo = response.data.msg;
          }
        }, (response) => {
          this.isActive = false;
          this.errorInfo = '请求失败';
        });
      }
    }
  }
</script>

<style scoped>
#menuBoxCont li:nth-of-type(1){}

.main h2 {
    font-size: 20px;
    padding-top: 36px;
  }

  .main .addbtn {
    margin-bottom: 22px;
  }

  .main table {
    border-width: 1px;
    border-color: #a9c6c9;
    border-collapse: collapse;
    background: #fff;
    width: 1530px;
  }

  .main table th {
    background: #f9fafc;
    height: 69px;
    font-size: 18px;
    color: #666666;
  }

  .main table td {
    border-bottom: 1px solid #f5f5f5;
    height: 55px;
    text-align: center;
    font-size: 16px;
    color: #999999;
  }

  .main table td a {
    color: #00bab9;
    cursor: pointer;
  }

  .addbtn {
    width: 128px;
    height: 46px;
    border: 1px solid #00bab9;
    font-family: microsoft yahei, sans-serif;
    border-radius: 6px;
    font-size: 16px;
    color: #00bab9;
    background: #fff;
    float: right;
  }

  .addbtn i {
    width: 20px;
    height: 20px;
    display: inline-block;
    background: url("../assets/sprit.png") 0 -304px no-repeat;
    margin-right: 7px;
    vertical-align: middle;
  }

  .addbtn:hover {
    background: #00bab9;
    color: #fff
  }

  .addbtn:hover i {
    background: url("../assets/sprit.png") 0 -328px no-repeat;
  }


</style>
