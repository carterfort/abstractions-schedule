import Vue from 'vue';
import VueResource from 'vue-resource';
Vue.use(VueResource);

import Speaker from './Speaker.vue';

new Vue({
	el : '#speaker-list',
	data : {
		url : "/api/schedule.json",
		days : [],
		speakers : [],
		speakerSearch : '',
		selectedDay : '',
		times : []
	},
	components : {
		Speaker
	},
	ready(){

      this.$http.get(this.url).then((goodResponse) => {

          // success callback
          this.days = goodResponse.data.days
          this.setSpeakers()

      }, (badResponse) => {

          // error callback
      });

	},
	filters : {
		speakersFilter(speakers, value, keys){
		    
		    var filterBy = this.$options.filters.filterBy
            speakers = filterBy.call(this, speakers, this.speakerSearch);

            speakers = speakers.filter((speaker) => {
            	if (this.selectedDay) {
	            	return speaker.speaking_day == this.selectedDay
            	}
	            return true
            });

			return speakers;
		}
	},
	methods : {
		actualDateForDay(day)
		{
			switch(day)
			{
				case "Thursday" :
					return new Date(Date.parse('July 28, 2016'));
				break;
				case "Friday" : 
					return new Date(Date.parse('July 29, 2016'));
				break;
				case "Saturday":
					return new Date(Date.parse('July 30, 2016'));
				break;
			}
		},
		speakingSlotForDayAndTime(day, time)
		{
			var slot = this.actualDateForDay(day);
			if (slot)
			{
				let timeString = (time/100).toString();
				let times = timeString.split('.');
				let hours = times[0];
				let minutes = times[1];
				slot.setHours(hours);
				slot.setMinutes(minutes);
			}

			console.log(slot);

			return slot;

		},
		setSpeakers(){
			this.days.forEach((day) => {
				day.stages.forEach((stage) => {
					stage.sessions.forEach((session) => {
						session.speaker.speaking_day = day.name;
						session.speaker.time_end = this.speakingSlotForDayAndTime(day.name, session.time_end);
						session.speaker.time_start = this.speakingSlotForDayAndTime(day.name, session.time_start);
						session.speaker.talk = session.talk;
						this.speakers.push(session.speaker);
					});
				})
			});

			this.speakers.forEach((speaker) => {

				let names = speaker.name.split(/[\s]/);
				let lastName = names.pop();

				speaker.first_name = names.join(" ");
				speaker.last_name = lastName;

			});

			this.sortSpeakers();
		},
		sortSpeakers(){

			this.speakers.sort((a, b) => {
				if (a.last_name > b.last_name) {
				    return 1;
				  }
				  if (a.last_name < b.last_name) {
				    return -1;
				  }
				  // a must be equal to b
				 return 0;
			});
		}
	}

})