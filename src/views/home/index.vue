<template>
  <div class="home-container">
    <van-nav-bar class="page-nav-bar" fixed>
      <template #right>
        <van-button
          type="info"
          size="samll"
          round
          icon="search"
          class="search-button"
          to="/search"
        >
          搜索
        </van-button>
      </template>
    </van-nav-bar>
    <van-tabs class="channels-tabs" v-model:active="active">
      <van-tab
        :title="channel.name"
        v-for="channel in channels"
        :key="channel.id"
      >
        <article-list :channel="channel"></article-list>
      </van-tab>
      <template #nav-right>
        <i class="placeholder"></i>
        <van-icon
          name="wap-nav"
          class="hamburger-btn"
          @click="isChannelEditShow = true"
        ></van-icon>
      </template>
    </van-tabs>
    <van-popup
      v-model:show="isChannelEditShow"
      closeable
      position="bottom"
      close-icon-position="top-left"
      :style="{ height: '100%' }"
    >
      <ChannelEdit
        :my-channels="channels"
        :active="active"
        @update-active="onUpdateActive"
      ></ChannelEdit
    ></van-popup>
  </div>
</template>

<script>
import { onMounted, reactive, ref, toRefs } from "vue";
import { getUserChannels, getCurrentChannels } from "../../api/user";
import ArticleList from "./components/article-list.vue";
import ChannelEdit from "./components/channel-edit.vue";
import { useStore } from "vuex";

function useChannes() {
  const state = reactive({
    channels: [],
    isChannelEditShow: false,
  });
  const store = useStore();
  const loadChannels = async () => {
    let channels = [];
    if (store.state.user) {
      // 已登录
      const { data } = await getCurrentChannels(store.state.user.data.id);
      channels = data;
    } else {
      // 未登录
      const localChannels = await getItem("TOUTIAO_CHANNELS");
      if (localChannels) {
        channels = loadChannels;
      } else {
        // 如果本地没有 获取默认列表数据
        const { data } = await getUserChannels();
        channels = data;
      }
    }
    state.channels = channels;
  };
  onMounted(() => {
    loadChannels();
  });
  return {
    state,
  };
}
function useUpdataActive(active, state) {
  const onUpdateActive = (index, isChannelEditShow = true) => {
    active.value = index;
    state.isChannelEditShow = false;
  };
  return { onUpdateActive };
}
export default {
  components: {
    ArticleList,
    ChannelEdit,
  },
  setup() {
    const active = ref(0);
    const { state } = useChannes();
    return { active, ...toRefs(state), ...useUpdataActive(active, state) };
  },
};
</script>

<style>
.home-container .search-button {
  width: 600px;
  height: 60px;
  background-color: #5babfb;
  border: none;
  font-size: 30px;
  color: #fff;
  margin-right: 40px;
}
.channels-tabs .van-tab {
  min-width: 240px;
  border-right: 1px solid #edeff3;
  font-size: 30px;
  color: #777;
}
.channels-tabs .van-tab--active {
  color: red;
}
.channels-tabs .van-tabs__line {
  background-color: #3296fa;
  width: 40px;
  height: 12px;
}
.channels-tabs .hamburger-btn {
  /* 固定定位 */
  position: fixed;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90px;
  height: 64px;
  background-color: #fff;
  /* 设置透明度 */
  opacity: 0.902;
  /* 设置图标的大小 */
  font-size: 46px;
}
.channels-tabs .placeholder {
  flex-shrink: 0;
  width: 90px;
  height: 64px;
}
.channels-tabs .van-tabs__wrap {
  position: fixed;
  top: 92px;
  left: 0;
  right: 0;
  z-index: 1;
}
</style>