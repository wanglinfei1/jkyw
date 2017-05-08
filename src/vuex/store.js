import Vue from 'vue'
import Vuex from 'vuex'
// import createLogger from '../../node_modules/vuex/src/plugins/logger'

Vue.use(Vuex);

//const debug = process.env.NODE_ENV !== 'production';

const state = {active:false}


const mutations = {
    add(state,payload){
        state.active=payload
    }
}

const actions = {}
const getters = {}

export default new Vuex.Store({
    state,
    actions,
    getters,
    mutations,
    // modules: {
    //
    // },
    // strict: debug,
    // plugins: debug ? [createLogger()] : []
})
