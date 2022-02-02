<template>
  <div class="channel-edit">
    <van-cell>
      <template #title>
        <span class="title-text">我的频道</span>
      </template>
      <template #value>
        <van-button
          type="danger"
          round
          size="mini"
          plain
          class="edit-btn"
          @click="isEdit = !isEdit"
        >
          {{ isEdit ? "完成" : "编辑" }}
        </van-button>
      </template>
    </van-cell>
    <van-grid :gutter="10" class="my-grid">
      <van-grid-item
        v-for="(channel, index) in myChannels"
        :key="channel.id"
        class="grid-item"
        @click="onMyChannelClick(channel, index)"
      >
        <template #default>
          <van-icon
            name="clear"
            v-show="isEdit && !fixChannels.includes(channel.id)"
          ></van-icon>
          <span class="text" :class="{ active: index === active }">
            {{ channel.name }}
          </span>
        </template>
      </van-grid-item>
    </van-grid>
    <van-cell>
      <template #title> <span class="title-text">频道推荐</span> </template>
    </van-cell>
    <van-grid :gutter="10" class="recommend-grid">
      <van-grid-item
        v-for="channel in recommendChannels"
        :key="channel.id"
        icon="plus"
        :text="channel.name"
        class="grid-item"
        @click="onAddChannel(channel)"
      />
    </van-grid>
  </div>
</template>

<script>
import { reactive, onMounted, computed, toRefs } from "vue";
import {
  getAllChannels,
  addUserChannel,
  deleteUserChannel,
} from "../../../api/channel";
import { useStore } from "vuex";
import { setItem } from "../../../utils/storage";
function useChannels(props) {
  const state = reactive({
    allChannels: [],
  });
  const loadAllChannels = async () => {
    const { data } = await getAllChannels();
    state.allChannels = data;
  };
  const recommendChannels = computed(() => {
    const channels = [];
    state.allChannels.forEach((channel) => {
      const result = props.myChannels.find((myChannel) => {
        return myChannel.id == channel.id;
      });
      if (!result) {
        channels.push(channel);
      }
    });
    return channels;
  });
  onMounted(() => {
    loadAllChannels();
  });
  return { recommendChannels };
}
function useAddChannel(props, store) {
  const onAddChannel = async (channel) => {
    props.myChannels.push(channel);
    // 数据持久化
    if (store.state.user) {
      // 已登录 数据存储在客户端
      const channelContent = {
        userId: store.state.user.data.id,
        channel,
      };
      await addUserChannel(channelContent);
    } else {
      // 未登录 数据存储在本地
      setItem("TOUTIAO_CHANNELS", props.myChannels);
    }
  };
  return {
    onAddChannel,
  };
}
function useMyChannelClick(state, emit, { myChannels, active }, store) {
  const onMyChannelClick = async (channel, index) => {
    if (state.isEdit) {
      // 编辑状态
      if (state.fixChannels.includes(channel.id)) {
        // 推荐频道禁止删除
        return;
      }
      if (index <= active) {
        emit("update-active", active - 1, true);
      }
      myChannels.splice(index, 1);
      // 判断用户是否登录
      if (store.state.user) {
        // 已登录
        await deleteUserChannel(channel.id, store.state.user.data.id);
      } else {
        // 未登录
        setItem("TOUTIAO_CHANNELS", myChannels);
      }
    } else {
      // 浏览状态
      emit("update-active", index, false);
    }
  };
  return {
    onMyChannelClick,
  };
}
export default {
  props: {
    myChannels: {
      type: Array,
      required: true,
    },
    active: {
      type: Number,
      required: true,
    },
  },
  emits: ["update-active"],
  setup(props, { emit }) {
    const state = reactive({
      isEdit: false,
      fixChannels: [1],
    });
    const store = useStore();
    return {
      ...useChannels(props),
      ...useAddChannel(props, store),
      ...toRefs(state),
      ...useMyChannelClick(state, emit, props, store),
    };
  },
};
</script>

<style>
.channel-edit {
  padding: 160px 0;
}
.channel-edit .title-text {
  font-size: 40px;
  color: #333;
}
.channel-edit .edit-btn {
  width: 140px;
  height: 55px;
  font-size: 32px;
}
.channel-edit .grid-item {
  width: 160px;
  height: 130px;
  background-color: #f4f5f6;
}
.channel-edit .van-grid-item__text {
  font-size: 30px;
  color: #222;
  margin-top: 0;
}
.channel-edit .recommend-grid .van-grid-item__content {
  flex-direction: row;
  white-space: nowrap;
}
.channel-edit .recommend-grid .van-icon {
  font-size: 32px;
  margin-right: 5px;
}
.channel-edit .my-grid .van-icon-clear {
  position: absolute;
  right: -5px;
  top: -5px;
  font-size: 34px;
  color: #cacaca;
  z-index: 2;
}
.channel-edit .text {
  font-size: 28px;
  color: #222;
  margin-top: 0;
}
.channel-edit .grid-item .active {
  color: red;
}
</style>