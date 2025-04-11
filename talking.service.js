const axios = require('axios');

class TalkingService {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async textToSpeech(text, language = 'en-US') {
    try {
      const response = await axios.post('https://api.tts-service.com/v1/speak', {
        text,
        language,
        voice: 'standard'
      }, {
        headers: { 'Authorization': `Bearer ${this.apiKey}` }
      });
      return response.data.audio;
    } catch (error) {
      throw new Error(`TTS conversion failed: ${error.message}`);
    }
  }
}

module.exports = TalkingService;