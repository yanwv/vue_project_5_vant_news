<template>
  <div class="search-history">
    <van-cell>
      <template #title> <span>搜索历史</span>&nbsp; </template>
      <template #value>
        <div v-if="isDeleteShow">
          <!-- <span>全部删除</span>&nbsp; -->
          <span @click="isDeleteShow = false">完成</span>
        </div>
        <van-icon name="delete" v-else @click="isDeleteShow = true"></van-icon>
      </template>
    </van-cell>
    <van-cell
      v-for="(item, index) in searchHistories"
      :key="item"
      @click="onSearchItemClick(item, index)"
    >
      <template #value>
        <span>{{ item }}</span>
      </template>
      <template #right-icon>
        <van-icon name="close" v-if="isDeleteShow"></van-icon>
      </template>
    </van-cell>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";

function useOnsearchItemClick(state, searchHistories, emit) {
  const onSearchItemClick = (item, index) => {
    if (state.isDeleteShow) {
      searchHistories.splice(index, 1);
    } else {
      emit("search", item);
    }
  };
  return {
    onSearchItemClick,
  };
}
emits: ["search"];
export default {
  props: {
    searchHistories: {
      type: Array,
      required: true,
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      isDeleteShow: false,
    });
    return {
      ...toRefs(state),
      ...useOnsearchItemClick(state, props.searchHistories, emit),
    };
  },
};
</script>

<style>
</style>