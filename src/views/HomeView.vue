<script setup lang="ts">
import { onBeforeMount } from 'vue'
import router from '../router/index'

onBeforeMount(() => {
	router.push('/hottable')
})
</script>

<template>
	<main>this is home page</main>
</template>
