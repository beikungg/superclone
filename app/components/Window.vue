<template>
  <a-card>
    <h1 style="font-size: 30px;">北鲲-You are a TomCat</h1>
    <a-upload-dragger v-model=fileList name="file" :show-upload-list="false" :multiple="true"
      :before-upload="handleBeforeUpload" accept="audio/*" height="200px">
      <p class="ant-upload-text" style="margin-top: 60px;">点击或拖拽</p>
      <p class="ant-upload-hint">
        单个或者多个音频文件
      </p>
    </a-upload-dragger>
  </a-card>



  <a-card style="margin-top: 20px;">
    <h2>上传的音频文件</h2>

    <div class="custom-filter-dropdown" v-show="filterDropdownVisible">
      <a-input placeholder="Search name" v-model="searchText" @change="onInputChange" @pressEnter="onSearch"
        style="width:520px" />
      <a-button type="primary" :disabled="fileList.length == 0" @click="onSearch"
        style="width: 80px;margin-left:20px;margin-top: 4px;  position: absolute;">Search</a-button>

      <a-button type="primary" :disabled="selectedRowKeysReal.length == 0" @click="confirmDelete"
        style="width: 100px;margin-top: 4px;margin-left: 180px;position: absolute;">
        批量删除
      </a-button>

      <a-button type="primary" :disabled="selectedRowKeysReal.length == 0" @click="showCharacterInfo1()"
        style="width: 100px;margin-top: 4px;margin-left: 360px;position: absolute;">
        批量选音</a-button>

      <a-modal :visible="modalVisible1" style="width: 1400px;" title="音色信息" @ok="closeCharacterInfo1()"
        @cancel="closeCharacterInfo1()">
        <a-modal :visible="moxingLoading" :footer="null" :closable="false">
          预载模型大概需要15秒时间，请耐心等待owo...
        </a-modal>
        <a-alert message="可以尝试转换多个音频，可以大幅提高推理速度  ^w^ " type="success" />
        <a-table :columns="characterColumns" :dataSource="CharacterdataSource" rowKey="personid" pagination="false">
          <template #listenVoice="record1">
            <audio controls style="width: 240px;">
              <source :src="record1.value" type="audio/mpeg" />

            </audio>
          </template>

          <template #selectcharacter="record2">
            <a-button @click="selectMorePersonVoice(record2.value)" style="">选择音色</a-button>
          </template>




        </a-table>
      </a-modal>


      <a-button type="primary" :disabled="selectedRowKeysReal.length == 0" @click="handleBatchConversion"
        style="width: 100px;margin-top: 4px;margin-left: 540px;position: absolute;">
        批量转换
      </a-button>

      <a-button type="primary" :disabled="selectedRowKeysReal.length == 0" @click="confirmDownload"
        style="width: 100px;margin-top: 4px;margin-left: 720px;position: absolute;">
        批量下载
      </a-button>

      <a-button type="primary" :disabled="fileList.length == 0" @click="confirmDeleteAll"
        style="width: 100px;margin-top: 4px;margin-left: 900px;position: absolute;">
        清空列表
      </a-button>

      <a-button type="primary" :disabled="tipsLoading" @click="tipsLoading = true"
        style="width: 100px;margin-top: 4px;margin-left: 1080px;position: absolute;">
        tips
      </a-button>

      <a-modal :visible="tipsLoading" style="width: 800px;" title="小贴士" @ok="tipsLoading = false"
        @cancel="tipsLoading = false">
        <a-alert message="1、音频转换中间有文件传输过程，为保证转换速度，请尽量不要传输过大文件(建议10mb以内)         ૮₍ •̥𖥦•̥ ♡ ₎ა " type="success"
          style="margin-top: 10px;" />

        <a-alert message="2、长音频推理时有音频切片过程，为保证转换速度，请尽量不要传输过长文件(建议60s以内,越短越快)  ૮⌯'ㅅ'⌯ ა" type="success"
          style="margin-top: 10px;" />

        <a-alert message="3、音频转换中间有文件传输过程，为保证转换速度，建议您在良好的网络连接速度下转换(避免使用代理)  ⊂₍ •ᴥ• ₎っ " type="success"
          style="margin-top: 10px;" />
      </a-modal>



    </div>
    <a-table :columns="columns" :dataSource="fileList" :rowSelection="rowSelection" rowKey="uid" pagination="false">

      <template #play="record">
        <audio controls style="width: 300px; margin-top: 10px;">
          <source :src="record.value" type="audio/mpeg" />
        </audio>
      </template>



      <template #characterSelection="record">
        <a-button @click="showCharacterInfo(record.value)">选择音色</a-button>

        <a-modal :visible="modalVisible" style="width: 1400px;" title="音色信息" @ok="closeCharacterInfo()"
          @cancel="closeCharacterInfo()">
          <a-modal :visible="moxingLoading" :footer="null" :closable="false">
            预载模型大概需要15秒时间，请耐心等待owo...
          </a-modal>
          <a-alert message="可以尝试转换多个音频，可以大幅提高推理速度 ^w^ " type="success" />
          <a-table :columns="characterColumns" :dataSource="CharacterdataSource" rowKey="personid" pagination="false">
            <template #listenVoice="record1">

              <audio controls style="width: 240px;">
                <source :src="record1.value" type="audio/mpeg" />
              </audio>
            </template>
            <template #selectcharacter="record2">
              <a-button @click="selectPersonVoice(tempvalue, record2.value)" style="">选择音色</a-button>
            </template>

          </a-table>

        </a-modal>
      </template>

      <template #voicename="record">
        <span style=" ">{{ showVoiceName(record.value) }}</span>
      </template>

      <template #action="record">
        <a-button :disabled="false" :loading="loading[record.value]" :ref="'convertButton-' + record.value"
          @click="convertAudio(record.value)" style="">一键转换</a-button>
      </template>

      <template #result="record">
        <audio :src="record.value" controls style="width: 300px; margin-top: 10px;">
        </audio>
      </template>


      <template #download="record">
        <a-button :disabled="record.value == '1'" style="width:100px;height:50px" @click="downloadLink(record.value)">
          <VerticalAlignBottomOutlined style="font-size: 30px;" type="vertical-align-bottom" />
        </a-button>
      </template>

      <template #delete="record">
        <DeleteOutlined type="delete" style="font-size: 30px;margin-left: 10px;"
          @click="confirmDeleteSingle(record.value)" />
      </template>




    </a-table>
  </a-card>
</template>

<script>
import { PlayCircleOutlined, DeleteOutlined, VerticalAlignBottomOutlined, PauseCircleOutlined } from "@ant-design/icons-vue";
import { message, Modal } from 'ant-design-vue';
import axios from "axios";
export default {
  name: "voiceconversion",
  components: { VerticalAlignBottomOutlined, DeleteOutlined, PlayCircleOutlined, PauseCircleOutlined, message, Modal },
  mounted() {
    this.getPersonVoice()
    this.fileList.forEach(item => {
      this.loading[item.uid] = false;
    })
    // 添加 beforeunload 事件监听器
    window.addEventListener('beforeunload', this.handleBeforeUnload);


  },
  beforeDestroy() {
    // 移除 beforeunload 事件监听器
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
  },
  // },
  data() {
    return {

      searchText: '',
      modalVisible: false,
      modalVisible1: false,
      tipsLoading: false,
      fileList: [],
      tempList: [],
      tempUrl: "",
      tempvalue: "",
      tempPersonVoice: -1,
      selectedRowKeysReal: [],
      filterDropdownVisible: true,
      loading: {},
      moxingLoading: false,
      rowSelection: {
        selectedRowKeys1: [],
        onChange: (selectedRowKeys) => {
          this.selectedRowKeys1 = selectedRowKeys;
          this.selectedRowKeysReal = selectedRowKeys;
        },
      },
      columns: [
        {
          title: '源音名称',
          dataIndex: 'name',
          key: 'name',
          width: "180px",
          ellipsis: true,
        },
        {
          title: '源音播放',
          key: 'play',
          dataIndex: 'url',
          slots: { customRender: 'play' },
          width: "220px",
          ellipsis: true,
        },
        {
          title: '选择音色',
          key: 'characterSelection',
          dataIndex: 'uid',
          slots: { customRender: 'characterSelection' },
          width: "80px",
          ellipsis: true,
        },
        {
          title: '音色来源',
          key: 'voicename',
          dataIndex: 'personid',
          slots: { customRender: 'voicename' },
          width: "80px",
          ellipsis: true,
        },
        {
          title: '一键转换',
          key: 'action',
          dataIndex: 'uid',
          slots: { customRender: 'action' },
          width: "100px",
          ellipsis: true,
        },
        {
          title: '转换结果',
          key: 'result',
          dataIndex: 'resulturl',
          slots: { customRender: 'result' },
          width: "220px",
          ellipsis: true,
        },
        {
          title: '下载音频',
          key: 'download',
          dataIndex: 'resulturl',
          slots: { customRender: 'download' },
          width: "100px",
          ellipsis: true,
        },
        {
          title: '删除音频',
          key: 'delete',
          dataIndex: 'uid',
          slots: { customRender: 'delete' },
          width: "100px",
          ellipsis: true,
        },


      ],
      characterColumns: [{
        title: 'Our TomCats',
        dataIndex: 'personName',
        key: 'name',
        width: "100px",
        ellipsis: true,
      },
      {
        title: '声音性别',
        key: 'sex',
        dataIndex: 'personSex',
        width: "100px",
        ellipsis: true,
      },
      {
        title: '音色描述',
        key: 'introduction',
        dataIndex: 'personIntroduction',
        width: "150px",
        ellipsis: true,
      },
      {
        title: '音色试听',
        key: 'listenVoice',
        dataIndex: 'personVoiceUrl',
        slots: { customRender: 'listenVoice' },
        width: "200px",
        ellipsis: true,
      },
      {
        title: '选择音色',
        key: 'selectcharacter',
        dataIndex: 'personid',
        slots: { customRender: 'selectcharacter' },
        width: "100px",
        ellipsis: true,
      },

      ],
      CharacterdataSource: [
        {
          key: '1',
          personid: 0,
          personName: "干净男声",
          personSex: "男",
          personIntroduction: "中青年 温和 成熟 温暖",
          personVoiceUrl: "data1/pengfei/voice/pxp2_540.wav",
          loaded: false,
        },
        {
          key: '2',
          personid: 1,
          personName: "干净女声",
          personSex: "女",
          personIntroduction: "青少年 认真 朝气 谨慎",
          personVoiceUrl: "data1/xiaoqingnv/voice/default.wav",
          loaded: false,
        },
        {
          key: '3',
          personid: 2,
          personName: "TomZZP",
          personSex: "男",
          personIntroduction: "青年 中低音 微磁性 平实",
          personVoiceUrl: "data1/zzp/voice/default.wav",
          loaded: false,
        }
      ],
    }
  },


  methods: {
    clearModel() {
      axios.get(`tools/clearModel`)
    },
    handleBeforeUnload(event) {
      // this.clearModel();
    },
    // 下面这个代码暂时不使用，除非需求是单个声音选择性加载的时候
    async loadPersonVoice(tempid) {
      let num = 0
      let path = this.convertPath(tempid)
      if (this.modalVisible) {
        this.modalVisible = false
        num = 0
      }
      if (this.modalVisible1) {
        this.modalVisible1 = false
        num = 1
      }
      this.moxingLoading = true
      for (let item of this.CharacterdataSource) {
        item.loaded = false
      }
      // const responsetemp = await axios.get(`tools/clearModel`)
      let speaker_num = String(tempid)
      const response = await axios.get(`tools/getModel?path=${path}&speaker_num=${speaker_num}`)
      if (response.status == 200) {
        message.success("音色预载成功!")
        this.CharacterdataSource[tempid]["loaded"] = true
        if (num == 0) {
          this.modalVisible = true
        }
        if (num == 1) {
          this.modalVisible1 = true
        }
        this.moxingLoading = false
      }
    },
    // 加载对应音色的声音信息
    async getPersonVoice() {
      for (let item of this.CharacterdataSource) {
        const response2 = await axios.get(`tools/get_audio1?path=${item["personVoiceUrl"]}`, { responseType: 'blob' })
        const audioBlob = new Blob([response2.data]);
        const newFile = new File([audioBlob], "random.mp3")
        item["personVoiceUrl"] = URL.createObjectURL(newFile);
      }
    },

    convertPath(tempid) {
      switch (tempid) {
        case 0:
          return "data1/pengfei/models"
        case 1:
          return "data1/xiaoqingnv/models"
        case 2:
          return "data1/zzp/models"
      }
    },
    convertModelName(tempid) {
      switch (tempid) {
        case 0:
          return "100percent"
        case 1:
          return "xiaoqingnv"
        case 2:
          return "zzp"
      }
    },
    handleBatchConversion() {
      let downloadList = []
      downloadList = this.fileList.filter(item => this.selectedRowKeysReal.includes(item.uid));
      // downloadList.forEach(item => {
      //   if(item.resulturl!="1"){
      //   let tempdownloadLink = document.createElement('a');
      //   tempdownloadLink.href = item.resulturl;
      //   tempdownloadLink.download = item.resultname;
      //   tempdownloadLink.click()
      //   }
      // }
      // )
      this.selectedRowKeysReal.forEach(item => {
        const buttonRef = this.$refs[`convertButton-${item}`];
        if (buttonRef) {
          // 检查 buttonRef 是数组还是单个元素
          const button = Array.isArray(buttonRef) ? buttonRef[0] : buttonRef;
          if (button && button.$el) {
            button.$el.click(); // 触发按钮的点击事件
            // button.$el.disabled =true
          } else {
          }
        } else {
        }
      });

    },
    showVoiceName(tempid) {
      switch (tempid) {
        case -1:
          return "未选择"
        case 0:
          return "干净男声"
        case 1:
          return "干净女声"
        case 2:
          return "TomZZP"

      }
    },
    selectPersonVoice(tempid, tempid1) {
      this.fileList.forEach(item => {
        if (item.uid == tempid) {
          item.personid = tempid1
        }
      });

      this.modalVisible = false
    },
    selectMorePersonVoice(tempid1) {
      this.fileList.forEach(item => {

        if (this.selectedRowKeysReal.includes(item.uid)) {
          item.personid = tempid1
        }
      })

      this.tempList.forEach(item => {
        if (this.selectedRowKeysReal.includes(item.uid)) {
          item.personid = tempid1
        }
      })
      this.modalVisible1 = false

    },


    showCharacterInfo(tempid) {
      this.tempvalue = tempid
      this.modalVisible = true;
    },
    showCharacterInfo1() {
      this.modalVisible1 = true;
    },
    closeCharacterInfo() {
      this.modalVisible = false;
    },
    closeCharacterInfo1() {
      this.modalVisible1 = false;
    },
    onInputChange(e) {
      this.searchText = e.target.value;
    },
    onSearch() {

      if (this.fileList.length < this.tempList.length) {
        this.fileList = this.tempList
      }
      else {
        this.tempList = this.fileList;
      }

      if (this.searchText == "") {
        this.fileList = this.tempList
      } else {
        this.fileList = this.fileList.filter(item =>
          item.name.includes(this.searchText)
        );
      }

    },


    async convertAudio(tempid) {
      let url = "/voice2"
      let convertList = this.fileList.filter(item => item.uid === tempid);
      const buttonRef = this.$refs[`convertButton-${tempid}`];
      const button = Array.isArray(buttonRef) ? buttonRef[0] : buttonRef;
      if (convertList.length > 0) {
        for (let item of convertList) {
          if (item.personid != -1) {
            message.success(`正在转换 ${item.name}`);
            if (button && button.$el) {
              this.loading[tempid] = true;
              button.$el.disabled = true;

            }
            let params = {
              name: item.name,
              sid: this.convertModelName(item.personid),
              speaker_num: String(item.personid)
            }
            const response = await fetch(item.url);
            const blob = await response.blob();

            const audio_file = new File([blob], item.name)
            // 创建 FormData 并添加 Blob 对象
            const formData = new FormData();
            formData.append('file', audio_file);

            let retry1 = true;
            while (retry1) {
              // 使用 Axios 发送 POST 请求
              const response1 = await axios.post(url, formData, {
                timeout: 120000,
                params: params,
                headers: {
                  'Content-Type': 'multipart/form-data',
                }
              });
              if (response1.status === 200) {
                if (button && button.$el) {
                  button.$el.disabled = false;
                  this.loading[tempid] = false;
                }
                retry1 = false;
                message.success(`${item.name}转换成功`);
                const data = response1.data.data;
                const audioPath = data.audio_path;
                item.resultname = data.resultname
                // item.resulturl=`tools/get_audio1?path=${audioPath}`
                // const response2 = await axios.get(`tools/get_audio1?path=${audioPath}`, {responseType: 'blob'})
                // const audioBlob = new Blob([response2.data]);
                // const newFile = new File([audioBlob], "random.mp3")
                let retry = true;
                while (retry) {
                  const response2 = await axios.get(`tools/get_audio1?path=${audioPath}`, { responseType: 'blob' });
                  if (response2.status === 200) {
                    item.resulturl = URL.createObjectURL(response2.data);
                    retry = false;
                  } else {

                    // You can add a delay here if you want to wait between retries
                    // For example: await new Promise(resolve => setTimeout(resolve, 1000));
                  }
                }

              } else {
                message.error(`${item.name}转换失败`);
                if (button && button.$el) {
                  button.$el.disabled = false;
                  this.loading[tempid] = false;
                }
              }
            }

          }
          else {
            message.error(`${item.name}未选择音色`)
          }
        };
      } else {
        message.warning('未找到匹配的音频文件');
      }
    },
    confirmDeleteAll() {
      Modal.confirm({
        title: '确认清空',
        content: '确定要确认清空页面所有音频文件吗？',
        onOk: this.deleteAll
      });
    },
    confirmDelete() {
      Modal.confirm({
        title: '确认删除',
        content: '确定要删除选中的所有音频文件吗？',
        onOk: this.deleteSelected
      });
    },
    confirmDeleteSingle(tempid) {
      Modal.confirm({
        title: '确认删除',
        content: '确定要删除选中的这个音频文件吗？',
        onOk: () => {
          this.deleteUrl(tempid);
        }
      });
    },
    confirmDownload() {
      Modal.confirm({
        title: '确认清空',
        content: '确定要下载所有已转换成功的音频文件吗？',
        onOk: this.downloadSelected
      });
    },

    deleteSelected() {
      this.fileList = this.fileList.filter(item => !this.selectedRowKeysReal.includes(item.uid));
      this.tempList = this.tempList.filter(item => !this.selectedRowKeysReal.includes(item.uid));
      this.rowSelection.selectedRowKeys1 = [];
      this.selectedRowKeysReal = [];
      message.success('选中的文件已删除');
    },
    downloadSelected() {
      let downloadList = []

      downloadList = this.fileList.filter(item => this.selectedRowKeysReal.includes(item.uid));
      downloadList.forEach(item => {
        if (item.resulturl != "1") {
          let tempdownloadLink = document.createElement('a');
          tempdownloadLink.href = item.resulturl;
          tempdownloadLink.download = item.resultname;
          tempdownloadLink.click()
        }
      })


    },
    deleteAll() {
      this.fileList = [];
      this.tempList = [];
      this.rowSelection.selectedRowKeys1 = [];
      this.selectedRowKeysReal = [];
      message.success('页面已清空');
    },
    deleteUrl(tempid) {
      this.fileList = this.fileList.filter(item => (item.uid != tempid));
      this.tempList = this.tempList.filter(item => (item.uid != tempid));
      message.success('该音频文件已删除');
    },
    handleBeforeUpload(file) {
      const url = URL.createObjectURL(file);
      const type = file.type;
      this.fileList.push({
        uid: file.uid,
        name: file.name,
        url: url,
        type: type,
        resulturl: "1",
        personid: -1,
        resultname: "",
      });
      return false;
    }
    ,
    downloadLink(fileUrl) {
      this.fileList.forEach(item => {
        if (item.resulturl == fileUrl) {
          const tempdownloadLink = document.createElement('a');
          tempdownloadLink.href = fileUrl;
          tempdownloadLink.download = item.resultname;
          tempdownloadLink.click()
        }
      });

    },


  },
  computed: {

  },
}

</script>


<style scoped>
.data-card-enter-active {
  transition: all 0.3s ease-out;
}

.data-card-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.data-card-enter-from,
.data-card-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.custom-filter-dropdown {
  padding: 8px;
  border-radius: 6px;
  background: #fff;
  box-shadow: 0 1px 6px rgba(0, 0, 0, .2);
  margin-bottom: 10px;
}

.custom-filter-dropdown input {
  width: 130px;
  margin-top: 4px;
  margin-bottom: 4px;
}

.highlight {
  color: #f50;
}

.ant-table-thead>tr>th {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ant-table-tbody>tr>td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
