<template>
  <div id="app">
    <div id="wrapper">
      <div id="editor-panel">
<!--        h2heading-->
        <button id="h2" @click="h2Heading" class="panel-buttons" v-b-tooltip.hover title="大見出し"><font-awesome-icon icon="heading" class="fa-2x"/>2</button>
<!--        h3heading-->
        <button id="h3" @click="h3Heading" class="panel-buttons" v-b-tooltip.hover title="小見出し"><font-awesome-icon icon="heading" class="fa-2x"/>3</button>
<!--        bold-->
        <button id="bold-btn" @click="boldText" class="panel-buttons" v-b-tooltip.hover title="太字"><font-awesome-icon icon="bold" class="fa-2x"/></button>
<!--        table button-->
        <button id="table-btn" @click="insertTable" class="panel-buttons" v-b-tooltip.hover title="テーブルを挿入"><font-awesome-icon icon="table" class="fa-2x"/></button>
<!--        red-->
        <button id="red" @click="redText" class="panel-buttons" v-b-tooltip.hover title="赤字"><font-awesome-icon icon="registered" class="fa-2x"/></button>
<!--        highlight-->
        <button id="highlight" @click="highlightText" class="panel-buttons" v-b-tooltip.hover title="ハイライト"><font-awesome-icon icon="highlighter" class="fa-2x"/></button>
<!--        image upload-->
        <label class="custom-file-upload panel-buttons" v-b-tooltip.hover title="Image Upload">
          <input type="file" id="fileUpload" size="20" @input="uploadImage"/>
          <font-awesome-icon icon="image" class="fa-2x"/>
        </label>
<!--        search Products-->
        <button
          v-b-modal.searchModal
          class="panel-buttons"
          v-b-tooltip.hover
          title="Search">
          <font-awesome-icon icon="cookie-bite" class="fa-2x"/>
        </button>
        <b-modal
          id="searchModal"
          title="Search Products"
          @ok="handleOk">
          <template v-slot:default="{ }">
            <b-input-group
              v-for="size in ['sm']"
              :key="size"
              :size="size"
              class="mb-3"
              prepend="Product Name"
            >
              <b-form-input id="inputValue" ref="inputValue"></b-form-input>
              <b-input-group-append>
                <b-button size="sm" text="Search" variant="success" id="searchButton" @click="productSearch">Search</b-button>
              </b-input-group-append>
            </b-input-group>
            <div class="product_list"></div>
          </template>

          <template v-slot:modal-footer="{ ok }">
            <b-button size="sm" variant="success" @click="ok()">
              Select
            </b-button>
          </template>
        </b-modal>
      </div>
      <textarea id="css-editor"></textarea>
    </div>
    <div id="preview" v-html="html"></div>
  </div>
</template>

<script>
  import Codemirror from 'codemirror/lib/codemirror';
  import axios from 'axios';
  import table from 'markdown-table';

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
            //converting [red] nad [h]
            let convertedData= self.convertCustomNotations(response.data);
            self.html = convertedData;
          })
          .catch(function (error) {
            console.log(error);
          });
      },

      boldText() {
        let selection = this.editor.getSelection();
        this.editor.replaceSelection('**' + selection + '**');
        if (!selection) {
          let cursorPos = this.editor.getCursor();
          this.editor.setCursor(cursorPos.line, cursorPos.ch - 2);
        }
      },

      h2Heading() {
        let selection = this.editor.getSelection();
        this.editor.replaceSelection('## ' + selection);
        if (!selection) {
          let cursorPos = this.editor.getCursor();
          this.editor.setCursor(cursorPos.line, cursorPos.ch - 2);
        }
      },


      h3Heading() {
        let selection = this.editor.getSelection();
        this.editor.replaceSelection('### ' + selection);
        if (!selection) {
          let cursorPos = this.editor.getCursor();
          this.editor.setCursor(cursorPos.line, cursorPos.ch - 2);
        }
      },

      redText() {
        let selection = this.editor.getSelection();
        this.editor.replaceSelection('[red]' + selection + '[/red]');
        if (!selection) {
          let cursorPos = this.editor.getCursor();
          this.editor.setCursor(cursorPos.line, cursorPos.ch - 2);
        }
      },


      highlightText() {
        let selection = this.editor.getSelection();
        this.editor.replaceSelection('[h]' + selection + '[/h]');
        if (!selection) {
          let cursorPos = this.editor.getCursor();
          this.editor.setCursor(cursorPos.line, cursorPos.ch - 2);
        }
      },


      insertTable() {
        let rows = 5;
        let columns = 6;

        let tableContent = new Array();

        for (let i = 0; i < rows; i++) {
          let createdRow = new Array();
          for(let j = 0; j< columns; j++) {
            createdRow.push(' ');
          }
          tableContent.push(createdRow);
        }
        let node = table(tableContent);
        this.editor.replaceSelection(node);
      },


      productSearch() {
        let searchText = this.$refs["inputValue"][0].localValue
        console.log(searchText)
      },

      handleOk(event) {
        console.log(event)
        console.log('ne se zatvara')
        event.preventDefault();
      },

      uploadImage(event) {
        const files = event.target.files
        // const formData = new FormData()
        // formData.append('myFile', files[0],'slika.jpg')
        let data = {
          uploadedImage: files[0]
        }

        console.log(data);

        // fetch('/saveImage', {
        //   method: 'POST',
        //   body: formData
        // })
        // .then(response => response.json())
        // .then(data => {
        //   console.log(data.path)
        // })
        // .catch(error => {
        //   console.error(error)
        // })
      },

      //Converting custom notations
      convertCustomNotations(data) {

        //red color open tag
        const redOpenTag = "\\[red\\]";
        const redOpenTagRegex = new RegExp(redOpenTag, "g");
        data = data.replace(redOpenTagRegex, "<span style=\"color:red;\">");

        //red color close tag
        const redCloseTag = "\\[/red\\]";
        const redCloseTagRegex = new RegExp(redCloseTag, "g");
        data = data.replace(redCloseTagRegex, "</span>");

        //highlight color open tag
        const highlightOpenTag = "\\[h\\]";
        const highlightOpenTagRegex = new RegExp(highlightOpenTag, "g");
        data = data.replace(highlightOpenTagRegex, "<span style=\"background-color:yellow;\">");

        // //highlight color close tag
        const highlightCloseTag = "\\[/h\\]";
        const highlightCloseTagRegex = new RegExp(highlightCloseTag, "g");
        data = data.replace(highlightCloseTagRegex, "</span>");

        return data;
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
      this.editor.setSize(600, 400);
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

  /*bootstrap*/
  @import '~bootstrap/dist/css/bootstrap.css';
  @import '~bootstrap-vue/dist/bootstrap-vue.css';

  input[type="file"] {
    display: none;
  }
  .custom-file-upload {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin-bottom: 0px;
  }


  .panel-buttons {
    min-width: 57px;
    background-color: aliceblue;
    height: 100%;
    margin-right: 5px;
  }

  .panel-buttons:focus {
    outline: none;
  }

  #app {
    display: flex;
    flex-direction: row;
  }

  #editor-panel {
    height: 40px;
    width: 100%;
    background-color: #6d8a88;
    display: flex;
  }

  #preview {
    height: 440px;
    width: 100%;
    border: 2px solid black;
    overflow: scroll;
  }

  #wrapper {
    display: flex;
    flex-direction: column;
  }

  .tooltip-inner{
    background-color: white;
    color: black;
  }

  .product_list {
    border-radius: 6px;
    background-color: lightgray;
    border: 1px solid dimgrey;
    min-height: 300px;
  }

</style>
