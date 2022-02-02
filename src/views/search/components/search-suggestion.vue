<template>
  <div class="search-suggestion">
    <van-cell
      v-for="(text, index) in suggestion"
      :key="index"
      @click="onSearch(text)"
    >
      <template #title>
        <van-icon name="search"></van-icon>
        <!-- <span>{{ text }}</span> -->
        <div v-html="highLight(text)"></div>
      </template>
    </van-cell>
  </div>
</template>

<script>
import { reactive, toRefs, watch } from "vue";
import { getSearchSuggestions } from "../../../api/search";
import { debounce } from "lodash";

async function loadSearchSuggestions(q, state) {
  try {
    const { data } = await getSearchSuggestions(q);
    state.suggestion = data.list;
  } catch (error) {
    console.log(error);
  }
}
function useHighLight(searchText) {
  const highLight = (text) => {
    const highStr = `<span style = "color: red">${searchText}</span>`;
    const reg = new RegExp(searchText, "gi");
    return text.replace(reg, highStr);
  };
  return { highLight };
}
export default {
  props: {
    searchText: {
      type: String,
      required: true,
    },
  },
  emits: ["search"],
  setup(props, { emit }) {
    const state = reactive({
      suggestion: [],
    });
    watch(
      () => props.searchText,
      debounce(function (newValue) {
        loadSearchSuggestions(newValue, state);
      }, 1000),
      // (newValue, oldValue) => {
      //   loadSearchSuggestions(newValue, state);
      // },
      { immediate: true }
    );
    const onSearch = function (text) {
      emit("search", text);
    };
    return {
      ...toRefs(state),
      ...useHighLight(props.searchText),
      onSearch,
    };
  },
};
</script>

<style>
</style>