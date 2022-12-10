<template>
	<Navbar v-if="user" />
	<div class="container">
		<RouterView />
	</div>
</template>

<script>
import { mapState } from 'pinia'
import { useUserStore } from '@/stores/user'
import Navbar from '@/components/Navbar.vue'

export default {
	components: {
		Navbar
	},
	computed: {
		...mapState(useUserStore, ['user'])
	}
}
</script>