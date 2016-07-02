<template>
	<div>
		<ul class="list-group">
			<li class="list-group-item" v-for="session in sessions | $parent.sessionsFilter ">
				<session :session="session"></session>
			</li>
		</ul>
	</div>
</template>

<script>

export default {
	props : ['sessions']
}
</script>


<style>
</style>