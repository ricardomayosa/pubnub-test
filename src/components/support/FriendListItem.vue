<template>
  <div
    class="friend-list-item"
    :class="selected"
    @click="onFocus">
    <img :src="avatarSrc" />
    <div class="text">
      <span class="name">{{ name }}</span>
      
      <div v-if="showTypingIndicator">
        <span>ta escribiendo</span>
      </div>
      <div v-else>
        <span class="lastMessage">{{ lastMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import {EventBus} from '../../event-bus.js';
import globalProfileImg from '@/assets/pn.png';

export default {
  name: 'friend-list-item',
  props: {
    name: {},
    avatar: {
      default: globalProfileImg,
    },
    index: null,
  },
  data() {
    return {
      showTypingIndicator: false,
    };
  },
  created() {
    // Add a typing indicator visual to the UI
    EventBus.$on('typing-start', (key) => {
      if (this.$store.state.currentChat === key) {
        this.showTypingIndicator = true;
        // this.$nextTick(scrollBottom);
      }
    });

    // Remove the typing indicator visual from the UI
    EventBus.$on('typing-stop', (key) => {
      if (this.$store.state.currentChat === key) {
        this.showTypingIndicator = false;
      }
    });
  },
  methods: {
    onFocus(event) {
      EventBus.$emit('focus-input', event);
      this.$store.commit('setCurrentChat', {key: this.key});
    },
  },
  computed: {
    key() {
      return this.$store.state.friends[this.index].key;
    },
    lastMessage() {
      let messages = this.$store.state.chatMessages[this.key];

      if(this.showTypingIndicator) {
        return 'Ta escribiendo'
      } else {
        if (messages && messages.length) {
          return messages[messages.length-1].data.text;
        } else {
          return '';
        }
      }

      
    },
    avatarSrc() {
      if (this.avatar === 'global') {
        return globalProfileImg;
      } else if (this.avatar) {
        return this.avatar;
      } else {
        return globalProfileImg;
      }
    },
    selected() {
      return this.$store.state.currentChat === this.key ? 'selected' : '';
    },
  },
};
</script>

<style scoped>
.friend-list-item {
  width: 100%;
  height: 70px;
  padding: 5%;
  box-sizing: border-box;
  border-bottom: solid 1px #CDCDCD;
  background: linear-gradient(141deg, #505D74 0%, #15223A 75%);
  cursor: pointer;
}

.selected {
  background: #717C8F;
}

.friend-list-item img {
  border-radius: 50%;
  height: 100%;
  margin-right: 5%;
  float: left;
}

.friend-list-item span {
  display: block;
  color: #FFFFFF;
  text-align: left;
}

.text {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}

span.name {
  font-weight: bold;
  font-size: 16px;
}

span.lastMessage {
  color: #CFCFCF;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}


</style>
