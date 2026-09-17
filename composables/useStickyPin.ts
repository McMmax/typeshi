export function useStickyPin() {
  const sentinelRef = ref<HTMLElement | null>(null)
  const isPinned = ref<boolean>(false)

  function checkPinned() {
    if (!sentinelRef.value) return
    isPinned.value = sentinelRef.value.getBoundingClientRect().top <= 0
  }

  onMounted(() => {
    checkPinned()
    window.addEventListener('scroll', checkPinned, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', checkPinned)
  })

  return { sentinelRef, isPinned }
}
