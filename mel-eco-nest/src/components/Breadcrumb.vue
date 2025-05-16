<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

defineOptions({
  name: 'BreadcrumbNavigation',
})

const route = useRoute()
const router = useRouter()

// Calculate the breadcrumb path for current route
const breadcrumbs = computed(() => {
  const pathArray = route.path.split('/').filter(Boolean)
  const result = []

  // Home is always the first
  result.push({
    name: 'Home',
    path: '/',
    active: pathArray.length === 0,
  })

  // Build path hierarchy
  let currentPath = ''

  pathArray.forEach((segment, index) => {
    currentPath += `/${segment}`

    // Get name from route config
    let name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')

    // Find matching route to get better name
    const matchingRoutes = router
      .getRoutes()
      .filter(
        (route) =>
          route.path === currentPath ||
          route.name === segment ||
          (route.path.includes(segment) && route.path.endsWith(segment)),
      )

    // Pick the best matching route
    let matchedRoute = null
    if (matchingRoutes.length > 0) {
      // Prefer exact path match
      matchedRoute = matchingRoutes.find((r) => r.path === currentPath) || matchingRoutes[0]
    }

    if (matchedRoute && matchedRoute.meta && matchedRoute.meta.breadcrumb) {
      name = matchedRoute.meta.breadcrumb
    }

    // For child routes with nested paths
    if (index > 0 && route.matched && route.matched.length > 1) {
      // Check if this segment is part of a nested route
      const parentRoute = route.matched.find(
        (r) => r.path.includes(`/${pathArray[index - 1]}`) && !r.path.includes(`/${segment}`),
      )

      if (parentRoute && parentRoute.meta && parentRoute.meta.breadcrumb) {
        const prevItem = result[result.length - 1]
        if (prevItem && prevItem.name !== parentRoute.meta.breadcrumb) {
          // Insert parent route breadcrumb if needed
          const parentPath = parentRoute.path
          result.splice(result.length - 1, 0, {
            name: parentRoute.meta.breadcrumb,
            path: parentPath,
            active: false,
          })
        }
      }
    }

    result.push({
      name: name,
      path: currentPath,
      active: index === pathArray.length - 1,
    })
  })

  // Make sure only the last item is active
  if (result.length > 1) {
    // Reset Home to inactive if we're on a subpage
    result[0].active = false

    // Set the last item to active
    result[result.length - 1].active = true
  }

  return result
})
</script>

<template>
  <div class="breadcrumb-container" v-if="breadcrumbs.length > 1">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li
          v-for="(crumb, index) in breadcrumbs"
          :key="index"
          class="breadcrumb-item"
          :class="{ active: crumb.active }"
        >
          <router-link
            v-if="!crumb.active && crumb.name !== 'Actions' && crumb.name !== 'Explore'"
            :to="crumb.path"
            class="breadcrumb-link"
            >{{ crumb.name }}</router-link
          >
          <span
            v-else-if="!crumb.active && (crumb.name === 'Actions' || crumb.name === 'Explore')"
            class="non-clickable"
            >{{ crumb.name }}</span
          >
          <span v-else class="current-page">{{ crumb.name }}</span>
          <span v-if="!crumb.active && index < breadcrumbs.length - 1" class="separator">&gt;</span>
        </li>
      </ol>
    </nav>
  </div>
</template>

<style scoped>
.breadcrumb-container {
  padding: 0.5rem 1rem;
  margin: 0.5rem 2rem;
  background-color: transparent;
  border-left: 3px solid #4095bc;
}

.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  padding: 0;
  margin: 0;
  list-style: none;
  background-color: transparent;
}

.breadcrumb-item {
  margin-right: 0.3rem;
  font-size: 0.95rem;
  color: #666;
  display: flex;
  align-items: center;
}

.breadcrumb-link {
  color: #6b6b6b;
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 500;
}

.breadcrumb-link:hover {
  color: #289952;
  transform: translateX(2px);
}

.current-page {
  color: #4095bc;
  font-weight: 600;
}

.breadcrumb-item.active {
  color: #4095bc;
}

.non-clickable {
  color: #727272;
  font-weight: 500;
  cursor: default;
}

.separator {
  margin: 0 0.5rem;
  color: #999;
  font-weight: 400;
}

@media (max-width: 768px) {
  .breadcrumb-container {
    margin: 0.5rem 1rem;
    padding: 0.4rem 0.8rem;
  }

  .breadcrumb-item {
    font-size: 0.85rem;
  }

  .separator {
    margin: 0 0.3rem;
  }
}
</style>
