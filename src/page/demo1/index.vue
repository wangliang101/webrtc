<template>
  <div class="demo1_wrap">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form :inline="true" :model="formInline" class="demo1_form-inline">
          <el-form-item label="请选择摄像头">
            <el-select v-model="formInline.videoId" placeholder="摄像头">
              <el-option
                v-for="(item, index) in localDevice.videoIn"
                :key="index"
                :label="item.label"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="请选择麦克风">
            <el-select v-model="formInline.audioInId" placeholder="麦克风">
              <el-option
                v-for="(item, index) in localDevice.audioIn"
                :key="index"
                :label="item.label"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="请选择听筒">
            <el-select v-model="formInline.audioOutId" placeholder="听筒">
              <el-option
                v-for="(item, index) in localDevice.audioOut"
                :key="index"
                :label="item.label"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分辨率:Width">
            <el-input v-model="formInline.width"></el-input>
          </el-form-item>
          <el-form-item label="分辨率:Hight">
            <el-input v-model="formInline.height"></el-input>
          </el-form-item>
          <el-form-item label="FPS">
            <el-input v-model="formInline.frameRate"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">确认</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <video id="demo1-video" autoplay controls muted></video>
    </el-row>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
const localDevice = reactive({
  audioIn: [],
  videoIn: [],
  audioOut: [],
});
const formInline = reactive({
  videoId: undefined,
  audioInId: undefined,
  audioOutId: undefined,
  width: 1080,
  height: 720,
  frameRate: 240,
});

const handleErr = (err) => {
  console.error('navigator.MediaDevices.getUserMedia error: ', err.message, err.name);
};

console.log('formInline', formInline);

const initInnerLocalDevice = () => {
  // localDevice = {
  //   audioIn: [],
  //   videoIn: [],
  //   audioOut: [],
  // };
  let constraints = { video: true, audio: true };
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    console.log('浏览器不支持获取媒体设备');
    return;
  }
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      stream.getTracks().forEach((track) => track.stop());
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        devices.forEach((device) => {
          let obj = { id: device.deviceId, kind: device.kind, label: device.label };
          if (
            device.kind === 'audioinput' &&
            localDevice.audioIn.filter((e) => e.id === device.deviceId).length === 0
          ) {
            localDevice.audioIn.push(obj);
          }
          if (
            device.kind === 'audiooutput' &&
            localDevice.audioOut.filter((e) => e.id === device.deviceId).length === 0
          ) {
            localDevice.audioOut.push(obj);
          }
          if (
            device.kind === 'videoinput' &&
            localDevice.videoIn.filter((e) => e.id === device.deviceId).length === 0
          ) {
            localDevice.videoIn.push(obj);
          }
        });
      });
    })
    .catch(handleErr);
};

const getLocalUserMedia = async (constraints) => {
  return await navigator.mediaDevices.getUserMedia(constraints);
};

const getTargetDeviceMedia = async (videoId, audioId) => {
  const constraints = {
    audio: audioId ? { exact: audioId } : undefined,
    video: {
      deviceId: videoId ? { exact: videoId } : undefined,
      width: formInline.width,
      height: formInline.height,
      frameRate: {
        ideal: formInline.frameRate,
        max: 24,
      },
    },
  };
  if (window.stream) {
    window.stream.getTracks().forEach((track) => track.stop());
  }

  return await getLocalUserMedia(constraints).catch(handleErr);
};
const onSubmit = async (e) => {
  const videoDom = document.getElementById('demo1-video');
  const stream = videoDom.srcObject;
  if (stream) {
    stream.getAudioTracks().forEach((e) => {
      stream.removeTrack(e);
    });
    stream.getVideoTracks().forEach((e) => {
      stream.removeTrack(e);
    });
  }

  let newStream = await getTargetDeviceMedia(formInline.videoId, formInline.audioId);
  videoDom.srcObject = newStream;
  videoDom.muted = true;
};
console.log('localDevice', localDevice);

initInnerLocalDevice();
</script>

<style scoped>
.demo1_wrap {
  height: 96vh;
  width: 96vw;
}
#demo1-video {
  width: 500px;
  height: 400px;
}
</style>
