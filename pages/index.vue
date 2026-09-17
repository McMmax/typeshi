<script setup lang="ts">
import { getAllPosts, getAllTags, type BlogPost } from '~/data/posts'
import { getTagTheme } from '~/composables/useTagTheme'
import UmbrellaLogo from '~/components/UmbrellaLogo.vue'

useHead({
  title: 'typeshi — Max\'s Engineering Blog & Notes',
  meta: [
    { name: 'description', content: 'Personal engineering blog and dev notes by Max (McMmax). Writing about systems, minimalism, and frontend design.' },
  ],
})

const posts = getAllPosts()
const tags = getAllTags()

const searchQuery = ref('')
const selectedTag = ref('')

const filteredPosts = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return posts.filter((post) => {
    const matchesTag = !selectedTag.value || post.tags.includes(selectedTag.value)
    const matchesQuery =
      !query ||
      post.title.toLowerCase().includes(query) ||
      post.summary.toLowerCase().includes(query) ||
      post.tags.some((t) => t.toLowerCase().includes(query))
    return matchesTag && matchesQuery
  })
})

function selectTag(tag: string) {
  selectedTag.value = selectedTag.value === tag ? '' : tag
}
</script>

<template>
  <div class="uc-shell">
    <!-- ═══ BLOG HEADER ═══ -->
    <section style="margin-bottom: 28px;">
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 12px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span class="stamp stamp-red">ENGINEERING JOURNAL</span>
          <span class="stamp stamp-green">STATIC PRE-RENDERED</span>
        </div>
        <span style="font-family: var(--f-mono); font-size: 11px; color: var(--uc-text-muted);">
          MAX (MCMMAX) // PERSONAL ARCHIVE
        </span>
      </div>

      <h1 style="font-family: var(--f-heading); font-size: clamp(28px, 5.5vw, 44px); font-weight: 700; letter-spacing: 0.04em; color: #ffffff; margin: 0 0 10px; text-transform: uppercase;">
        DEV NOTES & SOFTWARE ARCHITECTURE
      </h1>
      <p style="font-family: var(--f-mono); font-size: 14px; color: var(--uc-text-body); margin: 0 0 20px; max-width: 820px; line-height: 1.6;">
        Deep dives into low-latency systems architecture, deterministic physics simulation, in-memory state meshes, and offensive/defensive security. Written by Max.
      </p>

      <div class="hazard-bar-amber" />
    </section>

    <!-- ═══ HIGH-CONTRAST FILTER BAR ═══ -->
    <div style="background: var(--uc-surface); border: 1.5px solid var(--uc-border); border-left: 4px solid var(--uc-red-bright); padding: 18px 20px; margin-bottom: 28px; box-shadow: 0 4px 18px rgba(0, 0, 0, 0.5);">
      <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
        <div style="position: relative; flex: 1 1 280px;">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search articles by title, topic, or keyword..."
            style="width: 100%; padding: 10px 14px; background: #06080d; border: 1.5px solid var(--uc-border); color: #ffffff; font-family: var(--f-mono); font-size: 13px; outline: none;"
          />
        </div>

        <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
          <span style="font-family: var(--f-mono); font-size: 11px; font-weight: 700; color: var(--uc-text-muted); text-transform: uppercase;">
            TOPICS:
          </span>
          <button
            v-for="t in tags"
            :key="t.tag"
            type="button"
            class="tag-chip"
            :class="[getTagTheme(t.tag), { 'is-active': selectedTag === t.tag }]"
            @click="selectTag(t.tag)"
          >
            <span>#{{ t.tag }}</span>
            <span style="opacity: 0.75;">({{ t.count }})</span>
          </button>
          <button
            v-if="selectedTag || searchQuery"
            type="button"
            class="stamp stamp-red"
            style="cursor: pointer; padding: 5px 10px;"
            @click="selectedTag = ''; searchQuery = ''"
          >
            [ Clear Filter ]
          </button>
        </div>
      </div>
    </div>

    <!-- ═══ TWO-COLUMN CONTAINER LAYOUT ═══ -->
    <div style="display: grid; grid-template-columns: 1fr 320px; gap: 28px; align-items: start;">
      <!-- Main Articles Feed -->
      <div>
        <div v-if="filteredPosts.length === 0" class="uc-panel" style="text-align: center; padding: 48px 24px;">
          <h3 style="color: var(--uc-red-bright); margin-bottom: 8px;">NO ARTICLES FOUND</h3>
          <p style="color: var(--uc-text-muted); font-family: var(--f-mono); font-size: 13px; margin: 0 0 16px;">
            No articles matched your search query "{{ searchQuery || selectedTag }}".
          </p>
          <button type="button" class="stamp stamp-red" style="cursor: pointer;" @click="searchQuery = ''; selectedTag = ''">
            Clear Search Filter
          </button>
        </div>

        <div v-else>
          <NuxtLink
            v-for="post in filteredPosts"
            :key="post.slug"
            :to="`/posts/${post.slug}`"
            class="doc-card"
            :class="{ 'is-priority': post.featured && !searchQuery && !selectedTag }"
          >
            <div class="doc-card-meta">
              <span v-if="post.featured && !searchQuery && !selectedTag" class="stamp stamp-red">
                ★ FEATURED
              </span>
              <span style="color: var(--uc-text-white); font-weight: 700;">{{ post.date }}</span>
              <span>•</span>
              <span style="color: var(--uc-cyan); font-weight: 700;">{{ post.readTime }}</span>
              <span style="margin-left: auto; color: var(--uc-text-muted);">by {{ post.author.name }}</span>
            </div>

            <h2 class="doc-card-title">{{ post.title }}</h2>
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
              <span style="color: var(--uc-red-bright); font-family: var(--f-display); font-size: 13px; font-weight: 700; letter-spacing: 0.08em; display: inline-flex; align-items: center; gap: 6px;">
                Read Article →
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- High-Contrast Sidebar -->
      <aside>
        <!-- Author Profile Panel -->
        <div class="uc-panel">
          <div class="uc-panel-head">
            <h3 class="uc-panel-title">
              <UmbrellaLogo :size="18" />
              AUTHOR
            </h3>
            <span class="stamp stamp-green">DEVELOPER</span>
          </div>

          <div style="display: flex; gap: 14px; align-items: center; margin-bottom: 16px;">
            <img
              src="https://avatars.githubusercontent.com/u/156390123?v=4"
              alt="Max Avatar"
              style="width: 56px; height: 56px; border: 2px solid var(--uc-red-bright); object-fit: cover;"
            />
            <div>
              <div style="font-family: var(--f-display); font-size: 15px; font-weight: 700; color: #ffffff;">
                MAX (MCMMAX)
              </div>
              <div style="font-family: var(--f-mono); font-size: 11.5px; color: var(--uc-red-bright); font-weight: 700;">
                Software Engineer
              </div>
              <div style="font-family: var(--f-mono); font-size: 11px; color: var(--uc-text-muted);">
                GitHub: @McMmax
              </div>
            </div>
          </div>

          <p style="font-size: 13.5px; color: var(--uc-text-body); line-height: 1.6; margin: 0 0 18px;">
            Architecting ultra-low latency netcode, deterministic game engines, in-memory relational state meshes with SpacetimeDB, and hardware security.
          </p>

          <div style="display: flex; gap: 8px;">
            <a
              href="https://github.com/McMmax"
              target="_blank"
              rel="noopener noreferrer"
              class="stamp stamp-muted"
              style="flex: 1; text-align: center; justify-content: center; text-decoration: none;"
            >
              GitHub / McMmax ↗
            </a>
            <NuxtLink
              to="/about"
              class="stamp stamp-red"
              style="flex: 1; text-align: center; justify-content: center; text-decoration: none;"
            >
              About Me
            </NuxtLink>
          </div>
        </div>

        <!-- System Specifications Panel -->
        <div class="uc-panel">
          <div class="uc-panel-head">
            <h3 class="uc-panel-title">
              STACK & INVARIANTS
            </h3>
            <span class="stamp stamp-green">ONLINE</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px; font-family: var(--f-mono); font-size: 12px;">
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--uc-border); padding-bottom: 6px;">
              <span style="color: var(--uc-text-muted);">FRAMEWORK:</span>
              <span style="color: var(--uc-green); font-weight: 700;">NUXT 3 (VUE 3)</span>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--uc-border); padding-bottom: 6px;">
              <span style="color: var(--uc-text-muted);">HOSTING:</span>
              <span style="color: var(--uc-cyan); font-weight: 700;">GITHUB PAGES</span>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--uc-border); padding-bottom: 6px;">
              <span style="color: var(--uc-text-muted);">PIPELINE:</span>
              <span style="color: var(--uc-amber); font-weight: 700;">STATIC PRE-RENDER</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--uc-text-muted);">MAINTENANCE:</span>
              <span style="color: #ffffff; font-weight: 700;">$0 / MONTH</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 900px) {
  div[style*="grid-template-columns: 1fr 320px"] {
    grid-template-columns: 1fr !important;
  }
}
</style>
