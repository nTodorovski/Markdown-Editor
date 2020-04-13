<template>
  <div id="app">
    <div id="wrapper">
      <textarea id="css-editor"></textarea>
      <textarea id="convertedHTML" v-model="html"></textarea>
    </div>
    <div v-html="html"></div>
  </div>
</template>

<script>
  import Codemirror from 'codemirror/lib/codemirror'
  import axios from 'axios';

  export default {
    name: 'App',
    data() {
      return {
        a: 1,
        editor : null,
        html: null
      };
    },

    methods: {
      convertMarkdownToHtml() {
        let text = this.editor.getValue();
        let self = this;
        axios.post('https://api.github.com/markdown',
  {
          "text": text,
          "mode": "gfm",
          "context": "github/gollum"
        })
        .then(function (response) {
          self.html = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
      }
    },


    mounted() {
      this.editor = Codemirror.fromTextArea(document.getElementById("css-editor"), {
        lineNumbers: true,
        theme: "dracula",
        mode: {
          name: "markdown",
          highlightFormatting: true
        }
      });
      this.editor.setSize(500, 400);
      let timeoutId;
      let self = this;
      this.editor.on('change', function() {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(function() {
          console.log("After 3 seconds")
          self.convertMarkdownToHtml();
        }, 3000);
      });
    }
  }
</script>

<style>
  /*theme*/
  @import '~codemirror/theme/dracula.css';

  #wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }

  #convertedHTML {
    height: 400px;
    width: 500px;
  }

</style>
