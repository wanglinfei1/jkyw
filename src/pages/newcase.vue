<template>

  <section >
    <hgroup>
      <h2><router-link to="/main">首页</router-link> | <router-link to="/main">诊疗管理</router-link> | 新增病例</h2>
    </hgroup>
    <section class="addCaseBox">
      <h2 class="addCaseTitle">
        <time>{{ruleForm.date}}</time>
        <section>
          <summary>科室：</summary>
          <p>{{ruleForm.ks}}</p>
        </section>
        <section>
          <summary>医生：</summary>
          <p>{{ruleForm.doctor}}</p>
        </section>
      </h2>
      <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px"
                 class="demo-ruleForm detailF">
          <el-input type="hidden"  v-model="ruleForm.doctorId"></el-input>  <!--v-model="ruleForm.patientName" -->
          <el-input type="hidden"  v-model="ruleForm.id"></el-input>
          <el-row :gutter="20">
            <el-col :span="5">
              <el-form-item label="名称" prop="patientName">
                <el-input v-model="ruleForm.patientName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">

              <div class="form-group clearfix floatL MarR8 sex">
                <label class="floatL wid"><i class="stars">*</i>性别</label>
                <div class="inputBox floatL">
                  <select class="form-control  W158" v-model="ruleForm.sex" :class="{wrong:wrong}"
                          @click.stop="miss">
                    <option value="">请选择性别</option>
                    <option value="1">男</option>
                    <option value="2">女</option>
                  </select>
                  <div class="FerrorNew cont" :class="{conts:conts}"><i class="MarR8">-</i><span
                    class="floatL">请选择性别</span></div>
                  </div>
              </div>
            </el-col>
            <el-col :span="5">
              <el-form-item label="年龄" prop="age">
                <el-input type="num" v-model="ruleForm.age"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="身份证号" prop="idCard">
                <el-input :disabled='c' v-model="ruleForm.idCard" required="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item label="地址" prop="address">
                <el-input v-model="ruleForm.address"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10" class="jFormSelf">
              <el-col :span="12">
                <el-form-item label="电话" prop="phone">
                  <el-input v-model="ruleForm.phone"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="备注" prop="memo">
                  <el-input v-model="ruleForm.memo"></el-input>
                </el-form-item>
              </el-col>
            </el-col>
          </el-row>
          <el-col :span="20">
            <div class="form-group  floatL MarTop40 diag">
              <label class="floatL"><i class="stars">*</i>诊疗类型</label>
              <div class="inputBox floatL" @click.stop="misstwo">
                <div class="checkbox floatL MarR40">
                  <input type="radio" id="checkbox-pz" class="regular-checkbox" name="checkbox"
                         v-model="ruleForm.practiceType" value="1"/>
                  <label class="checkLabel" for="checkbox-pz"></label><span>普诊</span></div>
                <div class="checkbox floatL MarR40">
                  <input type="radio" id="checkbox-fz" class="regular-checkbox" name="checkbox"
                         v-model="ruleForm.practiceType" value="2"/>
                  <label class="checkLabel" for="checkbox-fz"></label><span>复诊</span></div>
                <div class="checkbox floatL">
                  <input type="radio" id="checkbox-jz" class="regular-checkbox" name="checkbox"
                         v-model="ruleForm.practiceType" value="3"/>
                  <label class="checkLabel" for="checkbox-jz"></label><span>急诊</span></div>
                <div class="FerrorNew cont" :class="{mold:mold}"><i class="MarR8">-</i><span
                  class="floatL">请选择诊疗类型</span></div>
              </div>
            </div>
          </el-col>
          <el-col :span="20">
            <el-form-item label="主诉" prop="complain">
              <textarea type="textarea" class="el-textarea__inner" :rows.number=6 v-model="ruleForm.complain" maxlength="50" @keyup="showkey($event,50)"></textarea>
              <p>{{pText}}</p>

            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="现病史" prop="presentHistory">
              <el-input type="textarea" :rows.number=4 v-model="ruleForm.presentHistory"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
          <el-form-item label="检验检查" prop="inspection">
            <el-input type="textarea" :rows.number=4 v-model="ruleForm.inspection"></el-input>
          </el-form-item>
        </el-col>
          <el-col :span="20">
            <el-form-item label="初步诊断" prop="diagnosis">
              <el-input type="textarea" :rows.number=4 v-model="ruleForm.diagnosis"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="医嘱建议" prop="advice">
              <el-input type="textarea" :rows.number=4 v-model="ruleForm.advice"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item>
              <el-button  class="el-button el-button--cancle MarB50" @click="preserve">暂存</el-button>
              <el-button  class="MarB50" type="primary" @click="handleSubmit">提交</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
    </section>
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
      let checkAge = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入年龄'));
        }
        if (/^(?:[1-9][0-9]?|1[01][0-9]|120)$/.test(value)) {
          callback();
        } else {
          callback(new Error('请输入正确的年龄'));
        }
      };
      let checkId=(rule,value,callback)=>{
        if(!value){
          return callback(new Error('请输入身份证号'));
        }
        if (/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)) {
          callback();
        } else {
          callback(new Error('请输入正确的身份证号'));
        }

      };
      return {
        mold: false,
        conts: false,
        docId:JSON.parse(sessionStorage.getItem('loginDate')).doctorId,
        wrong: false,
        c:true,
        pText:'50个字以内',
        ruleForm: {  date: '',
          ks: '',
          doctor: '',
          patientName: '',
          sex: '',
          age: '',
          idCard: '',
          address: '',
          phone: '',
          memo: '',
          practiceType: '',
          complain:'',
          presentHistory: '',
          inspection: '',
          doctorId:'',
          advice:'',
          diagnosis:'',
          id:''},
        rules: {
          patientName: [
            {required: true, message: '请输入姓名'},//, trigger: 'blur'
            {max: 20, message: '超长'}
          ],
          age: [
            {required: true, validator: checkAge,trigger: 'blur'}
          ],
          address: [
            {required: true, message: '请输入地址',trigger: 'blur'}
          ],

          diagnosis: [
            {required: true, message: '请输入初步诊断',trigger: 'blur'}
          ],
          advice: [
            {required: true, message: '请输入医嘱建议',trigger: 'blur'}
          ],
          presentHistory: [
            {required: true, message: '请输入现病史',trigger: 'blur'}
          ],
          idCard: [
            {required: true, validator:checkId,trigger: 'blur'}
          ],
          phone: [
            {required: true,validator: checkPhone,trigger: 'blur'}
          ]
        }
      };
    },
    methods: {
      showkey(event,num){
        //获取点击对象
        let el = event.currentTarget.value.length;
        if(el<=num){
          this.pText="还剩"+(num-el)+"字";
        }


      },
      miss(){
        this.conts = false;
        this.wrong = false;
      },
      misstwo(){
        this.mold = false
      },
      preserve(ev){     //新增和修改暂存接口
        let self = this;
        this.$refs.ruleForm.validate((valid) => {
          if (valid && self.ruleForm.practiceType != undefined && self.ruleForm.practiceType != '' && self.ruleForm.practiceType != null && self.ruleForm.sex != undefined && self.ruleForm.sex != '' && self.ruleForm.sex != null) {
          self.conts = false;
          self.wrong = false;
          self.ruleForm.doctorId=this.docId;
          let status=0;
          self.ruleForm.status=status;
          this.$http.post(url.url+'/patientcase/add',self.ruleForm,{emulateJSON:true}).then((response) => {
            if(response.status==200){
            self.$router.push({path: '/main'});
          }else{
            this.isActive = false;
            this.errorInfo = response.data.msg;
          }
        }, (response) => {
            this.isActive = false;
            this.errorInfo = '请求失败';
          });

        } else {
          if (self.ruleForm.practiceType == undefined || self.ruleForm.practiceType == '' || self.ruleForm.practiceType == null) {
            self.mold = true;
          }
          if (self.ruleForm.sex == undefined || self.ruleForm.sex == '' || self.ruleForm.sex == null) {
            self.conts = true;
            self.wrong = true;
          }
          return false;
        }
      });
      },
      handleSubmit(ev) {     //新增和修改提交接口
        let self = this;
        this.$refs.ruleForm.validate((valid) => {
          if (valid && self.ruleForm.practiceType != undefined && self.ruleForm.practiceType != '' && self.ruleForm.practiceType != null && self.ruleForm.sex != undefined && self.ruleForm.sex != '' && self.ruleForm.sex != null) {
          self.conts = false;
          self.wrong = false;
          self.conts = false;
          self.ruleForm.doctorId=this.docId;
          let status=1;
          self.ruleForm.status=status;
          this.$http.post(url.url+'/patientcase/add',self.ruleForm,{emulateJSON:true}).then((response) => {
            if(response.status==200){
            self.$router.push({path: '/main/case'});
          }else{
            this.isActive = false;
            this.errorInfo = response.data.msg;
          }
        }, (response) => {
            this.isActive = false;
            this.errorInfo = '请求失败';
          });

        } else {
          if (self.ruleForm.practiceType == undefined || self.ruleForm.practiceType == '' || self.ruleForm.practiceType == null) {
            self.mold = true;
          }
          if (self.ruleForm.sex == undefined || self.ruleForm.sex == '' || self.ruleForm.sex == null) {
            self.conts = true;
            self.wrong = true;
          }
          return false;
        }
      });
      }
    },
    mounted(){      //编辑返显初始化
      this.c=this.$route.query.id;
      if (!this.c) {
        this.c=false;
        this.ruleForm.doctor=JSON.parse(sessionStorage.getItem('loginDate')).doctorName;
        function doub(n){
          return n<10?'0'+n:''+n;
        }
        var date=new Date();
        var Year=date.getFullYear();
        var Month=date.getMonth()+1;
        var Day=date.getDate();
        this.ruleForm.date=Year+'-'+doub(Month)+'-'+doub(Day);
        this.ruleForm.ks=JSON.parse(sessionStorage.getItem('loginDate')).currentOrgName
        return
      } else {
        this.c=true;
        this.ruleForm.id=this.$route.query.id;
        this.$http.post(url.url+'/patientcase/view/'+this.$route.query.id+'').then((response) => {console.log(response)
        if(response.status==200){
          //id换一下
          response.data.data.caseList.id=response.data.data.patient.id;
          let iData = eval('('+(JSON.stringify(response.data.data.caseList)+JSON.stringify(response.data.data.patient)).replace(/}{/,',')+')');
          this.ruleForm = iData;
          this.ruleForm.doctor=JSON.parse(sessionStorage.getItem('loginDate')).doctorName;
          this.ruleForm.ks=JSON.parse(sessionStorage.getItem('loginDate')).currentOrgName;
          this.ruleForm.date=sessionStorage.getItem('time');
          console.log(iData)
        }else{
          this.isActive = false;
          this.errorInfo = response.data.msg;
        }
      }, (response) => {
          this.isActive = false;
          this.errorInfo = '请求失败';
        });
      }
    },


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

  /***addCase***/
  .form-group .checkLabel {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    margin-right: 12px;
    vertical-align: middle
  }
.form-group label{
  margin-right:0.2rem;
}
.form-group.sex{
  width:2.9rem;
}
.form-group .wid{
  font-size:14px;
}
.form-group.diag{
  width:100%;
}
.MarTop40 {
  font-size:14px;
}
  /*///////////////////////////////////////////////*/
  .wrong {
    border-color: #f4704a !important;
  }

  .cont {
    height: 0;
    overflow: hidden;
    transition: height 0.5s;
    background: #ffffff;
    box-shadow:none
  }

  .conts {
    height: 20px;
  }

  .mold {
    height: 20px;
  }

  /*/////////////////////////////////////////////////*/

  .regular-checkbox {
    display: none;
  }

  .regular-checkbox + label {
    background-color: #fff;
    border: 1px solid #c2c9d7;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05), inset 0px -15px 10px -12px rgba(0, 0, 0, 0.05);
    padding: 9px;
    border-radius: 3px;
    display: inline-block;
    position: relative;
  }

  .regular-checkbox + label:active, .regular-checkbox:checked + label:active {
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05), inset 0px 1px 3px rgba(0, 0, 0, 0.1);
  }

  .regular-checkbox:checked + label {
    background-color: #00bab9;
    border: 1px solid #00bab9;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05), inset 0px -15px 10px -12px rgba(0, 0, 0, 0.05), inset 15px 10px -12px rgba(255, 255, 255, 0.1);
    color: #b7eceb;
  }

  .regular-checkbox:checked + label:after {
    content: '\2714';
    font-size: 14px;
    position: absolute;
    top: -4px;
    left: 6px;
    color: #b7eceb;
  }

  .addCaseBox {
  }

  .main .addCaseTitle {
    width: 1530px;
    height: 66px;
    background: #f9fafc;
    margin-top: 36px;
    line-height: 66px;
    padding: 0;
    font-size: 18px;
  }

  .addCaseTitle * {
    display: inline-block;
    color: #666
  }

  .addCaseTitle time, .addCaseTitle section {
    margin: 0 38px 0 60px;
  }

  .form {
  }


  .inputBox {
  }

  .form-control {
    height: 30px;
    -padding: 6px 12px;
    font-size: 16px;
    line-height: 1.42857143;
    color: #999;
    background-color: #fff;
    background-image: none;
    border: 1px solid #e5e8ee; /*-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.075);box-shadow:inset 0 1px 1px rgba(0,0,0,.075);*/
    -webkit-transition: border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;
    -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s
  }

  .form-control:focus {
    border-color: #66afe9;
    outline: 0;
    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(0, 186, 185, .6);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(0, 186, 185, .6)
  }

  .form-control::-moz-placeholder {
    color: #999;
    opacity: 1
  }

  .form-control:-ms-input-placeholder {
    color: #999
  }

  .form-control::-webkit-input-placeholder {
    color: #999
  }

  .Ferror {
    border: 1px solid #f37347
  }



  .h62 {
    height: 62px;
  }

  .h190 {
    height: 190px;
  }

  .BottomNum {
    top: 74px;
  }

  .form-btn {
    text-align: left;
    padding-left: 118px;
  }

  .btn {
    padding: 14px 40px;
    background: #e5e5e5;
    border-radius: 3px;
    border: 0;
  }

  .btn_default {
    background: #e5e5e5;
    color: #666
  }

  .btn_success {
    background: #01a2a1;
    color: #fff
  }

  .detailF .jFormSelf .el-col-12:nth-child(1) {
    padding-left: 0 !important;
  }

  .detailF .jFormSelf .el-col-12:nth-child(2) {
    padding-right: 0 !important;
  }


  .form-group .inputBox{
    width:70%;
  }
</style>
