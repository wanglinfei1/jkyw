import login from './pages/login'
import resetpassword from './pages/resetpassword.vue'
import password from './pages/password.vue'
import loginup1 from './pages/loginup1.vue'
import loginup2 from './pages/loginup2.vue'
import loginup3 from './pages/loginup3.vue'
import code from './pages/code.vue'
import main from './pages/main.vue'
import treatment from './pages/treatment'
import detailt from './pages/checkcase'
import detailThree from './pages/case'
import detailFour from './pages/newcase'
import personManage from './pages/personManage'
//import orgManage from './pages/orgManage'
import RoleManage from './pages/RoleManage'
import newRole from './pages/newRole'
import branchManage from './pages/branchManage'
import personManAdd from './pages/personManAdd'


/*import RoleManage from './pages/RoleManage'*/

/*export default[
    {path: '/', component: login},
    {path: '/password', component: password},
    {path: '/treatment', component: treatment},
    {path: '/checkcase', component: detailt},
    {path: '/case', component: detailThree},
    {path: '/newcase', component: detailFour}
]*/



 export default[
   {path: '/', component: login},
   {path: '/password', component: password},
   {path: '/code', component: code},
   {path: '/resetpassword', component: resetpassword},
   {path: '/loginup1', component: loginup1},
   {path: '/loginup2', component: loginup2},
   {path: '/loginup3', component: loginup3},
   {path: '/main',component: main,
     children: [
       {path: '',component: treatment},
       {path: 'checkcase', component: detailt},
       {path: 'case', component: detailThree},
       {path: 'newcase', component: detailFour},
       {path: 'personManage', component: personManage},

       //{path: 'orgManage', component: orgManage},
       {path: 'RoleManage', component: RoleManage},
       {path: 'newRole', component: newRole},

       {path: 'branchManage', component: branchManage},
      /* {path: 'orgManage', component: orgManage},*/
       {path: 'personManAdd', component: personManAdd},

     ]
   }


 ]
