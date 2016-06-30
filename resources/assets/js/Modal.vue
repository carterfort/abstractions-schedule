<template>
	<div class="modal-mask" v-show="show" transition="modal" v-if="session" >
	    <div class="modal-wrapper"  v-el:modal-mask @click="close($event)">
	      <div class="modal-container">

	        <div class="modal-header">
	          <slot name="header">
	          	<h3>
		            {{session.talk.title}}
	            </h3>
	          </slot>
	        </div>
	        
	        <div class="modal-body">
	          <slot name="body">
	           <div v-html="session.talk.description"></div>
	          </slot>
            <hr />

            <div class="row">
              <div class="col-md-8">
                <h4>{{session.speaker.name}}<br/>
                  <small>
                    {{session.time_start | moment 'dddd, MMMM Do YYYY h:mm a'}}  
                  </small>
                </h4>
              </div>
              <div class="col-md-4">
                <br/>
                <button class="modal-default-button btn btn-success"
                  @click="show = false">
                  <span class="glyphicon glyphicon-thumbs-up"></span>
                </button>
              </div>
            </div>
	        </div>
	      </div>
	    </div>
	  </div>
</template>

<script>

export default {
  props: {
    show: {
      type: Boolean,
      required: true,
      twoWay: true    
    },
    session : {

    }
  },
  methods: {
  	close (event){
  		if (event.target == this.$els.modalMask)
  		{
  			this.show = false;
  		}
  	}
  }
};
</script>

<style>

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 800px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
  z-index: 9999;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * the following styles are auto-applied to elements with
 * v-transition="modal" when their visiblity is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter, .modal-leave {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
