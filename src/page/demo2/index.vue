<template>
  <div class="demo1_wrap">
    <el-row :gutter="20">
      <el-col>
        <el-button type="primary" @click="onClick">分享屏幕</el-button>
      </el-col>
    </el-row>
    <el-row>
      <video id="demo2-video" autoplay controls muted></video>
    </el-row>
  </div>
</template>

<script setup>
const getShareMedia = async () => {
  const constraints = {
    audio: false,
    video: {
      width: 1920,
      height: 1080,
    },
  };
  if (window.stream) {
    window.stream.getTracks().forEach((track) => track.stop);
  }
  return await navigator.mediaDevices.getDisplayMedia(constraints);
};

const onClick = async () => {
  const videoDom = document.getElementById('demo2-video');
  const stream = videoDom.srcObject;
  if (stream) {
    stream.getAudioTracks().forEach((e) => stream.removeTrack(track));
    stream.getVideoTracks().forEach((e) => stream.removeTrack(track));
  }
  let newStream = await getShareMedia();
  videoDom.srcObject = newStream;
  videoDom.muted = true;
};
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
