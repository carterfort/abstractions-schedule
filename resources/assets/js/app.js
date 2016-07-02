import Vue from 'vue';
import VueResource from 'vue-resource';
import VueMoment from 'vue-moment';

Vue.use(VueResource);
Vue.use(VueMoment);

import Session from './Session.vue';
import Modal from './Modal.vue'
import SessionGroup from './SessionGroup.vue';


new Vue({
	el : '#session-list',
	data : {
		url : "/api/schedule.json",
		days : [],
		sessions : [],
		sessionSearch : '',
		selectedDay : '',
		times : [],
		orderBy : 'Session time',
		orderDirection : "DESC",
		orderingOptions : [
			"Last name",
			"First name",
			"Session time"
		],
		groupingOptions : [
			'Day',
			'Stage'
		],
		groups : { 
			"Day" : [], 
			"Stage" : []
		},
		groupBy : 'Day',
		stages : [],
		showModal : false,
		currentSession : false,
		currentGroupings : {}
	},
	components : {
		Session, Modal
	},
	ready(){

      this.$http.get(this.url).then((goodResponse) => {

          // success callback
          this.days = goodResponse.data.days

          this.setSessions()
          this.putSessionsIntoGroups();
          this.currentGroupings = this.groups[this.groupBy];

      }, (badResponse) => {

          // error callback
      });

	},
	watch : {
		orderBy(){
			this.sortSessions();
			this.currentGroupings = this.groups[this.groupBy];
		},
		orderDirection(){
			this.sortSessions();
			this.currentGroupings = this.groups[this.groupBy];
		},
		groupBy(){
			this.sortSessions();
			this.currentGroupings = this.groups[this.groupBy]
		}
	},
	filters : {
		sessionsFilter(sessions, value, keys){
		    
		    var filterBy = this.$options.filters.filterBy
            sessions = filterBy.call(this, sessions, this.sessionSearch);

            sessions = sessions.filter((session) => {
            	if (this.selectedDay) {
	            	return session.day == this.selectedDay
            	}
	            return true
            });

			return sessions;
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
		setSessions(){
			this.days.forEach((day) => {
				day.stages.forEach((stage) => {
					stage.sessions.forEach((session) => {
						session.time_start = this.speakingSlotForDayAndTime(day.name, session.time_start);
						session.time_end = this.speakingSlotForDayAndTime(day.name, session.time_end);
						session.day = day.name;
						session.stage = stage.name;
						this.sessions.push(session);
						this.addStage(stage.name);
					});
				})
			});

			this.sessions.forEach((session) => {

				let names = session.speaker.name.split(/[\s]/);
				let lastName = names.pop();

				session.speaker.first_name = names.join(" ");
				session.speaker.last_name = lastName;

			});

			this.sortSessions();
		},
		addStage(stage){
			if (this.stages.indexOf(stage) === -1){
				this.stages.push(stage);
			}
		},
		sortSessions(){

			this.sessions.sort((a, b) => {

				var aProperty;
				var bProperty;

				switch(this.orderBy)
				{
					case "Last name":
						aProperty = a.speaker.last_name;
						bProperty = b.speaker.last_name;
					break;
					case "First name":
						aProperty = a.speaker.first_name;
						bProperty = b.speaker.first_name;
					break;
					case "Session time":
						aProperty = Date.parse(a.time_start);
						bProperty = Date.parse(b.time_start);
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
				this.sessions.reverse();
			}
		},
		loadSession(session)
		{
			this.currentSession = session;
			this.showModal = true;
		},
		putSessionsIntoGroups()
		{

			this.sortSessions();

			var stageSessions = [];

			this.stages.forEach((stage) => {
				stageSessions.push({"label" : stage, "sessions" : this.sessions.filter((session) => {
					return session.stage == stage
				})});
			});

			var daySessions = [];
			let days = ["Thursday", "Friday", "Saturday"];

			days.forEach((day) => {
				daySessions.push({"label" : day, "sessions" : this.sessions.filter((session) => {
					return session.day == day
				})});
			});

			this.groups["Day"] = daySessions;
			this.groups["Stage"] = stageSessions;
		},
		sessionsForDay(day)
		{
			return this.sessions.filter(function(session){
				return session.day == day;
			});
		}


	}

})