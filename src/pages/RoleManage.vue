<template>

  <section>
    <hgroup class="mainTop">
      <h2>
        <router-link to="/main/personManage">首页</router-link>| 角色管理
      </h2>
      <button type="button" class="addbtn" @click="add()"><i></i>新增角色</button>
    </hgroup>
    <div class="mainBottom">
      <article class="mainBottom_con1">
        <el-row :gutter="20">
          <el-col :span="11">
            <div class="grid-content bg-purple" v-for="(i,indexC) in glylist">
              <h2>{{i.roleName}}<i><span>(</span>{{i.total}}<span>)</span></i></h2>
              <h3><b @click="Pertransfer">权限移除</b><span class="slide" @click="show" :class="{up:JuUp,down:JuDown}"></span></h3>
            </div>
            <aside class="mainBottom_con1_show" v-show="JuTree">
              <ul id="tree" v-for="(a,index) in this.regions">
                <li class="item">
                  <p>
                    <span class="con1" :class="{ con1Active:a.checked }"></span>{{a.name}}
                  </p>
                  <ul v-if="a.obj" class="clearfix">
                    <li class="item" v-for="(b,indexs) in a.obj">
                      <p>
                        <span class="con1" :class="{ con1Active:b.checked }"></span>{{b.name}}
                      </p>
                    </li>
                  </ul>
                </li>
              </ul>
            </aside>
          </el-col>
        </el-row>
      </article>

      <article class="mainBottom_con2">
        <div v-for="(i,indexB) in arrlist">
          <el-form>
            <el-col :span="11" style="margin-right:20px;">
              <rolePan :message="i" :mess="indexB" :arr="arrlist">
              </rolePan>
            </el-col>
          </el-form>
        </div>
      </article>

    </div>
    <!--弹框-->
    <el-dialog title="收货地址" v-model="dialogTableVisible" size="tiny">
      <form class="seach">
        <input type="text" v-model="seachName"/>
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
    <!--弹框end-->
  </section>

</template>

<script>
  /*引进主键*/
  import rolePan from '../components/role-pan.vue';
  import url from '../url';
  export default {
    data () {
      return {
        JuUp: true,
        JuDown: false,
        JuTree: false,
        seachName: '',
        hospitalId:'',
        roleId:'',
        orgId:'',
        glylist:[],
        arrlist: [],
        in:[{menuName:'诊疗管理'},{menuName:'新增'}],
        regions: [{
          name: '诊疗管理',
          id: '01',
          checked:false,
          obj: [
            {
              name: '新增',
              id: '011',
              checked: false
            },
            {
              name: '暂存',
              id: '012',
              checked: false
            }
          ]
        },
          {
            name: '病例管理',
            id: '02',
            checked:false,
            obj: [
              {
                name: '查看',
                id: '021',
                checked:false
              }
            ]
          }],
        gridData: [],
        multipleSelection: '',
        dialogTableVisible: false,
        transData:'',
      }
    },
    /*当引进一个自定义主键的时候需要在这注册一下*/
    components: {rolePan},
    /*页面初始化*/
    mounted(){
      this.hospitalId= JSON.parse(sessionStorage.getItem('loginDate')).hospitalId ;
      this.$http.post(url.url+'/role/queryRoleList/'+this.hospitalId, {emulateJSON:true}).then((response) => {
        if(response.data.result==200){
          for(var i in response.data.data){
            if(response.data.data[i].roleCode=='admin' && response.data.data[i].roleCode!=null){
                this.glylist.push(response.data.data[i]);
                //console.log(this.glylist)
            }else{
                this.arrlist.push(response.data.data[i]);
                //console.log(this.arrlist)
            }
          }
        }else{
          this.errorInfo = response.data.msg;
        }
      }, (response) => {
        this.errorInfo = '请求失败';
      });
    },
    methods: {
      /*跳转新增角色页面*/
      add(){
        this.$router.push({path: '/main/newRole'});
      },
      /*点击显示角色权限*/
      show(){
        this.JuTree = !this.JuTree;
        this.JuUp = !this.JuUp;
        this.JuDown = !this.JuDown;
        this.$http.get(url.url+'/menu/queryByRoleId/'+this.glylist[0].id,{emulateJSON:true}).then((response) => {
          if(response.status==200){
            response.data.data=this.in;
            //debugger;
            /*返现角色权限*/
            for(var d in response.data.data){
              for(var c in this.regions){
                if(this.regions[c].name == response.data.data[d].menuName){
                  this.regions[c].checked = true;
                }
                for(var t in this.regions[c].obj){
                  if(this.regions[c].obj[t].name == response.data.data[d].menuName){
                    this.regions[c].obj[t].checked = true;
                  }
                }
              }
            };
          }else{
            this.errorInfo = response.data.msg;
          }
        }, (response) => {
          this.errorInfo = '请求失败';
        });
       console.log(this.regions)
      },
      /*权限转移*/
      Pertransfer(){
          return;
          this.dialogTableVisible=true;
          //通过url判断查询条件
          this.$route.query.orgId!=undefined?this.orgId=this.$route.query.orgId:this.orgId='';
          this.$route.query.roleId!=undefined?this.roleId=this.$route.query.roleId:this.roleId='';
          this.hospitalId=JSON.parse(sessionStorage.getItem('loginDate')).hospitalId;
          let page=1;
          let pageSize = 40;
          this.$http.post(url.url+'/doctor/findDocManList?page='+page+'&pageSize='+pageSize+'&hospitalId='+this.hospitalId+'&roleId='+this.roleId+'&orgId='+this.orgId+'&queryStr='+this.seachName,{emulateJSON:true}).then((response) => {
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
      /*权限转移窗口 搜索人员*/
      seachbtn(){
        this.$route.query.orgId!=undefined?this.orgId=this.$route.query.orgId:this.orgId='';
        this.$route.query.roleId!=undefined?this.roleId=this.$route.query.roleId:this.roleId='';
        let page=1;
        let pageSize = 40;
        let self = this;
        this.$http.post(url.url+'/doctor/findDocManList?page='+page+'&pageSize='+pageSize+'&hospitalId='+this.hospitalId+'&roleId='+this.roleId+'&orgId='+this.orgId+'&queryStr='+this.seachName,{emulateJSON:true}).then((response) => {
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
      /*权限转移表格数据的选择*/
      handleSelectionChange(val) {
        val.length > 1 ? this.multipleSelection = val.splice(0, 1) : this.multipleSelection = val;
       // console.log(JSON.stringify(val));
        this.transData=JSON.stringify(val);
        console.log(this.transData);
      },
      /*权限转移表格的提交*/
      dialogTableVisibleSmit(){
          let params={"hospitalId":this.hospitalId,"newAdminId":eval(this.transData)[0].doctorId};
          params=encodeURIComponent(JSON.stringify(params));
          this.$http.post(url.url+'/role/transfer?params='+params,{emulateJSON:true}).then((response) => {
            if(response.data.result==200){
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
              message: '请求失败!'
            });
          });
      }

    }
  }
</script>

<style scoped>
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

  /*y 1206*/
  .mainTop {
    height: 108px;
  }

  .mainTop h2 {
    float: left;
    line-height: 108px;
    font-size: 20px;
  }

  .mainTop .addbtn {
    float: right;
    margin-top: 28px;
  }

  .bg-purple {
    padding: 0 23px;
    background-color: #f9fafc;
    height: 69px;
    line-height: 69px;
    position: relative;
    margin-top: 0;
  }

  .bg-purple h2 {
    float: left;
    font-size: 18px;
    color: #666666;
  }

  .bg-purple h2 i {
    color: #00bab9;
  }

  .bg-purple h3 {
    float: right;
    font-size: 16px;
    color: #00bab9;
    margin-right: 50px;
  }

  .bg-purple h3 b {
    font-weight: normal;
    cursor: pointer;
  }

  .mainBottom_con1 .bg-purple h3 span, .mainBottom_con2 .bg-purple h3 span {
    cursor: pointer;
  }

  .mainBottom_con1 .bg-purple h3 .up, .mainBottom_con2 .bg-purple h3 .up {
    width: 18px;
    height: 10px;
    background: url("../assets/sprit.png") -33px -11px no-repeat;
    position: absolute;
    right: 23px;
    top: 30px;
  }

  .mainBottom_con1 .bg-purple h3 .down{
    width: 18px;
    height: 10px;
    background: url("../assets/sprit.png") -33px 0 no-repeat;
    position: absolute;
    right: 23px;
    top: 30px;
  }

  .mainBottom_con1_show {
    padding-top:40px;
    padding-left:60px;
    border:1px solid #f9fafc;
  }


</style>
