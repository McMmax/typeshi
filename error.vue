<script setup lang="ts">
import type { NuxtError } from '#app'
import UmbrellaLogo from '~/components/UmbrellaLogo.vue'

const props = defineProps<{
  error: NuxtError
}>()

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <NuxtLayout>
    <div class="uc-shell" style="text-align: center; padding: 60px 20px;">
      <div class="uc-panel" style="max-width: 600px; margin: 0 auto; padding: 48px 32px; border-top: 3px solid var(--uc-red);">
        <div style="display: flex; justify-content: center; margin-bottom: 20px;">
          <UmbrellaLogo :size="64" />
        </div>

        <div style="display: flex; justify-content: center; gap: 8px; margin-bottom: 16px;">
          <span class="stamp stamp-red">ERROR</span>
          <span class="stamp stamp-amber">{{ error.statusCode }}</span>
        </div>

        <h1 style="font-family: var(--f-heading); font-size: 26px; font-weight: 700; color: var(--uc-red-bright); margin: 0 0 12px; letter-spacing: 0.04em; text-transform: uppercase;">
          {{ error.statusCode === 404 ? 'PAGE NOT FOUND' : 'UNEXPECTED ERROR' }}
        </h1>

        <p style="font-family: var(--f-mono); font-size: 13px; color: var(--uc-text-muted); margin: 0 0 24px; line-height: 1.6;">
          {{ error.statusMessage || 'An unexpected error occurred while loading this page.' }}
        </p>

        <div class="hazard-bar-amber" style="margin-bottom: 24px;" />

        <button
          type="button"
          class="stamp stamp-red"
          style="padding: 10px 24px; font-size: 12px; cursor: pointer;"
          @click="handleError"
        >
          Return to Home →
        </button>
      </div>
    </div>
  </NuxtLayout>
</template>
