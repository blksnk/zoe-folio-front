<script setup lang="ts">
import Scroller from '@/views/ScrollContainer.vue';
import { useProjectData } from '@/store/projectData';
import { onMounted } from 'vue';
import { useScrollData } from '@/store/scrollData';
import ProcessSection from './sections/ProcessSection2.vue';
import StudioSection from '@/views/sections/StudioSection.vue';
import ProjectsSection from '@/views/sections/ProjectsSection.vue';
import { useRoute } from 'vue-router';
import AboutSection from '@/views/sections/AboutSection.vue';

const projectData = useProjectData();
const scrollData = useScrollData();
const route = useRoute();

onMounted(() => {
  scrollData.update();
});
</script>

<template>
  <Scroller :dependencies="projectData.projects">
    <projects-section />
    <process-section />
    <studio-section />
    <about-section />
  </Scroller>
</template>

<style lang="sass">
#index
  width: max-content

  & > section
    display: inline-grid !important
</style>
