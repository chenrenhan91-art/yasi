// Upgraded Natural Human Voice Engine & Guaranteed Dynamic Speaking Light Synchronizer
class SpeechEngine {
  constructor(callbacks = {}) {
    this.callbacks = callbacks;
    this.voicePresetId = localStorage.getItem('ielts_voice_preset') || 'uk-ryan';
    this.ttsEngineMode = localStorage.getItem('ielts_tts_engine') || 'auto'; // 'auto' | 'prosody' | 'edge_local' | 'kokoro_wasm'
    this.accent = localStorage.getItem('ielts_accent') || 'en-GB';
    this.rate = parseFloat(localStorage.getItem('ielts_speech_rate') || '1.0');

    this.isListening = false;
    this.isSpeaking = false;
    this.recognition = null;
    this.synth = window.speechSynthesis || null;
    this.voices = [];
    this.currentAudio = null;
    this.speechCancelled = false;
    this.speakingFallbackTimer = null;
    this.chunkTimeout = null;

    // Web Audio API real-time microphone frequency analyzer
    this.audioCtx = null;
    this.analyser = null;
    this.micStream = null;
    this.animFrameId = null;
    this.simWaveInterval = null;

    this.kokoroInstance = null;

    this.accumulatedFinalTranscript = '';
    this.currentInterimTranscript = '';
    this.shouldKeepListening = false;

    this.initTTS();
    this.initSTT();
  }

  getPreset() {
    const presets = window.IELTS_DATA?.voicePresets || [];
    return presets.find(p => p.id === this.voicePresetId) || presets[0] || {
      id: 'uk-ryan',
      name: 'Ryan · 英伦考官男声',
      accent: 'en-GB',
      gender: 'male',
      edgeVoice: 'en-GB-RyanNeural',
      kokoroVoice: 'bm_george',
      openaiVoice: 'onyx'
    };
  }

  setVoicePreset(presetId) {
    this.voicePresetId = presetId;
    localStorage.setItem('ielts_voice_preset', presetId);
    const preset = this.getPreset();
    if (preset && preset.accent) {
      this.setAccent(preset.accent);
    }
  }

  setTtsEngineMode(mode) {
    this.ttsEngineMode = mode;
    localStorage.setItem('ielts_tts_engine', mode);
  }

  initTTS() {
    if (!this.synth) return;
    const loadVoices = () => {
      this.voices = this.synth.getVoices() || [];
    };
    loadVoices();
    if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  initSTT() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      this.sttSupported = false;
      return;
    }
    this.sttSupported = true;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = this.accent;

    this.recognition.onstart = () => {
      this.isListening = true;
      this.startMicAudioAnalyzer();
      if (this.callbacks.onListeningChange) {
        this.callbacks.onListeningChange(true);
      }
    };

    this.recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          this.accumulatedFinalTranscript += (this.accumulatedFinalTranscript ? ' ' : '') + transcript.trim();
        } else {
          interim += transcript;
        }
      }
      this.currentInterimTranscript = interim;
      if (this.callbacks.onTranscriptUpdate) {
        this.callbacks.onTranscriptUpdate(this.accumulatedFinalTranscript, this.currentInterimTranscript);
      }
    };

    this.recognition.onerror = (event) => {
      if (event.error === 'no-speech' || event.error === 'aborted') {
        return;
      }
      console.warn('SpeechRecognition error:', event.error);
      if (this.callbacks.onError) {
        this.callbacks.onError(`语音识别提示: ${event.error}`);
      }
    };

    this.recognition.onend = () => {
      if (this.shouldKeepListening) {
        try {
          this.recognition.start();
          return;
        } catch (e) {}
      }
      this.isListening = false;
      this.stopMicAudioAnalyzer();
      if (this.callbacks.onListeningChange) {
        this.callbacks.onListeningChange(false);
      }
    };
  }

  // ============================================================================
  // Real-time Web Audio API Analyzer for Dynamic Speaking Light Effects
  // ============================================================================
  async startMicAudioAnalyzer() {
    this.stopMicAudioAnalyzer();
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.startSimulatedEnergyLoop('user');
      return;
    }
    try {
      this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContextClass();
      const source = this.audioCtx.createMediaStreamSource(this.micStream);
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.75;
      source.connect(this.analyser);

      const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      const tick = () => {
        if (!this.isListening) return;
        this.analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        const bands = [];
        for (let i = 0; i < 20; i++) {
          const val = (dataArray[i % dataArray.length] || 0) / 255.0;
          sum += val;
          bands.push(Math.max(0.15, val));
        }
        const avgEnergy = Math.min(1.0, (sum / 20) * 1.8);
        if (this.callbacks.onAudioEnergy) {
          this.callbacks.onAudioEnergy('user', avgEnergy, bands);
        }
        this.animFrameId = requestAnimationFrame(tick);
      };
      this.animFrameId = requestAnimationFrame(tick);
    } catch (e) {
      this.startSimulatedEnergyLoop('user');
    }
  }

  stopMicAudioAnalyzer() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.simWaveInterval && !this.isSpeaking) {
      clearInterval(this.simWaveInterval);
      this.simWaveInterval = null;
    }
    if (this.micStream) {
      this.micStream.getTracks().forEach(t => t.stop());
      this.micStream = null;
    }
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }
    if (!this.isSpeaking && this.callbacks.onAudioEnergy) {
      this.callbacks.onAudioEnergy('idle', 0, new Array(20).fill(0.12));
    }
  }

  startSimulatedEnergyLoop(mode = 'agent') {
    if (this.simWaveInterval) clearInterval(this.simWaveInterval);
    let phase = 0;
    this.simWaveInterval = setInterval(() => {
      phase += 0.32;
      const bands = [];
      let sum = 0;
      for (let i = 0; i < 20; i++) {
        // Center-weighted acoustic wave profile
        const centerWeight = 1 - Math.abs(i - 9.5) / 12;
        const rawWave = Math.abs(Math.sin(phase + i * 0.42) * Math.cos(phase * 0.65 - i * 0.25));
        const v = Math.max(0.16, Math.min(1.0, (0.2 + 0.78 * rawWave) * centerWeight));
        bands.push(v);
        sum += v;
      }
      const avg = sum / 20;
      if (this.callbacks.onAudioEnergy) {
        this.callbacks.onAudioEnergy(mode, avg, bands);
      }
    }, 60);
  }

  stopSimulatedEnergyLoop() {
    if (this.simWaveInterval) {
      clearInterval(this.simWaveInterval);
      this.simWaveInterval = null;
    }
    if (!this.isListening && this.callbacks.onAudioEnergy) {
      this.callbacks.onAudioEnergy('idle', 0, new Array(20).fill(0.12));
    }
  }

  setAccent(accentCode) {
    this.accent = accentCode;
    localStorage.setItem('ielts_accent', accentCode);
    if (this.recognition) {
      this.recognition.lang = accentCode;
    }
  }

  setRate(rateVal) {
    this.rate = Math.max(0.75, Math.min(1.35, parseFloat(rateVal) || 1.0));
    localStorage.setItem('ielts_speech_rate', String(this.rate));
  }

  pickBestBrowserVoice(preset) {
    if (!this.voices || !this.voices.length) {
      this.voices = this.synth ? this.synth.getVoices() : [];
    }
    const isUK = (preset?.accent || this.accent) === 'en-GB';
    const isMale = preset?.gender === 'male';

    const neuralCandidates = isUK
      ? (isMale
          ? ['Microsoft Ryan Online (Natural)', 'Ryan', 'Microsoft Thomas Online (Natural)', 'Google UK English Male', 'Daniel (Enhanced)', 'Oliver (Enhanced)', 'Arthur', 'Daniel', 'Oliver']
          : ['Microsoft Sonia Online (Natural)', 'Sonia', 'Microsoft Libby Online (Natural)', 'Google UK English Female', 'Serena (Enhanced)', 'Kate (Enhanced)', 'Serena', 'Kate'])
      : (isMale
          ? ['Microsoft AndrewMultilingual Online (Natural)', 'Microsoft Andrew Online (Natural)', 'Microsoft Brian Online (Natural)', 'Microsoft Guy Online (Natural)', 'Alex', 'Tom (Enhanced)', 'Evan (Enhanced)', 'Google US English']
          : ['Microsoft AvaMultilingual Online (Natural)', 'Microsoft Ava Online (Natural)', 'Microsoft Aria Online (Natural)', 'Microsoft Jenny Online (Natural)', 'Samantha (Enhanced)', 'Ava (Enhanced)', 'Allison (Enhanced)', 'Google US English', 'Samantha']);

    for (const target of neuralCandidates) {
      const found = this.voices.find(v => v.name.includes(target) && v.lang.replace('_', '-').toLowerCase().startsWith('en'));
      if (found) return found;
    }

    const regionPrefix = isUK ? 'en-gb' : 'en-us';
    const naturalRegion = this.voices.find(v =>
      v.lang.replace('_', '-').toLowerCase().startsWith(regionPrefix) &&
      (v.name.includes('Natural') || v.name.includes('Enhanced') || v.name.includes('Premium') || v.name.includes('Google'))
    );
    if (naturalRegion) return naturalRegion;

    const stdRegion = this.voices.find(v => v.lang.replace('_', '-').toLowerCase().startsWith(regionPrefix));
    if (stdRegion) return stdRegion;

    return this.voices.find(v => v.lang.toLowerCase().startsWith('en')) || null;
  }

  // ============================================================================
  // Multi-Engine Natural Speech Synthesis with Guaranteed Visual Light Sync
  // ============================================================================
  async speak(text, agentId = 'examiner', onComplete = null) {
    if (!text) {
      if (onComplete) onComplete();
      return;
    }

    this.stopSpeaking();
    this.speechCancelled = false;

    const cleanText = text.replace(/[*_#`~>]/g, '').trim();
    const preset = this.getPreset();
    const wordCount = cleanText.split(/\s+/).filter(Boolean).length;
    const estimatedDurationMs = Math.max(2600, Math.min(15000, Math.round((wordCount / 2.6) * 1000 / this.rate)));

    let finished = false;
    const notifyStart = () => {
      if (this.speechCancelled) return;
      this.isSpeaking = true;
      this.startSimulatedEnergyLoop('agent');
      if (this.callbacks.onSpeakingChange) {
        this.callbacks.onSpeakingChange(true);
      }
    };

    const notifyEnd = () => {
      if (finished) return;
      finished = true;
      if (this.speakingFallbackTimer) {
        clearTimeout(this.speakingFallbackTimer);
        this.speakingFallbackTimer = null;
      }
      this.isSpeaking = false;
      this.stopSimulatedEnergyLoop();
      if (this.callbacks.onSpeakingChange) {
        this.callbacks.onSpeakingChange(false);
      }
      if (onComplete) onComplete();
    };

    // Immediately trigger speaking visual light effect so the user ALWAYS sees dynamic feedback
    notifyStart();

    // Safety fallback timer so the light effect is guaranteed to stay active for the speech duration
    // and never gets stuck indefinitely if browser TTS hangs
    this.speakingFallbackTimer = setTimeout(() => {
      notifyEnd();
    }, estimatedDurationMs + 800);

    // 1. Try Local Python rany2/edge-tts bridge if running via server.py
    if ((this.ttsEngineMode === 'edge_local' || this.ttsEngineMode === 'auto') && window.location.protocol.startsWith('http')) {
      try {
        const res = await fetch(`/api/tts?text=${encodeURIComponent(cleanText)}&voice=${encodeURIComponent(preset.edgeVoice)}&rate=${encodeURIComponent(this.rate)}`);
        if (res.ok && res.headers.get('Content-Type')?.includes('audio')) {
          const blob = await res.blob();
          if (this.speechCancelled) {
            notifyEnd();
            return;
          }
          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          this.currentAudio = audio;
          audio.onended = () => {
            URL.revokeObjectURL(url);
            this.currentAudio = null;
            notifyEnd();
          };
          audio.onerror = () => {
            URL.revokeObjectURL(url);
            this.currentAudio = null;
            this.speakWithHumanizedProsody(cleanText, preset, estimatedDurationMs, notifyEnd);
          };
          await audio.play();
          return;
        }
      } catch (e) {}
    }

    // 2. Try Kokoro-82M WebGPU/WASM in-browser neural engine if user selected 'kokoro_wasm'
    if (this.ttsEngineMode === 'kokoro_wasm') {
      try {
        await this.speakWithKokoroWasm(cleanText, preset, notifyEnd);
        return;
      } catch (e) {
        console.warn('Kokoro-82M fallback to Humanized Prosody Engine:', e.message);
      }
    }

    // 3. Default: Humanized Prosody Web Speech Engine
    this.speakWithHumanizedProsody(cleanText, preset, estimatedDurationMs, notifyEnd);
  }

  speakWithHumanizedProsody(cleanText, preset, estimatedDurationMs, notifyEnd) {
    if (!this.synth) {
      setTimeout(notifyEnd, estimatedDurationMs);
      return;
    }

    try {
      this.synth.resume();
    } catch (e) {}

    const chunks = cleanText
      .match(/[^.!?]+[.!?]+|[^.!?]+$/g)
      ?.map(s => s.trim())
      .filter(Boolean) || [cleanText];

    const chosenVoice = this.pickBestBrowserVoice(preset);
    let idx = 0;
    const startTime = Date.now();

    const speakNextChunk = () => {
      if (this.speechCancelled || idx >= chunks.length) {
        // Ensure light effect stays visible for at least 2.2s even if browser blocked autoplay on first load
        const elapsed = Date.now() - startTime;
        const minVisualMs = Math.min(estimatedDurationMs, 2600);
        if (elapsed < minVisualMs && !this.speechCancelled) {
          this.chunkTimeout = setTimeout(notifyEnd, minVisualMs - elapsed);
        } else {
          notifyEnd();
        }
        return;
      }

      const clause = chunks[idx++];
      const utter = new SpeechSynthesisUtterance(clause);
      if (chosenVoice) {
        utter.voice = chosenVoice;
      }
      utter.lang = preset?.accent || this.accent;

      const isQuestion = clause.endsWith('?');
      const isExclamation = clause.endsWith('!');
      const basePitch = preset?.gender === 'male' ? 0.97 : 1.04;
      utter.pitch = isQuestion ? basePitch + 0.04 : (isExclamation ? basePitch + 0.03 : basePitch);

      const chunkRateMultiplier = idx === 1 && chunks.length > 1 ? 1.02 : (isQuestion ? 0.98 : 1.0);
      utter.rate = Math.max(0.75, Math.min(1.35, this.rate * chunkRateMultiplier));

      utter.onend = () => {
        if (this.speechCancelled) {
          notifyEnd();
          return;
        }
        if (idx < chunks.length) {
          this.chunkTimeout = setTimeout(speakNextChunk, 95);
        } else {
          speakNextChunk();
        }
      };

      utter.onerror = () => {
        speakNextChunk();
      };

      this.synth.speak(utter);
    };

    // 45ms delay prevents Chromium cancel() race condition
    this.chunkTimeout = setTimeout(speakNextChunk, 45);
  }

  async speakWithKokoroWasm(text, preset, notifyEnd) {
    if (!this.kokoroInstance) {
      if (this.callbacks.onError) {
        this.callbacks.onError('正在首次加载开源 Kokoro-82M 浏览器神经语音模型，请稍候...');
      }
      const module = await import('https://cdn.jsdelivr.net/npm/kokoro-js@1.2.0/+esm');
      this.kokoroInstance = await module.KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX', {
        dtype: 'q8'
      });
    }
    const audioResult = await this.kokoroInstance.generate(text, {
      voice: preset.kokoroVoice || 'bm_george'
    });
    const wavBlob = audioResult.toBlob();
    const url = URL.createObjectURL(wavBlob);
    const audio = new Audio(url);
    this.currentAudio = audio;
    audio.playbackRate = this.rate;
    audio.onended = () => {
      URL.revokeObjectURL(url);
      this.currentAudio = null;
      notifyEnd();
    };
    await audio.play();
  }

  stopSpeaking() {
    this.speechCancelled = true;
    if (this.speakingFallbackTimer) {
      clearTimeout(this.speakingFallbackTimer);
      this.speakingFallbackTimer = null;
    }
    if (this.chunkTimeout) {
      clearTimeout(this.chunkTimeout);
      this.chunkTimeout = null;
    }
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch (e) {}
      this.currentAudio = null;
    }
    if (this.synth && (this.synth.speaking || this.synth.pending)) {
      try {
        this.synth.cancel();
      } catch (e) {}
    }
    this.isSpeaking = false;
    this.stopSimulatedEnergyLoop();
    if (this.callbacks.onSpeakingChange) {
      this.callbacks.onSpeakingChange(false);
    }
  }

  startListening(initialText = '') {
    if (!this.sttSupported || !this.recognition) {
      if (this.callbacks.onError) {
        this.callbacks.onError('当前浏览器不支持原生语音识别，建议使用 Chrome 或 Edge 浏览器，或直接在下方输入框打字练习。');
      }
      return false;
    }

    this.stopSpeaking();

    this.accumulatedFinalTranscript = initialText ? initialText.trim() : '';
    this.currentInterimTranscript = '';
    this.shouldKeepListening = true;
    this.recognition.lang = this.accent;

    try {
      this.recognition.start();
      return true;
    } catch (e) {
      this.isListening = true;
      this.startMicAudioAnalyzer();
      if (this.callbacks.onListeningChange) {
        this.callbacks.onListeningChange(true);
      }
      return true;
    }
  }

  stopListening() {
    this.shouldKeepListening = false;
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
    this.isListening = false;
    this.stopMicAudioAnalyzer();
    if (this.callbacks.onListeningChange) {
      this.callbacks.onListeningChange(false);
    }
    const fullText = (this.accumulatedFinalTranscript + ' ' + this.currentInterimTranscript).trim();
    this.accumulatedFinalTranscript = '';
    this.currentInterimTranscript = '';
    return fullText;
  }
}

window.SpeechEngine = SpeechEngine;
