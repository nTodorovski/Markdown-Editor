import Vue from 'vue'
import App from './App.vue'


import CodeMirror from "codemirror/lib/codemirror"
let CodeMirrorEditor = new CodeMirror;
import "codemirror/mode/markdown/markdown"
import 'codemirror/lib/codemirror.css';
Vue.use(CodeMirrorEditor);


import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCoffee,faBold, faHeading, faTable, faRegistered, faHighlighter, faImage, faCookieBite } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faCoffee,faBold, faHeading, faTable, faRegistered, faHighlighter, faImage, faCookieBite )

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
