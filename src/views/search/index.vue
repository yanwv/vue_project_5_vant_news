<template>
  <div class="search-container">
    <form action="/" class="search-form">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
      />
    </form>
    <SearchResult v-if="isResultShow" :search-text="searchText"></SearchResult>
    <SearchSuggestion
      v-else-if="searchText"
      :search-text="searchText"
      @search="onSearch"
    ></SearchSuggestion>
    <SearchHistory
      v-else
      :search-histories="searchHistories"
      @search="onSearch"
    ></SearchHistory>
  </div>
</template>

<script>
import { reactive, ref, toRefs, watch } from "vue";
import SearchHistory from "./components/search-history.vue";
import SearchResult from "./components/search-result.vue";
import SearchSuggestion from "./components/search-suggestion.vue";
import { setItem, getItem } from "../../utils/storage";
import router from "../../router/index";

function useSearch(state, searchText) {
  const onSearch = (value) => {
    searchText.value = value;
    const index = state.searchHistories.indexOf(value);
    if (index !== -1) {
      state.searchHistories.splice(index, 1);
    }
    state.searchHistories.unshift(value);
    state.isResultShow = true;
  };
  return { onSearch };
}
function useCancel() {
  const onCancel = (value) => {
    router.push("/");
  };
  return { onCancel };
}
export default {
  components: {
    SearchHistory,
    SearchResult,
    SearchSuggestion,
  },
  setup() {
    const searchText = ref("");
    const state = reactive({
      isResultShow: false,
      searchHistories: getItem("TOUTIAO_SEARCH") || [],
    });
    watch(state.searchHistories, function (newValue) {
      setItem("TOUTIAO_SEARCH", newValue);
    });
    return {
      searchText,
      ...toRefs(state),
      ...useSearch(state, searchText),
      ...useCancel(),
    };
  },
};
</script>

<style>
.search-container .van-search__action {
  color: rgba(173, 165, 165, 0.986);
}
.search-container .search-form {
  /* position: fixed; */
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
}
</style>