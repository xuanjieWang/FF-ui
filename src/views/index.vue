<template>
  <div class="app-container">网站首页</div>
</template>

<script setup name="Index" lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from '@/store/modules/user';
const userStore = useUserStore();
const router = useRouter();


onMounted(async ()=>{
   if("注册中"===userStore.regisStatus){
        await router.push('/information');
   }else if("审核中"===userStore.regisStatus){
        await router.push('/auditing');
   }else if("审核不通过"===userStore.regisStatus){
        await router.push('/reject');
  }
})
</script>

<style scoped lang="scss"></style>
