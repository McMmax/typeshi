<script setup lang="ts">
import { getPostBySlug, getAllPosts } from '~/data/posts'
import { getTagTheme } from '~/composables/useTagTheme'
import UmbrellaLogo from '~/components/UmbrellaLogo.vue'

const route = useRoute()
const slug = route.params.slug as string
const post = getPostBySlug(slug)

if (!post) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Article Not Found',
    fatal: true,
  })
}

const allPosts = getAllPosts()
const currentIndex = allPosts.findIndex((p) => p.slug === slug)
const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null
const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null

useHead({
  title: `${post.title} — typeshi`,
  meta: [
    { name: 'description', content: post.summary },
    { property: 'og:title', content: post.title },
    { property: 'og:description', content: post.summary },
    { property: 'og:type', content: 'article' },
  ],
})
</script>

<template>
  <div v-if="post" class="uc-shell">
    <!-- ═══ BREADCRUMB ═══ -->
    <nav style="display: flex; gap: 8px; align-items: center; font-family: var(--f-mono); font-size: 11px; margin-bottom: 24px;">
      <NuxtLink to="/" style="color: var(--uc-text-muted); text-decoration: none;">HOME</NuxtLink>
      <span style="color: var(--uc-red);">/</span>
      <NuxtLink to="/" style="color: var(--uc-text-muted); text-decoration: none;">POSTS</NuxtLink>
      <span style="color: var(--uc-red);">/</span>
      <span style="color: var(--uc-red-bright); font-weight: 700;">{{ post.slug }}</span>
    </nav>

    <!-- ═══ ARTICLE CONTAINER (SQUARE & HIGH-CONTRAST) ═══ -->
    <article style="max-width: 900px; margin: 0 auto; background: var(--uc-surface); border: 1.5px solid var(--uc-border); border-top: 4px solid var(--uc-red-bright); padding: clamp(24px, 5vw, 44px); box-shadow: 0 4px 28px rgba(0, 0, 0, 0.7);">
      <header class="doc-article-header">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 14px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <UmbrellaLogo :size="18" />
            <span class="stamp stamp-muted">ENGINEERING NOTE</span>
          </div>
          <span class="stamp stamp-red">{{ post.readTime }}</span>
        </div>

        <h1 class="doc-title">{{ post.title }}</h1>

        <div class="doc-meta-grid">
          <div class="doc-meta-item">
            <strong>Published</strong>
            <span>{{ post.date }}</span>
          </div>
          <div class="doc-meta-item">
            <strong>Author</strong>
            <span>{{ post.author.name }} ({{ post.author.handle }})</span>
          </div>
          <div class="doc-meta-item">
            <strong>Reading Time</strong>
            <span>{{ post.readTime }}</span>
          </div>
          <div class="doc-meta-item">
            <strong>Platform</strong>
            <span>GitHub Pages SSG</span>
          </div>
        </div>

        <!-- ═══ VIBRANT POPPING TAGS ═══ -->
        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 18px;">
          <NuxtLink
            v-for="tag in post.tags"
            :key="tag"
            :to="`/tags?tag=${tag}`"
            class="tag-chip"
            :class="getTagTheme(tag)"
          >
            #{{ tag }}
          </NuxtLink>
        </div>
      </header>

      <!-- ═══ ARTICLE BODY CONTENT ═══ -->
      <div class="doc-body" v-html="post.content" />

      <!-- ═══ AUTHOR SIGNATURE FOOTER ═══ -->
      <div style="margin-top: 48px; padding: 22px; background: var(--uc-dark); border: 1.5px solid var(--uc-border); border-left: 4px solid var(--uc-red-bright); display: flex; align-items: center; gap: 18px;">
        <img
          :src="post.author.avatar"
          :alt="post.author.name"
          style="width: 60px; height: 60px; border: 2px solid var(--uc-red-bright); object-fit: cover;"
        />
        <div>
          <div style="font-family: var(--f-display); font-size: 15px; font-weight: 700; color: #ffffff;">
            WRITTEN BY {{ post.author.name.toUpperCase() }}
          </div>
          <div style="font-family: var(--f-mono); font-size: 11.5px; color: var(--uc-red-bright); font-weight: 700; margin-top: 2px;">
            {{ post.author.role }} // GitHub: @{{ post.author.handle }}
          </div>
          <div style="margin-top: 8px;">
            <a
              href="https://github.com/McMmax"
              target="_blank"
              rel="noopener noreferrer"
              class="stamp stamp-muted"
              style="text-decoration: none;"
            >
              Follow on GitHub ↗
            </a>
          </div>
        </div>
      </div>

      <!-- ═══ ADJACENT NAVIGATION ═══ -->
      <div class="hazard-bar-amber" style="margin: 36px 0 24px;" />

      <nav style="display: flex; justify-content: space-between; gap: 20px; flex-wrap: wrap;">
        <div v-if="prevPost" style="flex: 1 1 280px;">
          <div style="font-family: var(--f-mono); font-size: 10px; color: var(--uc-red-bright); font-weight: 700; margin-bottom: 4px;">
            ← PREVIOUS POST
          </div>
          <NuxtLink :to="`/posts/${prevPost.slug}`" style="font-family: var(--f-heading); font-size: 16px; font-weight: 600; color: var(--uc-text-head); text-decoration: none;">
            {{ prevPost.title }}
          </NuxtLink>
        </div>
        <div v-else style="flex: 1 1 280px;" />

        <div v-if="nextPost" style="flex: 1 1 280px; text-align: right;">
          <div style="font-family: var(--f-mono); font-size: 10px; color: var(--uc-red-bright); font-weight: 700; margin-bottom: 4px;">
            NEXT POST →
          </div>
          <NuxtLink :to="`/posts/${nextPost.slug}`" style="font-family: var(--f-heading); font-size: 16px; font-weight: 600; color: var(--uc-text-head); text-decoration: none;">
            {{ nextPost.title }}
          </NuxtLink>
        </div>
      </nav>
    </article>
  </div>
</template>
