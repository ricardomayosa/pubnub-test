/* eslint-disable */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import Chat from 'vue-beautiful-chat';
import store from './store';
import VueChatEngine from 'vue-chat-engine';
import ChatEngineCore from 'chat-engine';
import util from './util';
import {EventBus} from './event-bus.js';

Vue.config.productionTip = false;

// Plugin Vue Beautiful Chat for the customer UI.
Vue.use(Chat, {});

// Use the geolocation package
// Vue.use(VueGeoLocation);

// Initialize ChatEngine with PubNub - Remember to activate ChatEngine first!
const publishKey = 'pub-c-830f2ac5-4a40-4cf0-b8c0-8dd4239d8c01';
const subscribeKey = 'sub-c-038f3918-33d0-11e9-ae9a-6e31a7d5aca7';

window.$supportAPI = 'https://pubsub.pubnub.com/v1/blocks/sub-key/sub-c-038f3918-33d0-11e9-ae9a-6e31a7d5aca7/support-state';

if (!publishKey || !subscribeKey) {
    console.error('ChatEngine: PubNub Keys are missing.');
}

const chatEngine = ChatEngineCore.create({
    publishKey,
    subscribeKey,
});

// Plugin ChatEngine to Vue. Store methods will fire on ChatEngine events.
Vue.use(VueChatEngine, { chatEngine, store });

function created() {
    const view = window.location.href.includes('support') ? 'support' : 'customer';
    EventBus.$emit('vue-initialized-' + view, { chatEngine, store });
}

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    components: {App},
    template: '<App/>',
    created,
    router,
});