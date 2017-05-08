<template>
  <section id="PerMan">
    <hgroup>
      <h2><router-link to="/main/personManage">首页</router-link> | 机构管理</h2>
      <button type="button" class="addbtn" @click="add"><i></i>新增部门</button>
    </hgroup>
    <template>
      <el-table :data="tableData" class="branchTable" style="width:100%">
        <el-table-column prop="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="orgName" label="部门姓名"></el-table-column>
        <el-table-column  label="人数"  inline-template :context="_self" >
          <span>
           <el-button   type="text" @click="editPeople($index,row)"  :class="{color:color}">{{row.count}}</el-button>
          </span>
        </el-table-column>
        <el-table-column inline-template :context="_self" label="操作">
          <span>
            <el-button type="text" @click="edit($index,row)">编辑</el-button>
            <el-button type="text" @click="remove($index,row)">删除</el-button>
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
    <!--表单编辑弹框-->
    <el-dialog class='dialogBranEdit' title="部门管理|编辑" v-model="dialogBran" ref="dialogBran">
      <el-form :model="form">
        <el-input type='hidden' v-model="form.id" ></el-input>
        <el-input type='hidden' v-model="form.nodes" ></el-input>
        <el-form-item label="部门" :label-width="formLabelWidth" >
          <el-input v-model="form.name" auto-complete="off" :class="{wrong:wrong}" @blur.stop="checkRule"></el-input>
          <div class="FerrorNew cont" :class="{conts:conts}"><i class="MarR8">-</i>
            <span  class="floatL">{{errorText}}</span>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogBran = false">取 消</el-button>
        <el-button type="primary" @click="editOk">确 定</el-button>
      </div>
    </el-dialog>
    <!--表单新增弹框-->
    <el-dialog class='dialogBranNew' title="部门管理|添加" v-model="dialogBranNew"  size="tiny">
      <el-form >
        <div class="NewWapper" v-for="(todo,key) in todos">
          <el-form-item label="部门" :label-width="formLabelWidth" >
            <el-input v-model="todo.name" auto-complete="off" :class="{wrong:todo.wrong}"
                      @click.stop="miss"></el-input>
          </el-form-item>
          <i class="addBranch" @click="addTodo" :class="{show:todo.show}">+</i>
          <div class="FerrorNew cont" :class="{conts:todo.conts}"><i class="MarR8">-</i><span
            class="floatL">{{todo.text}}</span>
         </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogBranNew = false">取 消</el-button>
        <el-button type="primary" @click="newOk">确 定</el-button>
      </div>
    </el-dialog>
  </section>

</template>

<script>
  import url from '../url';
  export default {
    data () {
      return {
        query: '',
        change:true,
        conts: false,
        wrong: false,
        errorText:'',
        NowPage:'',
        pageData:{
          now:0,
          size:0,
          total:0,
        },
        tableData: [],
        dialogBran: false,
        dialogBranNew:false,
        hospitalId:'',
        color:false,
        form: {
          name: '',
          id:'',
          nodes:''
        },
        todos: [{'name':'','show':true, 'conts': false, 'wrong': false,'text':''}],
        formLabelWidth: '120px'
      }
    },
    mounted(){
      let page=1;
      let pageSize=20;
      this.hospitalId=JSON.parse(sessionStorage.getItem('loginDate')).hospitalId;
      this.$http.post(url.url+'/org/findOrgs?page='+page+'&pageSize=' + pageSize + '&hospitalId='+this.hospitalId, {emulateJSON: true}).then((response) => {
        if (response.data.result == 200) {
          for(var i in response.data.data.list){
            response.data.data.list[i].index=Number(i)+1;
          }
          this.tableData=response.data.data.list;
          this.pageData.now=response.data.data.pageNum;
          //console.log(response.data.data.pageNum)
          this.pageData.size=response.data.data.size;
          this.pageData.total=response.data.data.total;
        } else {
          this.errorInfo = response.data.msg;
        }
      }, (response) => {
        this.errorInfo = '请求失败';
      });
    },
    methods: {
      /*编辑*/
      edit(index, row){ //表格编辑打开弹窗并记录当前条数据
        let id = row.id; //单条部门的id
        let nodes=row; //存放后面修改时取值用
        this.dialogBran=true;
        this.form.id=id;
        this.form.nodes=nodes;
        this.form.name=row.orgName;//返显部门
        this.conts=false;
        this.wrong=false;
        this.errorText='';
      },
      editOk(){ //编辑提交接口
        //是否修改/修改后是否跟数据库重复
        if(this.form.nodes.orgName.trim()==this.form.name.trim()){
          this.conts=false;
          this.wrong=false;
          this.errorText='';
          this.dialogBran=false;
        }else{
          this.$http.post(url.url+'/org/exit?orgName='+this.form.name.trim()+'&hospitalId='+this.hospitalId,{emulateJSON:true}).then((response) => {
            if(response.data.result==200){
              if(!response.data.data){   //如果没重复
                this.conts=false;
                this.wrong=false;
                this.errorText='';
                this.dialogBran=false;
                this.$http.post(url.url+'/org/updateOrg?orgid='+this.form.id+'&orgName='+this.form.name+'',{emulateJSON:true}).then((response) => {
                  if(response.data.result==200){
                    this.form.nodes.orgName=this.form.name;
                  }else{
                    this.errorInfo = response.data.msg;
                  }
                }, (response) => {
                  this.errorInfo = '请求失败';
                });
              }else{    //如果存在
                this.conts=true;
                this.wrong=true;
                this.errorText='部门名称已存在,请重新输入';
                return;
              }
            }else{
              this.$message({
                type: 'success',
                message: '请求失败!'
              });
            }
          }, (response) => {
            this.errorInfo = '请求失败';
          });
        }
      },
      /*添加*/
      add(){
        this.dialogBranNew=true;
        this.todos=[{'name':'','show':true, 'conts': false, 'wrong': false,'text':''}];
      },
      addTodo() {  //添加窗口里点击添加一行
        //判重接口
        if(this.todos[this.todos.length-1].name==''){
          this.todos[this.todos.length-1].conts=true;
          this.todos[this.todos.length-1].wrong=true;
          this.todos[this.todos.length-1].text='请输入部门名称';
          return;
        }else{  //不为空进行判重
          if(this.todos.length>1){
            for(let i=0; i<this.todos.length;i++){
              if(this.todos[this.todos.length-1].name==this.todos[i].name){
                this.todos[this.todos.length-1].conts=true;
                this.todos[this.todos.length-1].wrong=true;
                this.todos[this.todos.length-1].text='部门名称已存在,请重新输入';
                return;
              }
            }
          }
          this.$http.post(url.url+'/org/exit?orgName='+this.todos[this.todos.length-1].name+'&hospitalId='+this.hospitalId,{emulateJSON:true}).then((response) => {
            if(response.data.result==200){
              if(!response.data.data){   //如果没重复
                this.todos[this.todos.length-1].conts=false;
                this.todos[this.todos.length-1].wrong=false;
                this.todos[this.todos.length-1].text='';
                this.todos.push({name: this.todo,show:true,conts: false, wrong: false,'text':''});
                this.todo = '';
                for(var i=0;i<this.todos.length-1;i++){
                  this.todos[i].show=false;
                }
                //console.log(this.todos);
              }else{    //如果存在
                this.todos[this.todos.length-1].conts=true;
                this.todos[this.todos.length-1].wrong=true;
                this.todos[this.todos.length-1].text='部门名称已存在,请重新输入';
                return;
              }
            }else{
              this.$message({
                type: 'success',
                message: '请求失败!'
              });
            }
          }, (response) => {
            this.errorInfo = '请求失败';
          });
        }

      },
      newOk(){  //添加窗口点击提交
        //示例：params={"hospitalId":112,"names":["小儿科","精神科","骨科"]}
        let datas=new Array();
        for(var i=0;i<this.todos.length;i++){
          if(this.todos[i].name!=undefined && this.todos[i].name!=''){
            datas.push(this.todos[i].name)
          }
        }
        let params={"hospitalId":this.hospitalId,"names":datas};
        params=encodeURIComponent(JSON.stringify(params));
        //前台判断防止快速点击重复提交
        this.$http.post(url.url+'/org/addOrg?params='+params,{emulateJSON:true}).then((response) => {
          if(response.data.result==200){
            //再次初始化表格
            let page=this.NowPage;
            let pageSize=20;
            this.$http.post(url.url+'/org/findOrgs?page='+page+'&pageSize=' + pageSize + '&hospitalId='+this.hospitalId, {emulateJSON: true}).then((response) => {
              if (response.data.result == 200) {
                for(var i in response.data.data.list){
                  if(page>1){ //序号
                    response.data.data.list[i].index=(page-1)*pageSize+(Number(i)+1);
                  }else{
                    response.data.data.list[i].index=Number(i)+1;
                  }
                }
                this.tableData=response.data.data.list;
                this.dialogBranNew=false;
              } else {
                this.errorInfo = response.data.msg;
              }
            }, (response) => {
              this.errorInfo = '请求失败';
            });
          }else{
            this.errorInfo = response.data.msg;
          }
        }, (response) => {
          this.errorInfo = '请求失败';
        });
      },

      /*表格编辑人数接口*/
      editPeople(index, row){ //表格编辑人数接口
        this.$store.commit('add',true)
        let id = row.id;
       // let url='/main/personManage?orgId='+id;
       // debugger;
        this.$router.push({path: '/main/personManage', query: {orgId: id}});
      },
      /*表格删除接口*/
      remove(index, row){  //表格删除接口
        let id = row.id;
        console.log(id);
        if(row.count>0){
          this.$confirm('该机构内有关联人员，请至“人员管理”中取消关联', '信息', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
          }).then(() => {
             this.$router.push({path: '/main/personManage', query: {orgId: id}});
          }).catch(() => {
          });
        }else{
          this.$confirm('是否删除"'+row.orgName+'"部门?', '部门管理|删除', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            // type: 'warning'
          }).then(() => {
             //删除接口
            this.$http.get(url.url+'/org/deleteOrg/'+id+'',{emulateJSON:true}).then((response) => {
              if(response.data.result==200){
               // this.tableData.splice(index,1);
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                //再次初始化表格
                let page=this.NowPage; //获取当前页进行刷新
                let pageSize=20;
                this.$http.post(url.url+'/org/findOrgs?page='+page+'&pageSize=' + pageSize + '&hospitalId='+this.hospitalId, {emulateJSON: true}).then((response) => {
                  if (response.data.result == 200) {
                    for(var i in response.data.data.list){
                      if(page>1){ //序号
                        response.data.data.list[i].index=(page-1)*pageSize+(Number(i)+1);
                      }else{
                        response.data.data.list[i].index=Number(i)+1;
                      }
                    }
                    this.tableData=response.data.data.list;
                  } else {
                    this.$message({
                      type: 'error',
                      message:response.data.msg
                    });
                  }
                }, (response) => {
                  this.$message({
                    type: 'error',
                    message:'请求失败'
                  });
                });

              }else{
                this.$message({
                  type: 'success',
                  message: '删除失败!'
                });
              }
            }, (response) => {
              this.errorInfo = '请求失败';
            });
          }).catch(() => {
            /*this.$message({
             type: 'info',
             message: '已取消删除'
             });*/
          });
        }

      },
      /*分页*/
      handleCurrentChange(val) {
        let pageSize = 20;
        this.NowPage=val;
        this.$http.post(url.url+'/org/findOrgs?page='+val+'&pageSize=' + pageSize + '&hospitalId='+this.hospitalId, {emulateJSON: true}).then((response) => {
          if (response.data.result == 200) {
            for(var i in response.data.data.list){
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
      },
      miss(){
        this.conts = false;
        this.wrong = false;
      },
      checkRule(){
        if(this.form.name.trim()==''){
          this.conts=true;
          this.wrong=true;
          this.errorText='请输入部门名称';
          return;
        }else{
          this.conts=false;
          this.wrong=false;
          this.errorText='';
        }
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
    padding-left: 33px;
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
  #PerMan .addbtn{margin-top:28px;}
  .el-table__body .el-button{color:#01b7b8;margin-right:30px;}
.dialogBranNew
  .NewWapper{position: relative}
  .NewWapper .addBranch{border-radius:50%;position: absolute;right:-30px;width:30px;font-size:30px;height:30px;border:1px solid #02bab8;text-align: center;line-height: 24px;
    color:#02bab8;top:3px;display:none;cursor:pointer;}
  .NewWapper input{width:78%}
  .NewWapper{width:60%}
  .NewWapper .show{display:block;}

  .cont {
    height: 0;
    overflow: hidden;
    transition: height 0.5s;
    background: #ffffff;
    box-shadow:none
  }

  .conts {
    height: 20px;
    width:195px;
  }
  .FerrorNew{left:120px;}
  .dialogBranEdit .FerrorNew{left:0;}
  .color{color:#02bcb9}
  .wrong{
    border-color: #f4704a !important;
  }
</style>
