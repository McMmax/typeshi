<script setup lang="ts">
import { getAllTags, getAllPosts, type BlogPost } from '~/data/posts'
import { getTagTheme } from '~/composables/useTagTheme'
import UmbrellaLogo from '~/components/UmbrellaLogo.vue'

useHead({
  title: 'Topics & Tags — typeshi',
  meta: [
    { name: 'description', content: 'Browse all articles and engineering notes by topic and technology tag.' },
  ],
})

const route = useRoute()
const tags = getAllTags()
const allPosts = getAllPosts()

const activeTag = ref<string>((route.query.tag as string) || '')

watch(
  () => route.query.tag,
  (newTag) => {
    activeTag.value = (newTag as string) || ''
  }
)

const filteredPosts = computed(() => {
  if (!activeTag.value) return allPosts
  return allPosts.filter((p) => p.tags.includes(activeTag.value))
})

function selectTag(tag: string) {
  activeTag.value = activeTag.value === tag ? '' : tag
}
</script>

<template>
  <div class="uc-shell">
    <nav style="display: flex; gap: 8px; align-items: center; font-family: var(--f-mono); font-size: 11px; margin-bottom: 24px;">
      <NuxtLink to="/" style="color: var(--uc-text-muted); text-decoration: none;">HOME</NuxtLink>
      <span style="color: var(--uc-red);">/</span>
      <span style="color: var(--uc-red-bright); font-weight: 700;">TOPICS & TAGS</span>
    </nav>

    <section style="margin-bottom: 28px;">
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
        <span class="stamp stamp-red">INDEX</span>
        <span class="stamp stamp-muted">CATEGORIES</span>
      </div>
      <h1 style="font-family: var(--f-heading); font-size: clamp(26px, 4.5vw, 40px); font-weight: 700; color: #ffffff; margin: 0 0 10px; text-transform: uppercase;">
        TOPICS & TECHNOLOGY TAGS
      </h1>
      <p style="font-family: var(--f-mono); font-size: 14px; color: var(--uc-text-body); margin: 0 0 18px;">
        Filter articles by technology stack, engineering domain, or topic.
      </p>
      <div class="hazard-bar-amber" />
    </section>

    <!-- ═══ VIBRANT POPPING TAGS SELECTOR ═══ -->
    <div class="uc-panel" style="margin-bottom: 32px;">
      <div class="uc-panel-head">
        <h3 class="uc-panel-title">
          <UmbrellaLogo :size="16" />
          ALL TOPICS ({{ tags.length }})
        </h3>
        <span v-if="activeTag" class="stamp stamp-red" style="cursor: pointer;" @click="activeTag = ''">
          [ Clear Active Filter ]
        </span>
      </div>

      <div style="display: flex; gap: 10px; flex-wrap: wrap;">
        <button
          type="button"
          class="tag-chip tag-red"
          :class="{ 'is-active': activeTag === '' }"
          @click="selectTag('')"
        >
          <span>ALL ARTICLES ({{ allPosts.length }})</span>
        </button>
        <button
          v-for="t in tags"
          :key="t.tag"
          type="button"
          class="tag-chip"
          :class="[getTagTheme(t.tag), { 'is-active': activeTag === t.tag }]"
          @click="selectTag(t.tag)"
        >
          <span>#{{ t.tag }}</span>
          <span style="opacity: 0.75;">({{ t.count }})</span>
        </button>
      </div>
    </div>

    <!-- ═══ MATCHING POSTS ═══ -->
    <div>
      <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 20px; border-bottom: 1.5px solid var(--uc-border); padding-bottom: 10px;">
        <h2 style="font-family: var(--f-heading); font-size: 20px; font-weight: 700; color: #ffffff; margin: 0;">
          {{ activeTag ? `ARTICLES TAGGED #${activeTag.toUpperCase()}` : 'ALL ARTICLES' }} ({{ filteredPosts.length }})
        </h2>
        <span style="font-family: var(--f-mono); font-size: 12px; color: var(--uc-text-muted);">
          SHOWING {{ filteredPosts.length }} RESULTS
        </span>
      </div>

      <div class="post-list">
        <NuxtLink
          v-for="post in filteredPosts"
          :key="post.slug"
          :to="`/posts/${post.slug}`"
          class="doc-card"
        >
          <div class="doc-card-meta">
            <span style="color: var(--uc-text-white); font-weight: 700;">{{ post.date }}</span>
            <span>•</span>
            <span style="color: var(--uc-cyan); font-weight: 700;">{{ post.readTime }}</span>
          </div>
          <h3 class="doc-card-title">{{ post.title }}</h3>
          <p class="doc-card-summary">{{ post.summary }}</p>
          <div class="doc-card-footer">
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <span
                v-for="tag in post.tags"
                :key="tag"
                class="tag-chip"
                :class="getTagTheme(tag)"
              >
                #{{ tag }}
              </span>
            </div>
            <span style="color: var(--uc-red-bright); font-family: var(--f-display); font-size: 13px; font-weight: 700;">Read Article →</span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
