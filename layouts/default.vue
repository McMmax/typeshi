<script setup lang="ts">
import UmbrellaLogo from '~/components/UmbrellaLogo.vue'
import { getAllPosts } from '~/data/posts'

const route = useRoute()
const isActive = (path: string) => route.path === path || (path !== '/' && route.path.startsWith(path))
const latestPost = computed(() => getAllPosts()[0])
</script>

<template>
  <div class="terminal-grid" style="min-height: 100vh; display: flex; flex-direction: column;">
    <!-- ═══ TOP ACCENT LINE ═══ -->
    <div class="hazard-bar" />

    <!-- ═══ SUBTLE TOP STATUS BAR ═══ -->
    <div class="uc-header-top">
      <div style="display: flex; align-items: center; gap: 10px;">
        <span class="stamp stamp-red">TYPESHI</span>
        <span>PERSONAL ENGINEERING BLOG & NOTES</span>
      </div>
      <div style="display: flex; align-items: center; gap: 16px;">
        <span style="color: var(--uc-green); display: flex; align-items: center; gap: 6px;">
          <span style="display: inline-block; width: 6px; height: 6px; background: var(--uc-green); box-shadow: 0 0 6px var(--uc-green);" />
          GITHUB PAGES STATIC CDN
        </span>
        <span>BY MAX (MCMMAX)</span>
      </div>
    </div>

    <!-- ═══ HEADER ═══ -->
    <header class="uc-header">
      <div class="uc-header-main">
        <NuxtLink to="/" class="uc-brand">
          <UmbrellaLogo :size="44" :animated="false" />
          <div>
            <h1 class="uc-brand-title">TYPESHI</h1>
            <div class="uc-brand-subtitle">DEV NOTES & SOFTWARE ARCHITECTURE</div>
          </div>
        </NuxtLink>

        <nav class="uc-nav" aria-label="Primary Navigation">
          <NuxtLink to="/" class="uc-nav-link" :class="{ 'is-active': isActive('/') }">
            Posts
          </NuxtLink>
          <NuxtLink to="/tags" class="uc-nav-link" :class="{ 'is-active': isActive('/tags') }">
            Topics
          </NuxtLink>
          <NuxtLink to="/about" class="uc-nav-link" :class="{ 'is-active': isActive('/about') }">
            About
          </NuxtLink>
          <a
            href="https://github.com/McMmax/typeshi"
            target="_blank"
            rel="noopener noreferrer"
            class="uc-nav-link"
          >
            GitHub ↗
          </a>
        </nav>
      </div>
    </header>

    <!-- ═══ MAIN BODY CONTENT ═══ -->
    <main style="flex: 1 0 auto;">
      <slot />
    </main>

    <!-- ═══ FOOTER ═══ -->
    <footer class="uc-footer">
      <div class="hazard-bar" />
      <div class="uc-footer-inner">
        <div class="uc-footer-grid">
          <div class="uc-footer-brand">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
              <UmbrellaLogo :size="30" />
              <h4 style="margin: 0;">TYPESHI // BY MAX</h4>
            </div>
            <p>
              A minimalist, high-contrast engineering blog and software notes journal.
              Built with Nuxt 3 Static Site Generation and hosted exclusively on GitHub Pages.
            </p>
            <div style="display: flex; gap: 8px;">
              <span class="stamp stamp-red">NUXT 3 SSG</span>
              <span class="stamp stamp-muted">ZERO SERVER DEPS</span>
            </div>
          </div>

          <div class="uc-footer-col">
            <h5>Navigation</h5>
            <ul class="uc-footer-links">
              <li><NuxtLink to="/">All Articles</NuxtLink></li>
              <li><NuxtLink to="/tags">Topics & Tags</NuxtLink></li>
              <li><NuxtLink to="/about">About Max</NuxtLink></li>
              <li><NuxtLink :to="latestPost ? `/posts/${latestPost.slug}` : '/'">Latest Post</NuxtLink></li>
            </ul>
          </div>

          <div class="uc-footer-col">
            <h5>Connect</h5>
            <ul class="uc-footer-links">
              <li><a href="https://github.com/McMmax" target="_blank" rel="noopener noreferrer">GitHub (@McMmax)</a></li>
              <li><a href="https://github.com/McMmax/typeshi" target="_blank" rel="noopener noreferrer">Source Code</a></li>
              <li><a href="https://github.com/McMmax/typeshi/issues" target="_blank" rel="noopener noreferrer">Submit an Issue</a></li>
            </ul>
          </div>
        </div>

        <div class="uc-footer-bottom">
          <span>TYPESHI BLOG // STATIC HOSTING ON GITHUB PAGES</span>
          <span>BUILT WITH NUXT 3 & VUE 3</span>
          <span>© 2026 MAX (MCMMAX). ALL RIGHTS RESERVED.</span>
        </div>
      </div>
    </footer>
  </div>
</template>
