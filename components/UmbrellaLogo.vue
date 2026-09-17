<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: number
    animated?: boolean
  }>(),
  {
    size: 40,
    animated: false,
  }
)
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="umbrella-logo"
    :class="{ 'is-spinning': animated }"
    aria-label="Umbrella Corporation Logo"
  >
    <!-- Outer ring border -->
    <circle cx="50" cy="50" r="48" stroke="#d81e1e" stroke-width="2.5" fill="#060709" />

    <!-- 8 Alternating Segments (4 Red, 4 White) -->
    <!-- Segment 0: Top (Red) -->
    <path d="M50 50 L32.32 17.68 A45 45 0 0 1 67.68 17.68 Z" fill="#d81e1e" />
    <!-- Segment 1: Top-Right (White) -->
    <path d="M50 50 L67.68 17.68 A45 45 0 0 1 82.32 32.32 Z" fill="#f0f3f8" />
    <!-- Segment 2: Right (Red) -->
    <path d="M50 50 L82.32 32.32 A45 45 0 0 1 82.32 67.68 Z" fill="#d81e1e" />
    <!-- Segment 3: Bottom-Right (White) -->
    <path d="M50 50 L82.32 67.68 A45 45 0 0 1 67.68 82.32 Z" fill="#f0f3f8" />
    <!-- Segment 4: Bottom (Red) -->
    <path d="M50 50 L67.68 82.32 A45 45 0 0 1 32.32 82.32 Z" fill="#d81e1e" />
    <!-- Segment 5: Bottom-Left (White) -->
    <path d="M50 50 L32.32 82.32 A45 45 0 0 1 17.68 67.68 Z" fill="#f0f3f8" />
    <!-- Segment 6: Left (Red) -->
    <path d="M50 50 L17.68 67.68 A45 45 0 0 1 17.68 32.32 Z" fill="#d81e1e" />
    <!-- Segment 7: Top-Left (White) -->
    <path d="M50 50 L17.68 32.32 A45 45 0 0 1 32.32 17.68 Z" fill="#f0f3f8" />

    <!-- Central pin / ring -->
    <circle cx="50" cy="50" r="4.5" fill="#060709" stroke="#ffffff" stroke-width="1.5" />
    <circle cx="50" cy="50" r="48" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
  </svg>
</template>

<style scoped>
.umbrella-logo {
  display: block;
  flex-shrink: 0;
  filter: drop-shadow(0 0 8px rgba(216, 30, 30, 0.4));
  transition: transform 0.3s ease;
}

.umbrella-logo:hover {
  transform: rotate(45deg);
}

.is-spinning {
  animation: umbrella-spin 20s linear infinite;
}

@keyframes umbrella-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
