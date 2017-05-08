<template>
  <section id="PerManAdd">
    <hgroup>
      <h2><router-link to="/main/personManage">首页</router-link> | <router-link to="/main/personManage">人员管理</router-link> | {{indexText}}</h2>
    </hgroup>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px"
             class="demo-ruleForm detailF" :class="{clearBor:clearBor}">
      <el-input type="hidden"  v-model="ruleForm.hospitalId"></el-input>
      <el-input type="hidden"  v-model="ruleForm.userId"></el-input>
      <el-input type="hidden"  v-model="ruleForm.doctorId"></el-input>
      <el-row :gutter="12">
        <el-col :span="5">
          <el-form-item label="姓名" prop="patientName">
            <el-input  :disabled='disabled' v-model="ruleForm.doctorName"></el-input> <!--:disabled='c'-->
          </el-form-item>
        </el-col>
        <el-col :span="2">
        </el-col>
        <el-col :span="5">
          <el-form-item label="手机号码" prop="doctorPhone">
            <el-input :disabled='disabled' v-model="ruleForm.doctorPhone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="12">
        <el-col :span="5">
          <div class="form-group clearfix floatL MarTop40 MarR8">
            <label class="floatL wid"><i class="stars">*</i>部门</label>
            <div class="inputBox floatL">
              <select class="form-control  W158" :disabled='disabled' v-model="ruleForm.orgId" :class="{wrong:wrong}"
                      @click.stop="miss">
                <option value="">请选择部门</option>
                <option value="4602467200671984">骨科</option>
                <option value="4601262809784560">耳科</option>
                <option value="4601262809800944">神经科</option>
              </select>
              <div class="FerrorNew cont" :class="{conts:conts}"><i class="MarR8">-</i><span
                class="floatL">请选择部门</span></div>
            </div>
          </div>
        </el-col>
        <el-col :span="2">
        </el-col>
        <el-col :span="5">
          <div class="form-group clearfix floatL MarTop40 MarR8">
            <label class="floatL wid"><i class="stars">*</i>角色</label>
            <div class="inputBox floatL">
              <select class="form-control" :disabled='disabled' v-model="ruleForm.roleId" :class="{wrong1:wrong1}" @click.stop="miss1">
                <option value="">请选择角色</option>
                <option value="4602672461553904">职员</option>
                <option value="4601053465125104">管理员</option>
              </select>
              <div class="FerrorNew cont" :class="{conts1:conts1}"><i class="MarR8">-</i><span
                class="floatL">请选择角色</span></div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-col :span="20">
        <el-form-item>
          <template v-if="type == 'watch'" ><!--普通用户查看-->
            <el-button  class="MarB50" type="primary" @click="handleEdit">编辑</el-button>
            <el-button  class="el-button el-button--cancle MarB50" @click="PerDel">删除</el-button>
          </template>
          <template v-else-if="type == 'Iwatch'"><!--管理员查看-->
            <el-button  class="MarB50" type="primary" @click="handleTrans">权限转移</el-button>
            <el-button  class="el-button el-button--cancle MarB50" @click="cancle">取消</el-button>
          </template>
          <template v-else><!--编辑新增提交-->
            <el-button  class="MarB50" type="primary" @click="handleSubmit">提交</el-button>
            <el-button  class="el-button el-button--cancle MarB50" @click="cancle">取消</el-button>
          </template>
        </el-form-item>
      </el-col>
    </el-form>

    <!--权限转移弹窗-->
    <el-dialog title="权限转移" v-model="dialogTableVisible" size="tiny">
      <form class="seach">
        <input type="text" v-model="queryStr"/>
        <button type="button" @click="seachbtn">搜索</button>
      </form>
      <h2>人员选择</h2>
      <el-table :data="gridData" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column property="doctorName" label="姓名"></el-table-column>
        <el-table-column property="roleName" label="职称"></el-table-column>
        <el-table-column property="orgName" label="科室"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogTableVisibleSmit">确 定</el-button>
      </div>
    </el-dialog>


  </section>

</template>

<script>
  import url from '../url';
  export default {
    data () {
     let checkPhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入手机号'));
        }
        if (/^(1[3|5|8|7]{1}\d{9})$/.test(value)) {
          callback();
        } else {
          callback(new Error('请输入正确的手机号'));
        }
      };
      return {
        conts: false,
        wrong: false,
        conts1: false,
        wrong1: false,
        queryStr:'',
        type:'watch',
        clearBor:true,
        disabled:false,
        indexText:'添加',
        hospitalId:'',
        ruleForm: {
          hospitalId:'',
          userId:'',
          doctorId:'',
          doctorName: '',
          orgId: '',
          roleId:'',
          doctorPhone: '',
          id:''},
        rules: {
          doctorName: [
            {required: true, message: '请输入姓名'},
            {max: 20, message: '超长'}
          ],
          doctorPhone: [
            {required: true,validator: checkPhone,trigger: 'blur'}
          ]
        },
        queryStr:'',
        gridData: [],
        dialogTableVisible: false,
        transData:''
      };
    },
    mounted(){      //初始化界面
      this.hospitalId=JSON.parse(sessionStorage.getItem('loginDate')).hospitalId;
      this.c=this.$route.query.id; //医生id
      this.ruleForm.hospitalId=JSON.parse(sessionStorage.getItem('loginDate')).hospitalId; //赋值hospitalId新建编辑提交需要
      this.ruleForm.userId=JSON.parse(sessionStorage.getItem('loginDate')).userId;
      if (!this.c) { //新建
       // this.ruleForm.doctorName=sessionStorage.getItem('user');
        this.indexText="添加";
        this.type="Edit";
        this.disabled=false;
        this.clearBor=false;
        return
      } else {  //编辑和查看
        let int=this.$route.query.int;
        this.ruleForm.doctorId=this.$route.query.id; //赋值hospitalId编辑提交需要
        this.$http.post(url.url+'/doctor/view/'+this.$route.query.id+'').then((response) => { //编辑还有往表单加传的参数
          if(response.status==200){
            this.ruleForm.doctorId=response.data.data.orgRoleDTOList[0].doctorId;
            this.ruleForm.doctorName=response.data.data.doctorInfo.doctorName;
            this.ruleForm.doctorPhone=response.data.data.doctorInfo.phone;
            this.ruleForm.orgId=response.data.data.orgRoleDTOList[0].orgId;
            this.ruleForm.roleId=response.data.data.orgRoleDTOList[0].roleId;
            //this.ruleForm.orgId=4601262809800944;
            //this.ruleForm.roleId=4602672461553904;
          }else{
            this.isActive = false;
            this.errorInfo = response.data.msg;
          }
        }, (response) => {
          this.isActive = false;
          this.errorInfo = '请求失败';
        });
       //查看,分系统管理员和普通
        if(int=='watch'){
          this.indexText="查看";
          if(this.$route.query.roleCode=='admin'){ //是否系统管理员
            this.type="Iwatch";
          }else{
            this.type="watch";
          }
          this.disabled=true;
          this.clearBor=true;
        }else{  //编辑
          //接口返显
           this.indexText="编辑";
           this.type="Edit";
           this.disabled=false;
           this.clearBor=false;
        }
      }
    },
    methods: {
      miss(){
        this.conts = false;
        this.wrong = false;
      },
      miss1(){
        this.conts1 = false;
        this.wrong1 = false;
      },
      cancle(){  //取消
        this.$router.push({path: '/main/personManage'});
      },
      handleEdit(){ //查看详情界面点击编辑-转换成编辑模式并且变成编辑模式的按钮
        this.indexText="编辑";
        this.disabled=false;
        this.clearBor=false;
        this.type="Edit";
      },
      handleTrans(){ //权限转移
        return;
        this.dialogTableVisible=true;
        //通过url判断查询条件
        this.$route.query.orgId!=undefined?this.orgId=this.$route.query.orgId:this.orgId='';
        this.$route.query.roleId!=undefined?this.roleId=this.$route.query.roleId:this.roleId='';
        this.hospitalId=JSON.parse(sessionStorage.getItem('loginDate')).hospitalId;
        let page=1;
        let pageSize = 40;
        this.$http.post(url.url+'/doctor/findDocManList?page='+page+'&pageSize='+pageSize+'&hospitalId='+this.hospitalId+'&roleId='+this.roleId+'&orgId='+this.orgId+'&queryStr='+this.queryStr,{emulateJSON:true}).then((response) => {
          if(response.data.result==200){
            this.gridData=response.data.data.list;
          }else{
            this.$message({
              type: 'error',
              message: response.data.msg
            });
          }
        }, (response) => {
          this.$message({
            type: 'error',
            message: '请求失败!'
          });
        });
      },
      PerDel(){ //普通用户删除
        this.$confirm('是否删除该人员?', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
        }).then(() => {
          this.$http.post(url.url+'/doctor/delete',this.ruleForm,{emulateJSON:true}).then((response) => {
            if(response.status==200){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.$router.push({path: '/main/personManage'});
            }else{
              this.$message({
                type: 'error',
                message: '删除失败!'
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
      handleSubmit(ev) {     //新增和修改提交接口
        let isBtn=this.indexText;
        let self = this;
        if(isBtn=='编辑'){
          this.$refs.ruleForm.validate((valid) => {
            if (valid) {
              if (self.ruleForm.orgId != ''&& self.ruleForm.roleId != '' || self.ruleForm.orgId == ''&& self.ruleForm.roleId == '') {  //如果部门和角色不为空
                self.conts = false;
                self.wrong = false;
                self.conts1 = false;
                self.wrong1 = false;
                this.$http.post(url.url+'/doctor/put',self.ruleForm,{emulateJSON:true}).then((response) => {
                  if(response.status==200){
                    self.$router.push({path: '/main/personManage'});
                  }else{
                    this.$message({
                      type: 'error',
                      message:response.msg
                    });
                  }
                }, (response) => {
                  this.isActive = false;
                  this.errorInfo = '请求失败';
                });
              }else{
                if(self.ruleForm.orgId == ''){
                  self.conts = true;
                  self.wrong = true;
                }
                if(self.ruleForm.roleId == ''){
                  self.conts1 = true;
                  self.wrong1 = true;
                }
              }
            }
          });
        }else{  //添加
          this.$refs.ruleForm.validate((valid) => {
            if (valid) {
              if (self.ruleForm.orgId != ''&& self.ruleForm.roleId != '' || self.ruleForm.orgId == ''&& self.ruleForm.roleId == '') {  //如果部门和角色不为空
                self.conts = false;
                self.wrong = false;
                self.conts1 = false;
                self.wrong1 = false;
                this.$http.post(url.url+'/doctor/add',self.ruleForm,{emulateJSON:true}).then((response) => {
                  if(response.data.result==200){
                    self.$router.push({path: '/main/personManage'});
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
                if(self.ruleForm.orgId == ''){
                  self.conts = true;
                  self.wrong = true;
                }
                if(self.ruleForm.roleId == ''){
                  self.conts1 = true;
                  self.wrong1 = true;
                }
              }
            }
          });
        }

      },
      handleSelectionChange(val) { //权限转移窗口 选取表格行
        val.length>1?this.multipleSelection = val.splice(0,1):this.multipleSelection = val;
        console.log(JSON.stringify(val))
        this.transData=JSON.stringify(val);
      },
      seachbtn(){   //权限转移窗口 搜索人员
        this.$route.query.orgId!=undefined?this.orgId=this.$route.query.orgId:this.orgId='';
        this.$route.query.roleId!=undefined?this.roleId=this.$route.query.roleId:this.roleId='';
        let page=1;
        let pageSize = 40;
        let self = this;
        this.$http.post(url.url+'/doctor/findDocManList?page='+page+'&pageSize='+pageSize+'&hospitalId='+this.hospitalId+'&roleId='+this.roleId+'&orgId='+this.orgId+'&queryStr='+this.queryStr,{emulateJSON:true}).then((response) => {
          if(response.data.result==200){
            this.gridData=response.data.data.list;
          }else{
            this.$message({
              type: 'error',
              message: response.data.msg
            });
            self.$router.push({path: '/main/personManage'});
          }
        }, (response) => {
          this.$message({
            type: 'error',
            message: '请求失败!'
          });
        });
      },
      dialogTableVisibleSmit(){  //权限转移窗口 提交
        let params={"hospitalId":this.hospitalId,"newAdminId":eval(this.transData)[0].doctorId};
        params=encodeURIComponent(JSON.stringify(params));
        this.$http.post(url.url+'/role/transfer?params='+params,{emulateJSON:true}).then((response) => {
          if(response.data.result==200){
            this.$message({
              type: 'success',
              message: response.data.msg
            });
            this.dialogTableVisible=false;
            this.$router.push({path: '/main/personManage'});
          }else{
            this.$message({
              type: 'error',
              message: response.data.msg
            });
          }
        }, (response) => {
          this.$message({
            type: 'error',
            message: '请求失败!'
          });
        });
           debugger;
      }
    },
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .form-group{
    width:250px;
  }
  .form-group label{
    width:88px!important;padding: 0px 12px 11px 0;margin-right:0;
  }
  .form-group .inputBox {
    width: 49%;}
  .cont {
    height: 0;
    overflow: hidden;
    transition: height 0.5s;
    background: #ffffff;
    box-shadow:none
  }
  .FerrorNew {
    position: absolute;
    color: #ec6941;
    line-height: 1;
    font-size: 14px;
    top: 40px;
  }

  .FerrorNew i {
    width: 16px;
    height: 16px;
    background: #ec6941;
    float: left;
    border-radius: 50%;
    text-align: center;
    font-size: 24px;
    line-height: 12px;
    font-weight: bold;
    color: #fff
  }
  .wrong,.wrong1 {
    border-color: #f4704a !important;
  }
  .conts,.conts1 {
    height: 20px;
  }
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


  #PerMan .addbtn{margin-top:28px;}
  .el-table__body .el-button{color:#01b7b8;margin-right:30px;}


</style>
