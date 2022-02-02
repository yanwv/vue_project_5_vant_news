<template>
  <div class="article-container">
    {{ articleId }}
  </div>
</template>

<script>
export default {
  props: {
    articleId: {
      type: String,
      required: true,
    },
  },
};
</script>

<style>
</style>