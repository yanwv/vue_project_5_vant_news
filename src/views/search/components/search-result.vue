<template>
  <div class="search-result">
    <van-list
      v-model:loading="state.loading"
      :finished="state.finished"
      finished-text="没有更多了"
      v-model:error="state.error"
      error-text="请求失败 请重试"
      @load="onLoad"
    >
      <van-cell
        v-for="item in state.list"
        :key="item.id"
        :title="item.title"
        class="cell-list"
      />
    </van-list>
  </div>
</template>

<script>
import { reactive } from "vue";
import { getSearchResult } from "../../../api/search";

export default {
  props: {
    searchText: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const state = reactive({
      list: [],
      loading: false,
      finished: false,
      pageNum: 1,
      error: false,
    });
    const onLoad = async () => {
      try {
        const { data } = await getSearchResult({
          pageNumber: state.pageNum,
          q: props.searchText,
        });
        const results = data.list;
        state.list.push(...results);
        state.loading = false;
        if (results.length > 0) {
          state.pageNum = data.p_num;
        } else {
          state.finished = true;
        }
      } catch (err) {
        state.error = true;
        state.loading = false;
        console.log(err);
      }
    };
    return {
      onLoad,
      state,
    };
  },
};
</script>

<style>
.search-result .cell-list {
  min-height: 200px;
}
</style>