<template>
	<header class="navbar">
		<h3 class="m-0">App</h3>
		<ul class="menu">
			<li><router-link :to="{name: 'tests'}">Тесты</router-link></li>
			<li><router-link :to="{name: 'students'}">Студенты</router-link></li>
			<li><router-link :to="{name: 'form'}">Форма</router-link></li>
			<li><b><a @click.prevent="signOut">Выйти</a></b></li>
		</ul>
	</header>
</template>

<script>
import { mapActions } from 'pinia'
import { useUserStore } from '@/stores/user'
export default {
	methods: {
		...mapActions(useUserStore, ['logout']),
		signOut() {
			this.logout()
			this.$router.push({name: 'login'})
		},
	}
}
</script>
