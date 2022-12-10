<template>
	<Teleport to="body">
		<div class="modal-overlay"></div>
		<div class="modal">
			<div class="modal-close" @click="$emit('close')">×</div>
			<slot />
		</div>
	</Teleport>
</template>

<script>
export default {
	emits: ['close']
}
</script>

<style scoped>

</style>