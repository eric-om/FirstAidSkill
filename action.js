/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a sample skill built with Amazon Alexa Skills nodejs
 * skill development kit.
 * This sample supports multiple languages (en-US, en-GB, de-GB).
 * The Intent Schema, Custom Slot and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-howto
 **/


// USED AMAZON TUTORIALS REINDEER GAMES AND MINECRAFT RECIPE
// TO HELP BUILD THIS SKILL

'use strict';

const Alexa = require('alexa-sdk');

const APP_ID = undefined; // TODO replace with your app ID (OPTIONAL).

var GAME_STATES = {
    DEFAULT: "_DEFAULT",
    CPR: "_CPR",
    CHOKING: "_CHOKING",
};

var quitting = false;
var inCycle = false;
var startingBreaths = false;
var explainedBreaths = false;

var newSessionHandlers = {
      // This will short-cut any incoming intent or launch requests and route them to this handler.
    'NewSession': function() {
         this.handler.state = GAME_STATES.DEFAULT;
         this.attributes.speechOutput = this.t('WELCOME_MESSAGE');
         this.emit(':ask', this.attributes.speechOutput);
    }
};

var handlers = Alexa.CreateStateHandler(GAME_STATES.DEFAULT, {
    'NewSession': function () {
        this.attributes.speechOutput = this.t('WELCOME_MESSAGE');
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        // this.attributes.repromptSpeech = this.t('WELCOME_REPROMT');
        this.emit(':ask', this.attributes.speechOutput);
    },
    'WhatCanISayIntent': function () {
        this.attributes.speechOutput = this.t('DEFAULT_WHAT_CAN_I_SAY_MESSAGE');
        this.emit(':ask', this.attributes.speechOutput);
    },
    'DefaultIntent': function () {
        this.attributes.speechOutput = this.t('CALL_911_MESSAGE');
        this.emit(':ask', this.attributes.speechOutput);
    },
    'GeneralIntent': function () {
        const itemSlot = this.event.request.intent.slots.Item;
        let itemName;
        if (itemSlot && itemSlot.value) {
            itemName = itemSlot.value.toLowerCase();
        }
        const myInstructions = this.t('EMERGENCIES');
        const instruction = myInstructions[itemName];

        if (itemSlot.value == 'CPR') {
            this.handler.state = GAME_STATES.CPR;
            let speechOut = this.t('CPR_SETUP_MESSAGE');
            this.attributes.speechOutput = speechOut;
            this.emit(':ask', this.attributes.speechOutput);
        }
        else if (itemSlot.value == 'choking') {
            this.handler.state = GAME_STATES.CHOKING;
            let speechOut = this.t('CHOKING_TYPE_MESSAGE');
            this.attributes.speechOutput = speechOut;
            this.emit(':ask', this.attributes.speechOutput);
        }
        else if (instruction) {
            this.attributes.speechOutput = instruction;
            this.emit(':ask', this.attributes.speechOutput);
        } else {
            let speechOutput = this.t('RECIPE_NOT_FOUND_MESSAGE');
            const repromptSpeech = this.t('RECIPE_NOT_FOUND_REPROMPT');
            speechOutput += repromptSpeech;

            this.attributes.speechOutput = speechOutput;
            this.attributes.repromptSpeech = repromptSpeech;

            this.emit(':ask', speechOutput, repromptSpeech);
        }
    },
    'HowIntent': function () {
        this.handler.state = GAME_STATES.CPR;
        const actionSlot = this.event.request.intent.slots.Action;
        let actionName;
        let instruction;

        if (actionSlot && actionSlot.value) {
            actionName = actionSlot.value.toLowerCase();
        }

        if (actionName.indexOf("compressions") != -1) {
          instruction = this.t('CPR_COMPRESSION_INSTR_MESSAGE');
        }
        if (actionName.indexOf("breaths") != -1) {
          instruction = this.t('CPR_BREATHS_INSTR_MESSAGE');
        }

        if (actionName) {
            this.attributes.speechOutput = instruction;
            this.emit(':ask', this.attributes.speechOutput);
        } else {
            let speechOutput = this.t('RECIPE_NOT_FOUND_MESSAGE');
            const repromptSpeech = this.t('RECIPE_NOT_FOUND_REPROMPT');
            speechOutput += repromptSpeech;

            this.attributes.speechOutput = speechOutput;
            this.attributes.repromptSpeech = repromptSpeech;

            this.emit(':ask', speechOutput, repromptSpeech);
        }
    },
    'CPRIntent': function () {
        this.handler.state = GAME_STATES.CPR;
        let speechOut = this.t('CPR_SETUP_MESSAGE');
        this.attributes.speechOutput = speechOut;
        this.emit(':ask', this.attributes.speechOutput);
    },
    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
});

var chokingHandlers = Alexa.CreateStateHandler(GAME_STATES.CHOKING, {
    'WhatCanISayIntent': function () {
        this.attributes.speechOutput = this.t('CHOKING_WHAT_CAN_I_SAY_MESSAGE');
        this.emit(':ask', this.attributes.speechOutput);
    },
    'NevermindIntent': function () {
        this.handler.state = GAME_STATES.DEFAULT;
        this.attributes.speechOutput = this.t('HELP_REPROMT');
        this.emit(':ask', this.attributes.speechOutput);
    },
    'ConsciousChokingIntent' : function () {
        this.handler.state = GAME_STATES.DEFAULT;
        let itemName = 'choking';
        const myInstructions = this.t('EMERGENCIES');
        const instruction = myInstructions[itemName];
        this.attributes.speechOutput = instruction;
        this.emit(':ask', this.attributes.speechOutput);
    },
    'UnconsciousChokingIntent' : function () {
        this.handler.state = GAME_STATES.DEFAULT;
        let itemName = 'choking';
        const myInstructions = this.t('EMERGENCIES');
        const instruction = myInstructions[itemName];
        this.attributes.speechOutput = instruction;
        this.emit(':ask', this.attributes.speechOutput);
    },
    'HowIntent': function () {
        this.handler.state = GAME_STATES.CPR;
        const actionSlot = this.event.request.intent.slots.Action;
        let actionName;
        let instruction;

        if (actionSlot && actionSlot.value) {
            actionName = actionSlot.value.toLowerCase();
        }

        if (actionName.indexOf("compressions") != -1) {
          instruction = this.t('CPR_COMPRESSION_INSTR_MESSAGE');
        }
        if (actionName.indexOf("breaths") != -1) {
          instruction = this.t('CPR_BREATHS_INSTR_MESSAGE');
        }

        if (actionName) {
            this.attributes.speechOutput = instruction;
            this.emit(':ask', this.attributes.speechOutput);
        } else {
            let speechOutput = this.t('RECIPE_NOT_FOUND_MESSAGE');
            const repromptSpeech = this.t('RECIPE_NOT_FOUND_REPROMPT');
            speechOutput += repromptSpeech;

            this.attributes.speechOutput = speechOutput;
            this.attributes.repromptSpeech = repromptSpeech;

            this.emit(':ask', speechOutput, repromptSpeech);
        }
    },
    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
});

var CPRHandlers = Alexa.CreateStateHandler(GAME_STATES.CPR, {
    'WhatCanISayIntent': function () {
        this.attributes.speechOutput = this.t('CPR_WHAT_CAN_I_SAY_MESSAGE');
        this.emit(':ask', this.attributes.speechOutput);
    },
    'ReadyIntent' : function () {
        inCycle = true;
        startingBreaths = true;
        this.attributes.speechOutput = this.t('CPR_COMPRESSION_MESSAGE');
        this.attributes.repromptSpeech = this.t('CPR_COMPRESSION_DONE_MESSAGE');
        this.attributes.speechOutput += this.attributes.repromptSpeech;
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'DoneIntent' : function () {
        if (inCycle === true) {
            if (startingBreaths === true) {
                startingBreaths = false;
                if (explainedBreaths === false) {
                    explainedBreaths = true;
                    this.attributes.speechOutput = this.t('CPR_BREATHS_START_MESSAGE');
                    this.emit(':ask', this.attributes.speechOutput);
                } else {
                    this.attributes.speechOutput = this.t('CPR_BREATHS_MESSAGE');
                    this.attributes.repromptSpeech = this.t('CPR_BREATHS_DONE_MESSAGE');
                    this.attributes.speechOutput += this.attributes.repromptSpeech;
                    this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
                }
            } else {
                startingBreaths = true;
                this.attributes.speechOutput = this.t('CPR_COMPRESSION_MESSAGE');
                this.attributes.repromptSpeech = this.t('CPR_COMPRESSION_DONE_MESSAGE');
                this.attributes.speechOutput += this.attributes.repromptSpeech;
                this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
            }
        }
    },
    'RestartIntent': function () {
        inCycle = true;
        const actionSlot = this.event.request.intent.slots.Action;
        let actionName;
        if (actionSlot && actionSlot.value) {
            actionName = actionSlot.value.toLowerCase();
        }
        if (actionName != null) {
          if (actionName.indexOf("breaths") != -1) {
            startingBreaths = false;
            this.attributes.speechOutput = this.t('CPR_BREATHS_MESSAGE');
            this.attributes.repromptSpeech = this.t('CPR_BREATHS_DONE_MESSAGE');
            this.attributes.speechOutput += this.attributes.repromptSpeech;
            this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
          } else {
            startingBreaths = true;
            this.attributes.speechOutput = this.t('CPR_COMPRESSION_MESSAGE');
            this.attributes.speechOutput += this.t('CPR_COMPRESSION_DONE_MESSAGE');
            this.attributes.repromptSpeech = this.attributes.repromptSpeech;
            this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
          }
        } else {
          startingBreaths = true;
          this.attributes.speechOutput = this.t('CPR_COMPRESSION_MESSAGE');
          this.attributes.speechOutput += this.t('CPR_COMPRESSION_DONE_MESSAGE');
          this.attributes.repromptSpeech = this.attributes.repromptSpeech;
          this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
        }
    },
    'CountIntent' : function () {
        if (startingBreaths === true) {
          inCycle = true;
          startingBreaths = true;
          this.attributes.speechOutput = "begin compressions in 3, 2, 1. ";
          let i;
          for (i = 0; i < 30; i++) {
              this.attributes.speechOutput += this.t('COUNT');
          }
          this.attributes.speechOutput += this.t('COUNT_END_MESSAGE');
          this.emit(':ask', this.attributes.speechOutput);
        }
    },
    'ConfirmQuitIntent': function () {
        this.attributes.speechOutput = this.t('CPR_QUIT_PROMPT_MESSAGE');
        quitting = true;
        this.emit(':ask', this.attributes.speechOutput);
    },
    'QuitIntent': function () {
        if (quitting === true) {
            this.handler.state = GAME_STATES.DEFAULT;
            quitting = false;
            inCycle = false;
            startingBreaths = false;
            explainedBreaths = false;
            this.attributes.speechOutput = this.t('HELP_REPROMT');
            this.emit(':ask', this.attributes.speechOutput);
        }
    },
    'ContinueIntent' : function () {
        quitting = false;
        this.attributes.speechOutput = this.t('CONTINUE_MESSAGE');
        this.emit(':ask', this.attributes.speechOutput);
    },
    'HowIntent': function () {
        this.handler.state = GAME_STATES.CPR;
        const actionSlot = this.event.request.intent.slots.Action;
        let actionName;
        let instruction;

        if (actionSlot && actionSlot.value) {
            actionName = actionSlot.value.toLowerCase();
        }

        if (actionName.indexOf("compressions") != -1) {
          instruction = this.t('CPR_COMPRESSION_INSTR_MESSAGE');
        }
        if (actionName.indexOf("breaths") != -1) {
          instruction = this.t('CPR_BREATHS_INSTR_MESSAGE');
        }

        if (actionName) {
            this.attributes.speechOutput = instruction;
            this.emit(':ask', this.attributes.speechOutput);
        } else {
            let speechOutput = this.t('RECIPE_NOT_FOUND_MESSAGE');
            const repromptSpeech = this.t('RECIPE_NOT_FOUND_REPROMPT');
            speechOutput += repromptSpeech;

            this.attributes.speechOutput = speechOutput;
            this.attributes.repromptSpeech = repromptSpeech;

            this.emit(':ask', speechOutput, repromptSpeech);
        }
    },
    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
});

const languageStrings = {
    'en-US': {
        translation: {
            EMERGENCIES: {
                'checking an injured adult': 'call 911. ',
                'conscious choking': 'call 911. ',
                'unconscious choking': 'call 911. ',
                'choking': 'call 911. ',
                'AED': 'call 911. ',
                'controlling bleeding': 'call 911. ',
                'burns': 'call 911. ',
                'poisoning': 'call 911. ',
                'neck injuries': 'call 911. ',
                'spinal injuries': 'call 911. ',
                'stroke': 'call 911. ',
            },
            WELCOME_MESSAGE: "First Aid here, What can I help you with? ",
            WELCOME_REPROMT: 'For instructions on what you can say, please say what can i say. ',
            HELP_MESSAGE: "I know about the following: checking an injured adult, choking, CPR, AED, controlling bleeding, burns, poisoning, neck injuries, spinal injuries, and stroke. ",
            HELP_REPROMT: "What can I help you with? ",
            STOP_MESSAGE: 'Goodbye! ',
            RECIPE_REPEAT_MESSAGE: 'Try saying repeat.',
            RECIPE_NOT_FOUND_MESSAGE: "call 911. ",
            RECIPE_NOT_FOUND_REPROMPT: 'Is there anything else I can help with? ',
            CALL_911_MESSAGE: 'call 911. ',
            DEFAULT_WHAT_CAN_I_SAY_MESSAGE: "you can say: checking an injured adult, choking, CPR, AED, controlling bleeding, burns, poisoning, neck injuries, spinal injuries, and stroke. ",
            CPR_WHAT_CAN_I_SAY_MESSAGE: "you can say: how do i do compressions, how do i do breaths, restart, restart compressions, restart breaths, count, quit CPR. ",
            CHOKING_WHAT_CAN_I_SAY_MESSAGE: "you can say: conscious, unconscious, or nevermind. ",
            CPR_SETUP_MESSAGE: "check the scene and the injured or ill person. lay the person on a firm, flat surface. you will give 30 chest compressions. push hard, push fast in the middle of the chest at least 2 inches deep and at least 100 compressions per minute. when you are ready to begin, say ready. ",
            CPR_COMPRESSION_MESSAGE: "give 30 chest compressions. say count to start a counter. ",
            CPR_BREATHS_MESSAGE: "give 2 rescue breaths. ",
            CPR_COMPRESSION_DONE_MESSAGE: "when you are done with 30 compressions, say done. ",
            CPR_COMPRESSION_INSTR_MESSAGE: "push hard, push fast in the middle of the chest at least 2 inches deep and at least 100 compressions per minute. ",
            CPR_BREATHS_INSTR_MESSAGE: "tilt the head back and lift the chin up. Pinch the nose shut then make a complete seal over the person’s mouth. Blow in for about 1 second to make the chest clearly rise. Give rescue breaths, one after the other. If chest does not rise with rescue breaths, retilt the head and give another rescue breath. ",
            CPR_BREATHS_START_MESSAGE: "you are going to give 2 rescue breaths. tilt the head back and lift the chin up. Pinch the nose shut then make a complete seal over the person’s mouth. Blow in for about 1 second to make the chest clearly rise. Give rescue breaths, one after the other. If chest does not rise with rescue breaths, retilt the head and give another rescue breath. when you are done with rescue breaths say done. ",
            CPR_BREATHS_DONE_MESSAGE: "when you are done with rescue breaths say done. ",
            CPR_QUIT_PROMPT_MESSAGE: "are you sure you want to stop? ",
            CHOKING_TYPE_MESSAGE: "is the person under distress conscious or unconscious? ",
            CONTINUE_MESSAGE: "please continue. ",
            COUNT: "push <break time=\"0.02s\" /> ",
            COUNT_END_MESSAGE: "when you are done say done with chest compressions say done. to start counting again, say count. "
        },
    },
};

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(newSessionHandlers, handlers, CPRHandlers, chokingHandlers);
    alexa.execute();
};
