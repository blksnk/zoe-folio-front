<template>
  <main id="admin__panel" :class="{ scroll: shouldScroll }">
    <section id="admin__content">
      <router-view />
    </section>
    <GridOverlay />
  </main>
</template>

<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router';
import { onMounted, watch } from 'vue';
import { useGradientData } from '@/store/gradientData';
import { adminPanelPalette } from '@/utils/gradient';
import { useAdminData } from '@/store/adminData';
import GridOverlay from '@/components/GridOverlay.vue';

const gradientData = useGradientData();
const adminData = useAdminData();
const route = useRoute();
const router = useRouter();

const redirectToLoginIfNeeded = () => {
  if (!adminData.isLoggedIn() && route.name !== 'AdminLogin') {
    adminData.setPreviousRoute(route.path);
    router.replace({ path: '/admin/login' });
  }
};

watch(() => adminData.user, redirectToLoginIfNeeded);

onMounted(() => {
  gradientData.setColorsRgb(adminPanelPalette, true);
  redirectToLoginIfNeeded();
});

const shouldScroll = route.fullPath === '/admin/projects';
</script>

<style scoped lang="sass">
#admin__panel
  padding: calc($cell-height + $unit * 2) $unit $unit $unit
  height: 100%
  width: 100%
  overflow: hidden

  &.scroll
    overflow-y: auto

  #admin__content
    grid-column: 4 / -1
    grid-row: 1 / -1
    position: relative
    min-height: 100%

    & > *
      opacity: 1
      position: relative
      z-index: 1
</style>
