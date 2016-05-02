import {Template} from 'meteor/templating';
import {ReactiveDict} from 'meteor/reactive-dict';

import {Tasks} from '../api/tasks.js';

import './task.js';
import './body.html';

Template.body.onCreated(function bodyOnCreated(){
    this.state = new ReactiveDict();
    Meteor.subscribe('tasks');
})

Template.body.helpers({
    tasks() {
        const instance = Template.instance();
        var filter = {};
        if (instance.state.get('hideCompleted')){
            filter = {checked: {$ne: true}};
        }
        // show newsest tasks at the top
        return Tasks.find(filter, {sort: {createdAt:-1}});
    },
    incompleteCount(){
        return Tasks.find({checked: {$ne: true}}).count();
    },
});

Template.body.events({
    'submit .new-task'(event){
        // Prevent default browser form submit
        event.preventDefault();
        
        // get value from form element
        const target = event.target;
        const text = target.text.value;

        // Insert a task into collection
        Meteor.call('tasks.insert', text);
        
        // clear form
        target.text.value='';
    },
    'change .hide-completed input'(event, instance){
        instance.state.set('hideCompleted', event.target.checked);
    },
});