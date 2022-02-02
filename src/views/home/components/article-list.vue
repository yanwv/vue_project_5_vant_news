<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="state.isreFreshLoading"
      @refresh="onRefresh"
      :success-text="state.refreshSuccessText"
      success-duration="1500"
    >
      <van-list
        v-model:loading="state.loading"
        :finished="state.finished"
        finished-text="没有更多了"
        v-model:error="state.error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <!-- <van-cell
          v-for="item in state.list"
          :key="item.id"
          :title="item.title"
          class="cell-list"
        /> -->
        <article-item
          v-for="article in state.list"
          :key="article.id"
          :article="article"
          class="cell-list"
        ></article-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { reactive } from "vue";
import { getArticles } from "../../../api/article";
import ArticleItem from "../../../components/article-item/index.vue";
function useLoad(id) {
  const state = reactive({
    list: [],
    loading: false,
    finished: false,
    pageNumber: null,
    error: false,
    isreFreshLoading: false, //控制下拉刷新的loading状态
    refreshSuccessText: "刷新成功",
  });
  //下拉刷新
  const onRefresh = async () => {
    try {
      const params = {
        channel_id: id,
        pageNumber: 1,
        referrer: "load",
      };
      const { data } = await getArticles(params);
      const results = data.list;
      //将数据追加到列表的顶部
      state.list.unshift(...results);
      //关闭下拉刷新的loading状态
      state.isreFreshLoading = false;
      state.refreshSuccessText = `刷新成功，更新了${results.length}条数据`;
    } catch (err) {
      state.isreFreshLoading = false;
      state.refreshSuccessText = "刷新失败";
    }
  };
  const onLoad = async () => {
    // 异步更新数据
    try {
      //1、发送异步请求获取数据
      const params = {
        channel_id: id,
        pageNumber: state.pageNumber || 1,
      };
      const { data } = await getArticles(params);
      const results = data.list;
      // 2、将服务端返回的数据填充到list数组
      state.list.push(...results);
      // 3、本次数据加载完成后，要把加载状态设置为结束，loading设置为false以后，才能够触发下一次的加载更多的操作
      state.loading = false;
      // 4、当数据全部加载完成后，发finished设置为true
      if (results.length > 0) {
        state.pageNumber = data.p_num;
      } else {
        state.finished = true;
      }
    } catch (err) {
      state.error = true;
      state.loading = false;
    }
  };
  return {
    onRefresh,
    onLoad,
    state,
  };
}
export default {
  components: {
    ArticleItem,
  },
  props: {
    channel: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    return {
      ...useLoad(props.channel.id),
    };
  },
};
</script>

<style>
.cell-list {
  min-height: 200px;
}
.article-list {
  margin-top: 165px;
  /* 滚动容器 */
  height: 1060px;
  overflow-y: auto;
}
</style>
