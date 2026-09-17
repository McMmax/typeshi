const TAG_THEMES: Record<string, string> = {
  'ai-security': 'tag-magenta',
  systems: 'tag-red',
  'reverse-engineering': 'tag-red',
  architecture: 'tag-blue',
  networking: 'tag-cyan',
  anticheat: 'tag-green',
  spacetimedb: 'tag-amber',
  performance: 'tag-blue',
}

export function getTagTheme(tag: string): string {
  return TAG_THEMES[tag.toLowerCase()] ?? 'tag-blue'
}
