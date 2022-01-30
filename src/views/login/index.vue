<template>
  <div>
    <van-nav-bar title="登录" class="page-nav-bar" />
    <van-form @submit="onSubmit">
      <van-field
        name="userName"
        placeholder="用户名"
        left-icon="manager"
        v-model="userName"
      />
      <van-field
        name="userPwd"
        placeholder="密码"
        type="password"
        left-icon="lock"
        v-model="userPwd"
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

function useSubmit(user) {
  const onSubmit = async () => {
    Toast.loading({
      message: "登录中...",
      forbidClick: true,
    });
    const res = await login(user);
    if (res.data.code === 0) {
      Toast.success("登录成功");
    } else {
      Toast.fail("登录失败");
    }
  };
  return {
    onSubmit,
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