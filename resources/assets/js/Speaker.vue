<template>
  <div class="speaker-container" @click="$parent.loadTalk(speaker.talk)" >
    <h4>
      <span class="glyphicon glyphicon-star" v-if="currentTalk && speaker.talk.title == currentTalk.title"></span>
      {{speaker.first_name}} {{speaker.last_name}}

      <b class="pull-right">{{speaker.time_start | moment 'dddd, MMMM Do YYYY hh:mm a'}}</b>
    </h4>

    <hr/>

    <h4 v-if="speaker.talk"> {{speaker.talk.title}}</h4>
    <p v-if="speaker.talk"
    v-html="speaker.talk.abstract">
    </p>
    
  </div>
</template>

<script>


export default {
  props : ['speaker'],
  data () {
    return {
      
    };
  }
};
</script>

<style>

.speaker-container {
  cursor: pointer;
}

</style>