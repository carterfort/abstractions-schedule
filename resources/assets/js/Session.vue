<template>
	<div class="session-container" @click="$root.loadSession(session)">
		<h4>
	      <span class="glyphicon glyphicon-star" v-if="$root.currentSession && session.talk.title == $root.currentSession.talk.title"></span>
	      {{session.speaker.first_name}} {{session.speaker.last_name}}

	      <b class="pull-right">

	      	<span v-if=" ! isNaN(session.time_start.getTime())">
	      		{{session.time_start | moment 'dddd, MMMM Do YYYY h:mm a'}}
      		</span>
      		<span v-else>
      			{{session.day}} Time TBD
      		</span>

	      </b>
	    </h4>

	    <hr/>

	    <h4 v-if="session.talk && session.talk.title"> {{session.talk.title}}</h4>
	    <p v-if="session.talk"
	    v-html="session.talk.abstract">
	    </p>
	</div>
</template>
<script>
export default {
	props : ['session']
}
</script>

<style>

.session-container {
  cursor: pointer;
}
</style>