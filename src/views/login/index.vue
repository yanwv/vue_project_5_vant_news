<template>
  <div>
    <van-nav-bar title="登录" class="page-nav-bar">
      <template #left>
        <van-icon name="cross" size="18" @click="this.$router.back()" />
      </template>
    </van-nav-bar>
    <van-form @submit="onSubmit">
      <van-field
        name="userName"
        placeholder="用户名"
        left-icon="manager"
        v-model="userName"
        :rules="userFormRules.userName"
      />
      <van-field
        name="userPwd"
        placeholder="密码"
        type="password"
        left-icon="lock"
        v-model="userPwd"
        :rules="userFormRules.userPwd"
      />
      <div style="margin: 16px">
        <van-button block type="primary" native-type="submit">
          登录
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import { login } from "../../api/user";
import { Toast } from "vant";
import { useStore } from "vuex";
import router from "../../router";

function useSubmit(user) {
  const store = useStore();
  const onSubmit = async () => {
    Toast.loading({
      message: "登录中...",
      forbidClick: true,
    });
    const res = await login(user);
    if (res.data.code === 0) {
      store.commit("setUser", res.data);
      Toast.success("登录成功");
      router.push("/my");
    } else {
      Toast.fail("登录失败");
    }
  };
  const userFormRules = {
    userName: [{ required: true, message: "请输入用户名" }],
    userPwd: [
      { required: true, message: "请输入密码" },
      { pattern: /^\d{6}$/, message: "密码格式错误" },
    ],
  };
  return {
    onSubmit,
    userFormRules,
  };
}
export default {
  setup() {
    const user = reactive({
      userName: "admin",
      userPwd: "123456",
    });
    return {
      // 结构完不是响应式了,需要用 toRefs
      ...toRefs(user),
      ...useSubmit(user),
    };
  },
};
</script>

<style scoped>
</style>