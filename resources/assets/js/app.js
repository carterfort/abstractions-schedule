import Vue from 'vue';
import VueResource from 'vue-resource';
import VueMoment from 'vue-moment';

Vue.use(VueResource);
Vue.use(VueMoment);

import Speaker from './Speaker.vue';
import Modal from './Modal.vue'


new Vue({
	el : '#speaker-list',
	data : {
		url : "/api/schedule.json",
		days : [],
		speakers : [],
		speakerSearch : '',
		selectedDay : '',
		times : [],
		orderBy : 'Session time',
		orderDirection : "DESC",
		orderingOptions : [
			"Last name",
			"First name",
			"Session time"
		],
		showModal : false,
		currentTalk : false
	},
	components : {
		Speaker, Modal
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
	watch : {
		orderBy(){
			this.sortSpeakers();
		},
		orderDirection(){
			this.sortSpeakers();
		}
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

				var aProperty;
				var bProperty;

				switch(this.orderBy)
				{
					case "Last name":
						aProperty = a.last_name;
						bProperty = b.last_name;
					break;
					case "First name":
						aProperty = a.first_name;
						bProperty = b.first_name;
					break;
					case "Session time":
						aProperty = a.time_start;
						bProperty = b.time_start;
					break;
					default:
					break;
				}

				if (aProperty > bProperty) {
					return 1;
				}
				if (aProperty < bProperty) {
					return -1;
				}
				
				return 0;

			});
		
			if (this.orderDirection == 'ASC')
			{
				this.speakers.reverse();
			}
		},
		loadTalk(talk)
		{
			console.log(talk);
			this.showModal = true;
			this.currentTalk = talk;
		}


	}

})