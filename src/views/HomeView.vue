<script setup lang="ts">
import { onBeforeMount } from 'vue'
import router from '../router/index'

onBeforeMount(() => {
	console.log('home page')
	router.push('/excel_demo')
})
</script>

<template>
	<main>this is home page</main>
</template>
