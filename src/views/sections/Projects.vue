<script lang="ts" setup>
import { useProjectData } from '@/store/projectData';
import ProjectThumbnail from '@/components/ProjectThumbnail.vue';
import { onMounted } from '@vue/runtime-dom';
import { useGradientData } from '@/store/gradientData';

const projectData = useProjectData();
const gradientData = useGradientData();

onMounted(() => {
  gradientData.resetDefaultColors();
});
</script>

<template>
  <section id="section__projects" data-scroll-section>
    <div
      id="title"
      data-scroll
      data-scroll-speed="-4"
      data-scroll-offset="0, -200%"
    >
      <h1>Projets<br />d'étalonnage</h1>
    </div>
    <ProjectThumbnail
      v-for="(project, index) in projectData.projects"
      :key="project.id"
      :project="project"
      :x="index === 0 ? 1 : undefined"
      :y="index === 0 ? 1 : undefined"
    />
  </section>
</template>

<style lang="sass" scoped>
#section__projects
  @include grid(auto-fit, true, 11)
  padding-top: calc($cell-height + $unit + $unit)
  // min-width: 100%
  height: 100%
  min-width: max-content

#title
  grid-column-start: 1
  grid-column-end: span 11
  grid-row-end: -3
  grid-row-start: 6
  align-self: end
  // filter: blur(3px)

  @media screen and (max-width: 500px)
    opacity: 0.7
</style>
