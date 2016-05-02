/* eslint-env mocha */

import {Meteor} from 'meteor/meteor';
import {Random} from 'meteor/random';
import { assert } from 'meteor/practicalmeteor:chai';

import {Tasks} from './tasks.js';

if (Meteor.isServer){
    describe('Tasks', () =>{
        describe('methods', () =>{
            const userId=Random.id();
            let taskId;

            beforeEach(() =>{
                Tasks.remove({});
                taskId = Tasks.insert({
                    'text':'test task',
                    createdAt: new Date(),
                    owner: userId,
                    username: 'iulitab',
                });
            });

            it('can delete owned task',() =>{
                // Find the internal implementation of the task method so we can test it in isolation
                const deleteTask = Meteor.server.method_handlers['tasks.remove'];
                // Set up a fake method invocation that loks like what the method expects

                const invocation = {userId};
                deleteTask.apply(invocation, [taskId]);

                // verify that the method does what we expected

                assert.equal(Tasks.find().count(), 0);
            });
        });
    });
}