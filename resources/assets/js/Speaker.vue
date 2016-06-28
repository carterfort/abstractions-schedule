<template>
  <div class="speaker-container">
    <h4>{{speaker.first_name}} {{speaker.last_name}}</h4>

    {{speaker.speaking_day}}<br/>

    <span v-if="speaker.talk"> {{speaker.talk.title}}</span>
    
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


</style>