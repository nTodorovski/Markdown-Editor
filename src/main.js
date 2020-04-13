import Vue from 'vue'
import App from './App.vue'


import CodeMirror from "codemirror/lib/codemirror"
let CodeMirrorEditor = new CodeMirror;
import "codemirror/mode/markdown/markdown"
import 'codemirror/lib/codemirror.css';
Vue.use(CodeMirrorEditor);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
