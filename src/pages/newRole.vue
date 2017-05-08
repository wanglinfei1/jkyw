<template>
  <section >
    <hgroup class="mainTop">
      <h2><router-link to="/main/personManage">首页</router-link> |  <router-link to="/main/RoleManage">角色管理</router-link> | 新增角色</h2>
    </hgroup>
    <div class="mainBottom checktop">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form ref="RoleForm" :model="RoleForm" :rules="rules" label-width="100px">
              <el-form-item label="角色名称" prop="rolename">
                <el-input v-model="RoleForm.rolename" placeholder="请输入新增角色的名称"></el-input>
              </el-form-item>
              <el-form-item label="角色权限">
                <ul id="tree" v-for="(a,index) in this.regions">
                  <li class="item">
                    <p v-on:click="changeTitleChecked(a)">
                      <span class="con1" v-bind:class="{ con1Active:a.checked }"></span>{{a.name}}
                    </p>
                    <ul v-if="a.obj" class="clearfix">
                      <li class="item" v-for="(b,indexs) in a.obj">
                        <p v-on:click="childTreeClick(a,b)">
                          <span class="con1" v-bind:class="{ con1Active:b.checked }"></span>{{b.name}}
                        </p>
                      </li>
                    </ul>
                  </li>
                </ul>
              </el-form-item>
              <el-form-item>
                <el-button class="MarB50" type="primary" @click="submitzs">提交</el-button>
              </el-form-item>
          </el-form>
        </el-col>
      </el-row>
</div>
</section>

</template>

<script>
/*引进主键*/
import url from '../url';
export default {
    data () {
        return {
        up: true,
        down: false,
        pan: false,
        obj: {},
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
        dialogTableVisible: false,
        RoleForm:{
          rolename: '',
        },
          rules: {
            rolename: [
              {required: true, message: '请输入角色名称'}
            ]
          }

        }
    },
    mounted(){},
    methods: {
      /*点击子级*/
      childTreeClick(a,b){
        for(var i in a.obj){
          if(a.obj[i].checked==false){
            a.checked = false
          }
        }
        if(b.checked){
          b.checked = false
        }else{
          a.checked = true
          b.checked = true
        }
      },
      /*点击父级*/
      changeTitleChecked(data){
        data.checked = data.checked ? false : true
        for(var i=0;i<data.obj.length;i++){
          data.obj[i].checked = data.checked
        }
      },
      /*树的提交*/
      submitzs(){
        var arr = [];
       for (var i = 0; i < this.regions.length; i++) {
          if (this.regions[i].checked && this.regions[i].checked == true) {
            arr.push({'id':this.regions[i].id})
          }
          for (var s = 0; s < this.regions[i].obj.length; s++) {
            if (this.regions[i].obj[s].checked && this.regions[i].obj[s].checked == true) {
              arr.push({'id':this.regions[i].obj[s].id})
            }
          }
        };

        let self = this;
       this.$refs.RoleForm.validate((valid) => {
          if (valid) {
            let data={"hospitalId":JSON.parse(sessionStorage.getItem('loginDate')).hospitalId,"menus":arr,"role":{"roleName":this.RoleForm.rolename}};
            data=encodeURIComponent(JSON.stringify(data));
            this.$http.post(url.url+'/role/add?params='+data,{emulateJSON:true}).then((response) => {
             if(response.status==200){
              console.log(data);
             self.$router.push({path: '/main/RoleManage'});
             }else{
             this.errorInfo = response.data.msg;
             }
             }, (response) => {
             this.errorInfo = '请求失败';
             });
          } else {
            return false;
          }
        });
      }

    }
}
</script>

<style>
  /*y 1206*/
  .mainTop{
  height:108px;
  }
  .mainTop h2{
  float:left;
  line-height:108px;
  font-size: 20px;
  }
  .el-form-item__content{
    text-align:left;
  }

.checktop .con1{
  margin-top:10px!important;
}
</style>
