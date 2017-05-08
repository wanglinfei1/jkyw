<template>
  <div>
    <div class="grid-content bg-purple">
      <h2>{{message.roleName}} <i><span>(</span>{{message.total}}<span>)</span></i></h2>
      <h3>
        <span class="bj" @click="show(mess)">编辑</span>
        <span @click="remove(arr,mess)">删除</span>
      </h3>
    </div>
    <div v-show="open">
      <aside class="mainBottom_con2_show">
        <el-form>
            <ul id="tree" v-for="(a,index) in this.datatree[mess]">
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
            <el-form-item>
              <el-button class="MarB50" type="primary" @click="submitzs(mess)">提交</el-button>
            </el-form-item>
        </el-form>
      </aside>
    </div>

  </div>
</template>
<script>
  import url from '../url';
  export default{
    data(){
      return {
        checked:false,
        datatree:[],
        open: false,
        rosebons:['arr1-1','arr2-1'],
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
          }]
      }
    },
    /*给data添加属性*/
    props: ['message','mess','arr'],
    mounted(){},
    methods: {
      /*点击编辑*/
      show(index){
        /*给当前模块下一棵树*/
        this.datatree[index]=this.regions;
        //console.log(this.datatree)

        this.$http.get(url.url+'/menu/queryByRoleId/'+this.message.id,{emulateJSON:true}).then((response) => {
          if(response.status==200){
            /*返现角色权限*/
            for(var d in response.data.data){
              for(var c in this.datatree[index]){
                if(this.datatree[index][c].id == response.data.data[d].id){
                  this.datatree[index][c].checked = true;
                }
                for(var t in this.datatree[index][c].obj){
                  if(this.datatree[index][c].obj[t].id == response.data.data[d].id){
                    this.datatree[index][c].obj[t].checked = true;
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

        //console.log(this.datatree)
        /*显示树形结构*/
        this.open = !this.open;
      },
      /*点击删除*/
      remove(arrlist,index){
        if(this.message.total>0){
          this.$confirm('该角色有人员管理，请先到人员管理取消关联', '角色删除', {
            confirmButtonText: '去人员管理',
            cancelButtonText: '取消',
          }).then(() => {
            this.$router.push({path: '/main/personManage', query: {orgId: this.message.id}});
          }).catch(() => {
          });
        }else{
          this.$confirm('是否确认删除该"'+this.message.roleName+'"角色?', '角色删除', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
          }).then(() => {
            //删除接口
            this.$http.post(url.url+'/role/del/'+this.message.id,{emulateJSON:true}).then((response) => {
              if(response.data.result==200){
                //debugger;
                arrlist.splice(index,1);
                this.$message({
                  type: 'success',
                  message: '删除成功!'
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
      submitzs(objs){
        var arr = [];
        for (var i = 0; i < this.datatree[objs].length; i++) {
          if (this.datatree[objs][i].checked && this.datatree[objs][i].checked == true) {
            arr.push({"id":this.datatree[objs][i].id})
          }
          for (var s = 0; s < this.datatree[objs][i].obj.length; s++) {
            if (this.datatree[objs][i].obj[s].checked && this.datatree[objs][i].obj[s].checked == true) {
              arr.push({"id":this.datatree[objs][i].obj[s].id})
            }
          }
        };
        let data={"hospitalId":JSON.parse(sessionStorage.getItem('loginDate')).hospitalId,"menus":arr,"role":{"id":this.message.id,"roleName":this.message.roleName}};
        //debugger;
        data=encodeURIComponent(JSON.stringify(data));
        this.$http.post(url.url+'/role/put?rolePermission='+data,{emulateJSON:true}).then((response) => {
          if(response.status==200){
            //console.log(data);
            /*self.$router.push({path: '/main/RoleManage'});*/
            this.$message({
              type: 'success',
              message:response.data.msg
            });
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
<style>
  .bg-purple {
    padding:0 23px;
    background-color: #f9fafc;
    height:69px;
    line-height:69px;
    position:relative;
    clear:both;
    margin-top:40px;
  }
  .bg-purple h2{
    float:left;
    font-size:18px;
    color:#666666;
  }
  .bg-purple h2 i{
    color:#00bab9;
  }
  .bg-purple h3{
    float:right;
    font-size:16px;
    color:#00bab9;
  }
  .bg-purple h3 span{
    cursor:pointer;
  }
  .bg-purple h3 span.bj{
    margin-right:27px;
  }
  .bg-purple h3 span:hover{
    text-decoration: underline;
  }
  .el-form-item__content{
    text-align:center;
  }
  .mainBottom_con2_show {
    padding-top:40px;
    padding-left:60px;
    border:1px solid #f9fafc;
  }
</style>

