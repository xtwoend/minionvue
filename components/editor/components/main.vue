<template>
  <!-- vmd ==> vue markdown -->
<div>
  
  <media :show="mediaShow" @on-close="mediaShow = false" :title="titleMedia" @on-insert="insertMedia" ref="gallery"></media>
  <Button type="default" icon="image" class="btn-media" @click="openMedia">Media</Button>

  <div class="vmd" ref="vmd">
    <div class="vmd-header" ref="vmdHeader">
      <div class="vmd-btn-group">
        <button type="button" class="vmd-btn vmd-btn-default" @click="addStrong" title="Ctrl + B"><i class="vf-bold"></i></button>
        <button type="button" class="vmd-btn vmd-btn-default" @click="addItalic" title="Ctrl + I"><i class="vf-italic"></i></button>
        <button type="button" class="vmd-btn vmd-btn-default" @click="addHeading" title="Ctrl + H"><i class="vf-header"></i></button>
        <button type="button" class="vmd-btn vmd-btn-default" @click="addStrikethrough" title="Ctrl + D"><i class="vf-strikethrough"></i>
        </button>
      </div>
      <div class="vmd-btn-group">
        <button type="button" class="vmd-btn vmd-btn-default" @click="addUl" title="Ctrl + U"><i class="vf-list-ul"></i></button>
        <button type="button" class="vmd-btn vmd-btn-default" @click="addOl" title="Ctrl + O"><i class="vf-list-ol"></i></button>
        <button type="button" class="vmd-btn vmd-btn-default" @click="addTable" title="Ctrl + T"><i class="vf-table"></i></button>
      </div>
      <!-- <div class="vmd-btn-group">
        <button type="button" class="vmd-btn vmd-btn-default" @click="addLink" title="Ctrl + A"><i class="vf-chain"></i></button>
        <button type="button" class="vmd-btn vmd-btn-default" @click="addImage" title="Ctrl + P"><i class="vf-image"></i></button>
      </div> -->
      <div class="vmd-btn-group">
        <button type="button" class="vmd-btn vmd-btn-default" @click="addLink" title="Ctrl + A"><i class="vf-chain"></i></button>
        <button type="button" class="vmd-btn vmd-btn-default" @click="addCode" title="Ctrl + C"><i class="vf-code"></i></button>
        <button type="button" class="vmd-btn vmd-btn-default" @click="addQuote" title="Ctrl + Q"><i class="vf-quote-left"></i></button>
      </div>
      <div class="vmd-btn-group">
        <button type="button" class="vmd-btn vmd-btn-default" @click="preview"><i :class="previewClass"></i></button>
        <button type="button" class="vmd-btn vmd-btn-default" @click="sanitizeHtml">HTML</button>
        <button type="button" class="vmd-btn vmd-btn-default" @click="htmlPreview"><Icon type="ios-monitor-outline"></Icon></button>
      </div>
    </div>
    <div class="vmd-body" ref="vmdBody">
      <textarea class="vmd-editor" :style="vmdEditorStyle" ref="vmdEditor"
                title="This is a editor."
                v-show="isEditorView"
                :value="vmdValue"
                @input="vmdInputting($event.target.value)"
                @focus="vmdActive"
                @blur="vmdInactive"
                @keydown.tab.prevent="addTab"
                @keydown.ctrl.b.prevent="addStrong"
                @keydown.ctrl.i.prevent="addItalic"
                @keydown.ctrl.d.prevent="addStrikethrough"
                @keydown.ctrl.h.prevent="addHeading"
                @keydown.ctrl.l.prevent="addLine"
                @keydown.ctrl.q.prevent="addQuote"
                @keydown.ctrl.c.prevent="addCode"
                @keydown.ctrl.a.prevent="addLink"
                @keydown.ctrl.p.prevent="addImage"
                @keydown.ctrl.t.prevent="addTable"
                @keydown.ctrl.u.prevent="addUl"
                @keydown.ctrl.o.prevent="addOl"
      ></textarea>
      <div class="vmd-preview markdown-body" ref="vmdPreview" v-show="isPreview" v-html="compiledMarkdown" :style="[previewWidth]"></div>
    </div>
  </div>
</div>
</template>

<script>
  /* eslint-disable */
  // import marked from 'marked'
  import hljs from 'highlight.js'

  import 'highlight.js/styles/atom-one-light.css'
  import '../styles/markdown.css'
  import '../styles/iconfont.css'

  import locale from '../locale/id'
  
  import media from '../../media/modal'

  import showdown from 'showdown'
  import showdownHighlight from 'showdown-highlight'
  import showdownYoutube from 'showdown-youtube'

  // Konfigurasikan markdown
  // marked.setOptions({
  //   highlight: function (code) {
  //     return hljs ? hljs.highlightAuto(code).value : code
  //   }
  // });

  let md = new showdown.Converter({
    tables: true,
    strikethrough: true,
    extensions: ['youtube', showdownHighlight]
  });

  /**
   * Tentukan fungsi __debounce
   *
   * @param fn Akhirnya akan diimplementasikan dengan metode ini
   * @param delay Jeda
   */
  function __debounce(fn, delay) {
    let timer = null;
    return function () {
      let context = this;
      let args = arguments;
      // Clear timer
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    }
  }

  export default {
    name: 'VueEditor',
    components: {
      media
    },
    props: {
      value: {
        type: String,
        default: null
      }
    },
    data() {
      return {
        vmd: null,
        vmdBody: null,
        vmdHeader: null,
        vmdFooter: null,
        vmdEditor: null,
        vmdPreview: null,
        vmdInput: '# hello',
        lang: 'id',
        isEditorView: true,
        isPreview: true,
        isSanitize: false,
        previewWidth: {},
        mediaShow: false,
        titleMedia: 'Media Gallery',
        cursor: {}
      }
    },
    computed: {
      vmdValue() {
        return this.$props.value || this.vmdInput
      },
      /**
       * Dikompilasi menjadi dokumen markdown
       */
      compiledMarkdown() {
        // return marked(this.$props.value || this.vmdInput, {sanitize: this.isSanitize})
        return md.makeHtml(this.$props.value || this.vmdInput, {sanitize: this.isSanitize})
      },
      vmdEditorStyle() {
        return this.isPreview ? null : {
          width: '100%'
        }
      },
      previewClass() {
        return this.isPreview ? 'vf-eye-slash' : 'vf-eye'
      }
    },
    mounted() {
      // Cache komponen DOM
      this.__saveDom();
      // Setel ulang ukuran komponen
      this.__resize();
      // Tambahkan event berjalan
      window.addEventListener('resize', this.vmdResize, false);
      this.vmdEditor.addEventListener('scroll', this.vmdSyncScrolling, false);
      this.vmdPreview.addEventListener('scroll', this.vmdSyncScrolling, false);
      // Secara otomatis mendapatkan fokus
      this.vmdEditor.focus()
    },
    beforeDestroy() {
      // Lepaskan komponen DOM
      this.__removeDom();
      // Hapus event berjalan
      if (typeof window !== 'undefined' ) {
        window.removeEventListener('resize', this.vmdResize, false);
        // this.vmdEditor.removeEventListener('scroll', this.vmdSyncScrolling, false);
        // this.vmdPreview.removeEventListener('scroll', this.vmdSyncScrolling, false);
      }
    },
    methods: {
      openMedia () {
        this.cursor = this.__getSelection()
        this.mediaShow = !this.mediaShow
      },
      insertMedia (media) {
        // console.log(media)
        let chunk, cursor, selected = this.cursor, link;

        if (selected.length === 0) {
          // Berikan konten tambahan
          chunk = this.__localize('imageText');
        } else {
          chunk = selected.text;
        }

        if (media.length > 0) {
          let tagmedia = '';
          // loop media insert
          media.forEach((item, index) => {
            
            link = item.url
            chunk = item.name
            
            let urlRegex = new RegExp('^((http|https)://|(//))[a-z0-9]', 'i');
            if (link !== null && link !== '' && link !== 'http://' && urlRegex.test(link)) {
              let div = document.createElement('div');
              div.appendChild(document.createTextNode(link));
              let sanitizedLink = div.innerHTML;

              if (item.type === 'image' || item.type === 'video') {
                // Ganti pilihan dan atur kursor ke potongan sebelumnya
                tagmedia += '\n![' + chunk + '](' + sanitizedLink + ' "' + this.__localize('imageTitle') + '")\n';
                cursor += selected.start + tagmedia.length;
              } else {
                tagmedia += '\n[' + chunk + '](' + sanitizedLink + ')\n';
                cursor += selected.start + tagmedia.length;
              }
            }
          })

          this.__replaceSelection(tagmedia);
          this.__setCursor(cursor, cursor + chunk.length)
          // update markdown input
          this.__updateInput()
        }
        // close media gallery
        this.$refs.gallery.itemSelected = []
        this.mediaShow = false
      },
      vmdActive() {
        this.$refs.vmd.classList.add('active')
      },
      vmdInactive() {
        this.$refs.vmd.classList.remove('active')
      },
      sanitizeHtml() {
        this.isSanitize = !this.isSanitize;
      },
      /**
       * 同步滚动
       */
      vmdSyncScrolling(e) {
        e = e || window.event;
        if (this.vmdEditor === e.target) {
          this.vmdPreview.scrollTop = e.target.scrollTop
        } else {
          this.vmdEditor.scrollTop = e.target.scrollTop
        }
      },
      vmdResize: __debounce(function (e) {
        this.__resize()
      }, 100),
      /**
       * Event listener user
       */
      vmdInputting: __debounce(function (value) {
        this.vmdEditor.value = value;
        this.__updateInput()
      }, 100),
      preview() {
        this.isPreview = !this.isPreview
      },
      htmlPreview() {
        this.isEditorView = !this.isEditorView
        this.previewWidth.width = (this.isEditorView)? '50%': '100%'
      },
      /**
       * Perluas pintas Tab
       */
      addTab() {
        let chunk, cursor, selected = this.__getSelection(), content = this.__getContent();
        if (selected.length === 0) {
          chunk = this.__localize('tabText');
        } else {
          chunk = selected.text;
        }
    
        this.__replaceSelection(chunk);
        cursor = selected.start;

        this.__setCursor(cursor, cursor + chunk.length);
        this.__updateInput()
        // this.__updateInput('\n' + this.__localize('tabText'));
      },
      addStrong() {
        let chunk, cursor, selected = this.__getSelection(), content = this.__getContent();

        if (selected.length === 0) {
          // Berikan konten tambahan
          chunk = this.__localize('strongText');
        } else {
          chunk = selected.text;
        }

        // Ganti pilihan dan atur kursor ke potongan sebelumnya
        if (content.substr(selected.start - 2, 2) === '**'
          && content.substr(selected.end, 2) === '**') {
          this.__setSelection(selected.start - 2, selected.end + 2);
          this.__replaceSelection(chunk);
          cursor = selected.start - 2;
        } else {
          this.__replaceSelection('**' + chunk + '**');
          cursor = selected.start + 2;
        }

        // Tetapkan pilihannya
        this.__setSelection(cursor, cursor + chunk.length);
        this.__updateInput()
      },
      addItalic() {
        let chunk, cursor, selected = this.__getSelection(), content = this.__getContent();

        if (selected.length === 0) {
          // Berikan konten tambahan
          chunk = this.__localize('italicText');
        } else {
          chunk = selected.text;
        }

        // Ganti pilihan dan atur kursor ke potongan sebelumnya
        if (content.substr(selected.start - 1, 1) === '_'
          && content.substr(selected.end, 1) === '_') {
          this.__setSelection(selected.start - 1, selected.end + 1);
          this.__replaceSelection(chunk);
          cursor = selected.start - 1;
        } else {
          this.__replaceSelection('_' + chunk + '_');
          cursor = selected.start + 1;
        }

        // Tetapkan pilihannya
        this.__setSelection(cursor, cursor + chunk.length);
        this.__updateInput()
      },
      addStrikethrough() {
        let chunk, cursor, selected = this.__getSelection(), content = this.__getContent();

        if (selected.length === 0) {
          // Berikan konten tambahan
          chunk = this.__localize('strikethroughText');
        } else {
          chunk = selected.text;
        }

        // Ganti pilihan dan atur kursor ke potongan sebelumnya
        if (content.substr(selected.start - 2, 2) === '~~'
          && content.substr(selected.end, 2) === '~~') {
          this.__setSelection(selected.start - 2, selected.end + 2);
          this.__replaceSelection(chunk);
          cursor = selected.start - 2;
        } else {
          this.__replaceSelection('~~' + chunk + '~~');
          cursor = selected.start + 2;
        }

        // Tetapkan pilihannya
        this.__setSelection(cursor, cursor + chunk.length);
        this.__updateInput()
      },
      addHeading() {
        let chunk, cursor, selected = this.__getSelection(), content = this.__getContent(), pointer, prevChar;

        if (selected.length === 0) {
          // Berikan konten tambahan
          chunk = this.__localize('headingText');
        } else {
          chunk = selected.text;
        }

        // Ganti pilihan dan atur kursor ke potongan sebelumnya
        if ((pointer = 4, content.substr(selected.start - pointer, pointer) === '### ')
          || (pointer = 3, content.substr(selected.start - pointer, pointer) === '###')) {
          this.__setSelection(selected.start - pointer, selected.end);
          this.__replaceSelection(chunk);
          cursor = selected.start - pointer;
        } else if (selected.start > 0 && (prevChar = content.substr(selected.start - 1, 1), !!prevChar && prevChar !== '\n')) {
          this.__replaceSelection('\n\n### ' + chunk);
          cursor = selected.start + 6;
        } else {
          // 元素前的空字符串
          this.__replaceSelection('### ' + chunk);
          cursor = selected.start + 4;
        }

        // Tetapkan pilihannya
        this.__setSelection(cursor, cursor + chunk.length);
        this.__updateInput()
      },
      addLine() {
        this.__updateInput('\n' + this.__localize('lineText'));
      },
      addQuote() {
        let chunk, cursor, selected = this.__getSelection();

        // Ganti pilihan dan atur kursor ke potongan sebelumnya
        if (selected.length === 0) {
          // Berikan konten tambahan
          chunk = this.__localize('quoteText');

          this.__replaceSelection('\n> ' + chunk);

          // atur posisi kursor
          cursor = selected.start + 3;
        } else {
          if (selected.text.indexOf('\n') < 0) {
            chunk = selected.text;

            this.__replaceSelection('> ' + chunk);

            // atur posisi kursor
            cursor = selected.start + 2;
          } else {
            let list = [];

            list = selected.text.split('\n');
            chunk = list[0];

            list.forEach(function (k, v) {
              list[k] = '> ' + v;
            });

            this.__replaceSelection('\n\n' + list.join('\n'));

            // atur posisi kursor
            cursor = selected.start + 4;
          }
        }

        // Tetapkan pilihannya
        this.__setSelection(cursor, cursor + chunk.length);
        this.__updateInput()
      },
      addCode() {
        let chunk, cursor, selected = this.__getSelection(), content = this.__getContent();

        if (selected.length === 0) {
          // Berikan konten tambahan
          chunk = this.__localize('codeText');
        } else {
          chunk = selected.text;
        }

        // Ganti pilihan dan atur kursor ke potongan sebelumnya
        if (content.substr(selected.start - 4, 4) === '```\n'
          && content.substr(selected.end, 4) === '\n```') {
          this.__setSelection(selected.start - 4, selected.end + 4);
          this.__replaceSelection(chunk);
          cursor = selected.start - 4;
        } else if (content.substr(selected.start - 1, 1) === '`'
          && content.substr(selected.end, 1) === '`') {
          this.__setSelection(selected.start - 1, selected.end + 1);
          this.__replaceSelection(chunk);
          cursor = selected.start - 1;
        } else if (content.indexOf('\n') > -1) {
          this.__replaceSelection('```\n' + chunk + '\n```');
          cursor = selected.start + 4;
        } else {
          this.__replaceSelection('`' + chunk + '`');
          cursor = selected.start + 1;
        }

        // Tetapkan pilihannya
        this.__setSelection(cursor, cursor + chunk.length);
        this.__updateInput()
      },
      addLink() {
        let chunk, cursor, selected = this.__getSelection(), link;

        if (selected.length === 0) {
          // Berikan konten tambahan
          chunk = this.__localize('linkText');
        } else {
          chunk = selected.text;
        }

        link = prompt(this.__localize('linkTip'), 'http://');

        let urlRegex = new RegExp('^((http|https)://|(mailto:)|(//))[a-z0-9]', 'i');
        if (link !== null && link !== '' && link !== 'http://' && urlRegex.test(link)) {
          let div = document.createElement('div');
          div.appendChild(document.createTextNode(link));
          let sanitizedLink = div.innerHTML;

          // Ganti pilihan dan atur kursor ke potongan sebelumnya
          this.__replaceSelection('[' + chunk + '](' + sanitizedLink + ')');
          cursor = selected.start + 1;

          // Tetapkan pilihannya
          this.__setSelection(cursor, cursor + chunk.length);
        }
        this.__updateInput()
      },
      addImage() {
        let chunk, cursor, selected = this.__getSelection(), link;

        if (selected.length === 0) {
          // Berikan konten tambahan
          chunk = this.__localize('imageText');
        } else {
          chunk = selected.text;
        }

        link = prompt(this.__localize('imageTip'), 'http://');

        let urlRegex = new RegExp('^((http|https)://|(//))[a-z0-9]', 'i');
        if (link !== null && link !== '' && link !== 'http://' && urlRegex.test(link)) {
          let div = document.createElement('div');
          div.appendChild(document.createTextNode(link));
          let sanitizedLink = div.innerHTML;

          // Ganti pilihan dan atur kursor ke potongan sebelumnya
          this.__replaceSelection('\n![' + chunk + '](' + sanitizedLink + ' "' + this.__localize('imageTitle') + '")');
          cursor = selected.start + 3;

          // Tetapkan pilihannya
          this.__setSelection(cursor, cursor + chunk.length);
        }
        this.__updateInput()
      },
      addTable() {
        let chunk, cursor, selected = this.__getSelection();

        if (selected.length === 0) {
          // Berikan konten tambahan
          chunk = '\n' + this.__localize('tableText');
        } else {
          chunk = selected.text;
        }

        // Ganti pilihan dan atur kursor ke potongan sebelumnya
        this.__replaceSelection(chunk);
        cursor = selected.start;

        // Tetapkan pilihannya
        this.__setSelection(cursor, cursor + chunk.length);
        this.__updateInput()
      },
      addUl() {
        let chunk, cursor, selected = this.__getSelection();

        // Ganti pilihan dan atur kursor ke potongan sebelumnya
        if (selected.length === 0) {
          // Berikan konten tambahan
          chunk = this.__localize('ulText');

          this.__replaceSelection('- ' + chunk);
          // atur posisi kursor
          cursor = selected.start + 2;
        } else {
          if (selected.text.indexOf('\n') < 0) {
            chunk = selected.text;

            this.__replaceSelection('- ' + chunk);

            // atur posisi kursor
            cursor = selected.start + 2;
          } else {
            let list = [];

            list = selected.text.split('\n');
            chunk = list[0];

            list.forEach(function (k, v) {
              list[k] = '- ' + v;
            });

            this.__replaceSelection('\n\n' + list.join('\n'));

            // atur posisi kursor
            cursor = selected.start + 4;
          }
        }

        // Tetapkan pilihannya
        this.__setSelection(cursor, cursor + chunk.length);
        this.__updateInput()
      },
      addOl() {
        let chunk, cursor, selected = this.__getSelection();

        // Ganti pilihan dan atur kursor ke potongan sebelumnya
        if (selected.length === 0) {
          // Berikan konten tambahan
          chunk = this.__localize('olText');
          this.__replaceSelection('1. ' + chunk);
          // atur posisi kursor
          cursor = selected.start + 3;
        } else {
          if (selected.text.indexOf('\n') < 0) {
            chunk = selected.text;

            this.__replaceSelection('1. ' + chunk);

            // atur posisi kursor
            cursor = selected.start + 3;
          } else {
            let list = [];

            list = selected.text.split('\n');
            chunk = list[0];

            list.forEach(function (k, v) {
              list[k] = '1. ' + v;
            });

            this.__replaceSelection('\n\n' + list.join('\n'));

            // Atur kursor
            cursor = selected.start + 5;
          }
        }

        // Tetapkan pilihannya
        this.__setSelection(cursor, cursor + chunk.length);
        this.__updateInput()
      },
      fullscreen() {

      },
      __saveDom() {
        this.vmd = this.$refs.vmd;
        this.vmdBody = this.$refs.vmdBody;
        this.vmdHeader = this.$refs.vmdHeader;
        this.vmdFooter = this.$refs.vmdFooter;
        this.vmdEditor = this.$refs.vmdEditor;
        this.vmdPreview = this.$refs.vmdPreview;
      },
      __removeDom() {
        this.vmd = null;
        this.vmdBody = null;
        this.vmdHeader = null;
        this.vmdFooter = null;
        this.vmdEditor = null;
        this.vmdPreview = null
      },
      __resize() {
        let vmdHeaderOffset = this.vmdHeader ? this.vmdHeader.offsetHeight : 0,
          vmdFooterOffset = this.vmdFooter ? this.vmdFooter.offsetHeight : 0;
        this.vmdBody.style.height = (this.vmd.offsetHeight - vmdHeaderOffset - vmdFooterOffset) + 'px';
      },
      __updateInput(txt) {
        if (txt) {
          this.vmdEditor.value += txt
        }

        if (!this.$props.value) {
          this.vmdInput = this.vmdEditor.value;
        } else {
          this.$emit('input', this.vmdEditor.value);
        }
        this.vmdEditor.focus()
      },
      __localize(tag) {
        return locale[this.lang][tag]
      },
      /**
       * Mendapatkan nilai editor
       */
      __getContent() {
        return this.vmdEditor.value
      },
      /**
       * Dapatkan konten yang dipilih
       */
      __getSelection() {
        let e = this.vmdEditor;
        return (
          ('selectionStart' in e && function () {
            let l = e.selectionEnd - e.selectionStart;
            return {start: e.selectionStart, end: e.selectionEnd, length: l, text: e.value.substr(e.selectionStart, l)};
          }) ||

          /* jika browser tidak mendukung */
          function () {
            return null;
          }
        )();
      },
      /**
       * Tetapkan konten yang dipilih
       * @param start
       * @param end
       */
      __setSelection(start, end) {
        let e = this.vmdEditor;
        return (
          ('selectionStart' in e && function () {
            e.selectionStart = start;
            e.selectionEnd = end;
            return null;
          }) ||

          /* jika browser tidak mendukung */
          function () {
            return null;
          }
        )();
      },
      __setCursor(start, end) {
        let e = this.vmdEditor;
        e.focus();
        return (
          ('selectionEnd' in e && function () {
            e.selectionEnd = end;
            return null;
          }) ||

          function () {
            return null;
          }
        )();
      },
      /**
       * Ganti konten yang dipilih
       * @param text
       */
      __replaceSelection(text) {
        let e = this.vmdEditor;
        return (
          ('selectionStart' in e && function () {
            e.value = e.value.substr(0, e.selectionStart) + text + e.value.substr(e.selectionEnd, e.value.length);
            // Set cursor to the last replacement end
            e.selectionStart = e.value.length;
            return null;
          }) ||

          /* jika browser tidak mendukung */
          function () {
            e.value += text;
            return null;
          }
        )();
      }
    }
  }
</script>

<style scoped>
  *:focus {
    outline: none;
  }

  *, :after, :before {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .vmd {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border: thin solid #ddd;
    text-align: left;
    margin-top: 15px; 
    /*-webkit-border-radius: 5px;*/
    /*-moz-border-radius: 5px;*/
    /*border-radius: 5px;*/
    -webkit-transition: all .3s linear;
    -moz-transition: all .3s linear;
    -ms-transition: all .3s linear;
    -o-transition: all .3s linear;
    transition: all .3s linear;
  }

  .vmd.active {
    /*border-color: #4395ff;*/
  }

  .vmd .vmd-header, .vmd .vmd-footer {
    display: block;
    padding: 6px;
    border-bottom: thin solid #ddd;
    background: #f5f5f5;
  }

  .vmd .vmd-header {
    border-bottom: thin solid #ddd;
  }

  .vmd .vmd-footer {
    border-top: thin solid #ddd;
  }

  .vmd .vmd-body {
    height: inherit;
  }

  .vmd-body .vmd-editor, .vmd-body .vmd-preview {
    display: block;
    padding: .8rem;
    height: inherit;
    width: 50%;
    min-height: 400px;
    float: left;
    overflow: auto;
  }

  .vmd-body .vmd-editor {
    color: #3d4043;
    /*font-size: 1rem;*/
    /*line-height: 1.2rem;*/
    border: 0;
    resize: none;
    /*background: #00d1b2;*/
   
  }
  
  .vmd-body .vmd-preview {
    background: #fff;
    border-left: 1px dashed #eee;
  }

  .vmd-btn {
    display: inline-block;
    padding: 6px 12px;
    margin-bottom: 0;
    font-size: 12px;
    font-weight: 400;
    line-height: 1.42857143;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-image: none;
    border: 1px solid transparent;
    border-radius: 2px;
  }

  .vmd-btn:hover {
    color: #333;
    text-decoration: none;
  }

  .vmd-btn:active,
  .vmd-btn.active {
    background-image: none;
    outline: 0;
    -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, .125);
    box-shadow: inset 0 3px 5px rgba(0, 0, 0, .125);
  }

  .vmd-btn:focus {
    outline: none;
  }

  .vmd-btn-default {
    color: #333;
    background-color: #fff;
    border-color: #ccc;
  }

  .vmd-btn-default:hover {
    color: #333;
    background-color: #e6e6e6;
    border-color: #adadad;
  }

  .vmd-btn-default:active,
  .vmd-btn-default.active {
    color: #333;
    background-color: #e6e6e6;
    border-color: #adadad;
  }

  .vmd-btn-borderless {
    padding-top: 7px;
    padding-bottom: 7px;
    border: 0;
  }

  .vmd-btn-borderless, .vmd-btn-borderless:hover, .vmd-btn-borderless:active, .vmd-btn-borderless.active {
    box-shadow: none;
    background-color: transparent;
  }

  .vmd-btn-default:hover.vmd-btn-borderless {
    opacity: .5;
  }

  .vmd-btn-default:active.vmd-btn-borderless, .vmd-btn-default.active.vmd-btn-borderless {
    opacity: .7;
  }

  .vmd-btn-group {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    margin-right: 5px;
  }

  .vmd-btn-group > .vmd-btn {
    position: relative;
    float: left;
  }

  .vmd-btn-group > .vmd-btn:hover,
  .vmd-btn-group > .vmd-btn:focus,
  .vmd-btn-group > .vmd-btn:active,
  .vmd-btn-group > .vmd-btn.active {
    z-index: 2;
  }

  .vmd-btn-group .vmd-btn + .vmd-btn,
  .vmd-btn-group .vmd-btn + .vmd-btn-group,
  .vmd-btn-group .vmd-btn-group + .vmd-btn,
  .vmd-btn-group .vmd-btn-group + .vmd-btn-group {
    margin-left: -1px;
  }

  .vmd-btn-group > .vmd-btn:not(:first-child):not(:last-child):not(.dropdown-toggle) {
    border-radius: 0;
  }

  .vmd-btn-group > .vmd-btn:first-child {
    margin-left: 0;
  }

  .vmd-btn-group > .vmd-btn:first-child:not(:last-child):not(.dropdown-toggle) {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
  }

  .vmd-btn-group > .vmd-btn:last-child:not(:first-child) {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }

  .vmd-btn-group > .vmd-btn-group {
    float: left;
  }

  .vmd-btn-group > .vmd-btn-group:not(:first-child):not(:last-child) > .vmd-btn {
    border-radius: 0;
  }

  .vmd-btn-group > .vmd-btn-group:first-child:not(:last-child) > .vmd-btn:last-child {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
  }

  .vmd-btn-group > .vmd-btn-group:last-child:not(:first-child) > .vmd-btn:first-child {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }

  .vmd-body:before, .vmd-body:after,
  .vmd-btn-group:before, .vmd-btn-group:after {
    display: table;
    content: '';
  }

  .vmd-body:after,
  .vmd-btn-group:after {
    clear: both;
  }
</style>
