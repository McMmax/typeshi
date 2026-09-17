<script setup lang="ts">
import UmbrellaLogo from '~/components/UmbrellaLogo.vue'

useHead({
  title: '404 // Page Not Found — typeshi',
})
</script>

<template>
  <div class="uc-shell" style="text-align: center; padding: 60px 20px;">
    <div class="uc-panel" style="max-width: 600px; margin: 0 auto; padding: 48px 32px; border-top: 3px solid var(--uc-red);">
      <div style="display: flex; justify-content: center; margin-bottom: 20px;">
        <UmbrellaLogo :size="64" />
      </div>

      <div style="display: flex; justify-content: center; gap: 8px; margin-bottom: 16px;">
        <span class="stamp stamp-red">404</span>
        <span class="stamp stamp-muted">NOT FOUND</span>
      </div>

      <h1 style="font-family: var(--f-heading); font-size: 26px; font-weight: 700; color: var(--uc-red-bright); margin: 0 0 12px; letter-spacing: 0.04em; text-transform: uppercase;">
        PAGE NOT FOUND
      </h1>

      <p style="font-family: var(--f-mono); font-size: 13px; color: var(--uc-text-muted); margin: 0 0 24px; line-height: 1.6;">
        The page or article you are looking for does not exist or may have been moved.
      </p>

      <div class="hazard-bar-amber" style="margin-bottom: 24px;" />

      <NuxtLink
        to="/"
        class="stamp stamp-red"
        style="padding: 10px 24px; font-size: 12px; text-decoration: none; display: inline-flex;"
      >
        Return to Home →
      </NuxtLink>
    </div>
  </div>
</template>
