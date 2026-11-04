// 口语对练。左栏是当前问题和回答，右栏是对话与批改。
class IELTSSpeakingApp {
  constructor() {
    this.llm = new window.LLMService();
    this.speech = new window.SpeechEngine({
      onListeningChange: (listening) => this.handleListeningStateChange(listening),
      onSpeakingChange: (speaking) => this.handleSpeakingStateChange(speaking),
      onTranscriptUpdate: (finalText, interimText) => this.handleLiveTranscript(finalText, interimText),
      onAudioEnergy: (mode, energy, bands) => this.handleAudioEnergyUpdate(mode, energy, bands),
      onError: (errMsg) => this.showToast(errMsg, 'warning')
    });

    this.agentMode = 'examiner'; // 'examiner' | 'casual'
    this.customTopics = this.loadCustomTopics();
    this.currentTopicId = 'full-mock-1';
    this.currentPart = 'Part 1';
    this.questionIndex = 0;

    this.showChineseTranslation = localStorage.getItem('ielts_show_zh') !== 'false';
    this.blindListeningMode = localStorage.getItem('ielts_blind_mode') === 'true';
    this.transcriptFilter = 'all';
    this._thinking = false;

    this.messages = [];
    this.notebook = this.loadNotebook();

    this.timerInterval = null;
    this.timerSeconds = 60;
    this.timerPhase = 'prep';
    this.timerRunning = false;

    this.initDOM();
    this.startNewSession(true);
  }

  loadCustomTopics() {
    try {
      const raw = localStorage.getItem('ielts_custom_topics');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  saveCustomTopics() {
    localStorage.setItem('ielts_custom_topics', JSON.stringify(this.customTopics));
  }

  loadNotebook() {
    try {
      const raw = localStorage.getItem('ielts_vocab_notebook');
      if (raw) {
        const list = JSON.parse(raw);
        return Array.isArray(list) ? list.filter(item => item && item.id !== 'sample-nb-1') : [];
      }
    } catch (e) {}
    return [];
  }

  saveNotebook() {
    localStorage.setItem('ielts_vocab_notebook', JSON.stringify(this.notebook));
    this.updateNotebookBadge();
  }

  getAllTopicsForCurrentMode() {
    if (this.agentMode === 'examiner') {
      const customIelts = this.customTopics.filter(t => t.agentMode === 'examiner');
      return [...window.IELTS_DATA.ieltsTopics, ...customIelts];
    } else {
      const customCasual = this.customTopics.filter(t => t.agentMode === 'casual');
      return [...window.IELTS_DATA.casualScenarios, ...customCasual];
    }
  }

  getCurrentTopic() {
    const list = this.getAllTopicsForCurrentMode();
    return list.find(t => t.id === this.currentTopicId) || list[0];
  }

  initDOM() {
    const voiceSelect = document.getElementById('voice-preset-select');
    if (voiceSelect) {
      const presets = window.IELTS_DATA.voicePresets || [];
      const shortNames = {
        'uk-ryan': '英音 Ryan',
        'uk-sonia': '英音 Sonia',
        'us-ava': '美音 Ava',
        'us-andrew': '美音 Andrew'
      };
      voiceSelect.innerHTML = presets.map(p => `
        <option value="${p.id}" ${p.id === this.speech.voicePresetId ? 'selected' : ''}>
          ${shortNames[p.id] || p.name}
        </option>
      `).join('');
      voiceSelect.addEventListener('change', (e) => {
        this.speech.setVoicePreset(e.target.value);
        const picked = voiceSelect.options[voiceSelect.selectedIndex];
        this.showToast(`人声已换成${picked ? picked.textContent.trim() : '当前选项'}`);
        this.replayLastAgentQuestion();
      });
    }

    const rateSelect = document.getElementById('rate-select');
    if (rateSelect) {
      rateSelect.value = String(this.speech.rate);
      rateSelect.addEventListener('change', (e) => {
        this.speech.setRate(parseFloat(e.target.value));
        this.showToast(`语速 ${e.target.value}x`);
      });
    }

    const blindToggle = document.getElementById('blind-mode-toggle');
    if (blindToggle) {
      blindToggle.checked = this.blindListeningMode;
      blindToggle.addEventListener('change', (e) => {
        this.blindListeningMode = e.target.checked;
        localStorage.setItem('ielts_blind_mode', String(this.blindListeningMode));
        document.body.classList.toggle('blind', this.blindListeningMode);
        this.renderMessages();
        this.updateStageQuestionPreview();
        this.showToast(this.blindListeningMode ? '盲听已打开' : '盲听已关闭');
      });
    }

    document.body.classList.toggle('blind', this.blindListeningMode);

    document.addEventListener('click', (event) => {
      const insertBtn = event.target.closest('[data-insert]');
      if (!insertBtn) return;
      this.insertTextToInput(insertBtn.getAttribute('data-insert') || '');
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      this.closeSettingsModal();
      this.closeNotebookModal();
      this.closeAssessmentModal();
      this.closeCustomTopicModal();
    });

    this.syncTranslationToggleUI();

    const textInput = document.getElementById('user-text-input');
    if (textInput) {
      textInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.submitUserResponse();
        }
      });
    }

    this.renderAgentCards();
    this.updateTopicChrome();
    this.updateNotebookBadge();
    this.updateApiStatusIndicator();
  }

  replayLastAgentQuestion() {
    const lastAgent = [...this.messages].reverse().find(m => m.role === 'agent');
    if (lastAgent) {
      this.speech.speak(lastAgent.text, this.agentMode);
    }
  }

  updateStageQuestionPreview() {
    const qEl = document.getElementById('stage-question-en');
    const zhEl = document.getElementById('stage-question-zh');
    if (!qEl) return;
    const lastAgent = [...this.messages].reverse().find(m => m.role === 'agent');
    if (!lastAgent) {
      qEl.textContent = '';
      qEl.classList.remove('subtitle-blurred');
      if (zhEl) zhEl.classList.add('hidden');
      return;
    }
    const hide = this.blindListeningMode && !lastAgent.peekRevealed;
    const changed = qEl.textContent !== lastAgent.text;
    qEl.textContent = lastAgent.text;
    qEl.classList.toggle('subtitle-blurred', hide);
    if (changed) {
      const scroller = document.querySelector('.practice-scroll');
      if (scroller) scroller.scrollTop = 0;
    }
    if (zhEl) {
      const showZh = this.showChineseTranslation && lastAgent.textZh && !hide;
      zhEl.textContent = lastAgent.textZh || '';
      zhEl.classList.toggle('hidden', !showZh);
    }
  }

  peekCurrentQuestion() {
    if (!this.blindListeningMode) return;
    const lastAgent = [...this.messages].reverse().find(m => m.role === 'agent');
    if (!lastAgent) return;
    this.togglePeekMessage(lastAgent.id);
  }

  // ============================================================================
  // Feature: Optional Bilingual Chinese Translation Toggle
  // ============================================================================
  toggleChineseTranslation() {
    this.showChineseTranslation = !this.showChineseTranslation;
    localStorage.setItem('ielts_show_zh', String(this.showChineseTranslation));
    this.syncTranslationToggleUI();
    this.renderMessages();
    this.renderPart2CueCard();
    this.showToast(this.showChineseTranslation ? '中文已打开' : '中文已关闭');
  }

  syncTranslationToggleUI() {
    const btn = document.getElementById('zh-toggle-btn');
    if (!btn) return;
    btn.classList.toggle('is-on', this.showChineseTranslation);
    btn.setAttribute('aria-pressed', this.showChineseTranslation ? 'true' : 'false');
  }

  handleAudioEnergyUpdate(mode, energy) {
    const level = Math.max(0, Math.min(1, Number(energy) || 0));
    const shaped = Math.min(1, 0.2 + level * 1.05);
    document.documentElement.style.setProperty('--ambient-energy', shaped.toFixed(3));
  }

  updateAmbient() {
    const listening = Boolean(this.speech.isListening);
    const speaking = Boolean(this.speech.isSpeaking) && !listening;
    document.body.classList.toggle('is-user-speaking', listening);
    document.body.classList.toggle('is-agent-speaking', speaking);
    this.renderStatusLine();
  }

  renderStatusLine() {
    const el = document.getElementById('mic-status-label');
    if (!el) return;
    if (this.speech.isListening) {
      el.textContent = '正在听。说完再点停止，或按 Enter。';
    } else if (this.speech.isSpeaking) {
      el.textContent = this.agentMode === 'examiner' ? '考官正在说话。' : '陪练正在说话。';
    } else if (this._thinking) {
      el.textContent = '正在想下一句。';
    } else {
      el.textContent = '准备好了。点录音，或输入后按 Enter。';
    }
  }

  // ============================================================================
  // Agent Mode & Topic Switching
  // ============================================================================
  switchAgentMode(mode) {
    if (this.agentMode === mode) return;
    this.speech.stopSpeaking();
    this.speech.stopListening();
    this.agentMode = mode;

    const defaultVoice = window.IELTS_DATA.agents[mode]?.defaultVoiceId || (mode === 'examiner' ? 'uk-ryan' : 'us-ava');
    this.speech.setVoicePreset(defaultVoice);
    const voiceSelect = document.getElementById('voice-preset-select');
    if (voiceSelect) voiceSelect.value = defaultVoice;

    const topics = this.getAllTopicsForCurrentMode();
    this.currentTopicId = topics[0].id;
    this.currentPart = mode === 'examiner' ? (topics[0].part === 'Part 3' ? 'Part 3' : (topics[0].part === 'Part 2 & 3' ? 'Part 2' : 'Part 1')) : 'Free Talk';

    this.renderAgentCards();
    this.updateTopicChrome();
    this.startNewSession(true);
  }

  selectTopic(topicId) {
    this.currentTopicId = topicId;
    const topic = this.getCurrentTopic();
    if (this.agentMode === 'examiner') {
      if (topic.part === 'Part 2 & 3') {
        this.currentPart = 'Part 2';
      } else if (topic.part === 'Part 3') {
        this.currentPart = 'Part 3';
      } else {
        this.currentPart = 'Part 1';
      }
    } else {
      this.currentPart = topic.part || 'Free Talk';
    }
    this.startNewSession(true);
  }

  switchIeltsPart(partName) {
    if (this.agentMode !== 'examiner') return;
    const topic = this.getCurrentTopic();
    const key = partName === 'Part 1' ? 'part1' : (partName === 'Part 2' ? 'part2' : 'part3');
    const list = topic.questions?.[key];
    const hasQuestions = Array.isArray(list) && list.length > 0;
    const hasCue = partName === 'Part 2' && topic.cueCard;
    if (!hasQuestions && !hasCue) {
      this.showToast('这套题没有这一部分。', 'warning');
      return;
    }

    this.currentPart = partName;
    this.questionIndex = 0;
    this.renderPartTabs();
    this.renderPart2CueCard();
    this.renderAgentStageHeader();

    let en = '';
    let zh = '';

    if (partName === 'Part 1') {
      const q = topic.questions?.part1?.[0];
      en = `Let's move to Part 1. ${typeof q === 'string' ? q : (q?.en || "Could you tell me about your daily routine?")}`;
      zh = `现在我们进入 Part 1。${typeof q === 'object' && q?.zh ? q.zh : '能聊聊你的日常生活作息吗？'}`;
    } else if (partName === 'Part 2') {
      this.resetPart2Timer('prep');
      const q = topic.questions?.part2?.[0];
      en = typeof q === 'string' ? q : (q?.en || `Now let's move on to Part 2. Please look at the topic card on your screen.`);
      zh = typeof q === 'object' && q?.zh ? q.zh : '现在进入 Part 2 个人陈述环节，请查看屏幕上的题卡，你有 1 分钟准备时间。';
    } else if (partName === 'Part 3') {
      const q = topic.questions?.part3?.[0];
      en = `Let's transition into Part 3 for a deeper discussion. ${typeof q === 'string' ? q : (q?.en || "How have attitudes toward this changed in recent years?")}`;
      zh = `现在我们进入 Part 3 深度讨论环节。${typeof q === 'object' && q?.zh ? q.zh : '近些年来人们对这一问题的态度发生了怎样的变化？'}`;
    }

    this.appendAgentMessage(en, zh, true);
  }

  startNewSession(speakGreeting = true) {
    this.speech.stopSpeaking();
    this.speech.stopListening();
    this.stopPart2Timer();
    this.messages = [];
    this.questionIndex = 0;

    const topic = this.getCurrentTopic();
    if (this.agentMode === 'examiner') {
      if (topic.part === 'Part 2 & 3') this.currentPart = 'Part 2';
      else if (topic.part === 'Part 3') this.currentPart = 'Part 3';
      else this.currentPart = 'Part 1';
    } else {
      this.currentPart = topic.part || 'Free Talk';
    }

    this.renderAgentStageHeader();
    this.renderPartTabs();
    this.renderPart2CueCard();

    const hintPanel = document.getElementById('hint-drawer');
    if (hintPanel) hintPanel.classList.add('hidden');
    this.syncHintButton();

    let firstEn = '';
    let firstZh = '';

    if (this.agentMode === 'examiner') {
      if (this.currentPart === 'Part 2') {
        this.resetPart2Timer('prep');
        const q2 = topic.questions?.part2?.[0];
        firstEn = typeof q2 === 'string' ? q2 : (q2?.en || window.IELTS_DATA.agents.examiner.defaultGreeting);
        firstZh = typeof q2 === 'object' && q2?.zh ? q2.zh : window.IELTS_DATA.agents.examiner.defaultGreetingZh;
      } else if (this.currentPart === 'Part 3') {
        const q3 = topic.questions?.part3?.[0];
        firstEn = `Good day. Let's dive straight into Part 3 discussion on "${topic.title}". ${typeof q3 === 'string' ? q3 : (q3?.en || '')}`;
        firstZh = `你好。让我们直接进入关于「${topic.title}」的 Part 3 深度讨论。${typeof q3 === 'object' && q3?.zh ? q3.zh : ''}`;
      } else {
        const q1 = topic.questions?.part1?.[0];
        const q1En = typeof q1 === 'string' ? q1 : (q1?.en || "Could you tell me about where you live?");
        const q1Zh = typeof q1 === 'object' && q1?.zh ? q1.zh : '能先聊聊你居住的地方吗？';
        const examiner = window.IELTS_DATA.agents.examiner;
        firstEn = `Good morning. I'm ${examiner.name}. Let's begin with Part 1. ${q1En}`;
        firstZh = `早上好，我是${examiner.nameZh}。我们从 Part 1 开始。${q1Zh}`;
      }
    } else {
      firstEn = window.IELTS_DATA.agents.casual.defaultGreeting;
      firstZh = window.IELTS_DATA.agents.casual.defaultGreetingZh;
    }

    this.appendAgentMessage(firstEn, firstZh, speakGreeting);
    this.updateTopicChrome();
  }

  // ============================================================================
  // Minimalist Header Segmented Agent Switcher & Left Controls
  // ============================================================================
  syncModeChrome() {
    const examiner = this.agentMode === 'examiner';
    const reportBtn = document.getElementById('assessment-open-btn');
    const randomBtn = document.getElementById('random-topic-btn');
    const customBtn = document.getElementById('custom-topic-btn');
    const topicLabel = document.getElementById('current-topic-label');
    if (reportBtn) reportBtn.classList.toggle('hidden', !examiner);
    if (randomBtn) randomBtn.classList.toggle('hidden', !examiner);
    if (customBtn) customBtn.classList.toggle('hidden', !examiner);
    if (topicLabel) topicLabel.classList.toggle('hidden', !examiner);
  }

  updateTopicChrome() {
    const label = document.getElementById('current-topic-label');
    if (!label) return;
    if (this.agentMode !== 'examiner') {
      label.textContent = '';
      return;
    }
    const topic = this.getCurrentTopic();
    label.textContent = topic ? topic.title : '';
  }

  pickRandomTopic() {
    if (this.agentMode !== 'examiner') return;
    const topics = this.getAllTopicsForCurrentMode();
    if (!topics.length) return;
    let next = topics[Math.floor(Math.random() * topics.length)];
    if (topics.length > 1) {
      const others = topics.filter(topic => topic.id !== this.currentTopicId);
      next = others[Math.floor(Math.random() * others.length)];
    }
    this.selectTopic(next.id);
    this.showToast(`这套题：${next.title}`);
  }

  renderAgentCards() {
    const container = document.getElementById('agent-switcher-cards');
    if (!container) return;

    const isEx = this.agentMode === 'examiner';
    container.innerHTML = `
      <button type="button" class="${isEx ? 'is-on' : ''}" aria-pressed="${isEx}" onclick="app.switchAgentMode('examiner')">考官</button>
      <button type="button" class="${!isEx ? 'is-on' : ''}" aria-pressed="${!isEx}" onclick="app.switchAgentMode('casual')">陪练</button>
    `;
    this.syncModeChrome();
  }

  renderPartTabs() {
    const bar = document.getElementById('ielts-part-tabs');
    if (!bar) return;

    if (this.agentMode !== 'examiner') {
      bar.classList.add('hidden');
      return;
    }

    bar.classList.remove('hidden');
    const parts = [
      { id: 'Part 1', label: 'Part 1' },
      { id: 'Part 2', label: 'Part 2' },
      { id: 'Part 3', label: 'Part 3' }
    ];

    bar.innerHTML = parts.map(p => {
      const active = this.currentPart === p.id;
      return `
        <button type="button" onclick="app.switchIeltsPart('${p.id}')" class="${active ? 'is-on' : ''}" aria-pressed="${active}">
          ${p.label}
        </button>
      `;
    }).join('');
  }

  renderAgentStageHeader() {
    const meta = document.getElementById('question-meta');
    if (!meta) return;
    meta.textContent = this.agentMode === 'examiner' ? this.currentPart : '闲聊';
  }

  // ============================================================================
  // Part 2 Cue Card & Timer
  // ============================================================================
  renderPart2CueCard() {
    const cardEl = document.getElementById('part2-cue-card');
    if (!cardEl) return;

    const topic = this.getCurrentTopic();
    if (this.agentMode !== 'examiner' || this.currentPart !== 'Part 2' || !topic.cueCard) {
      cardEl.classList.add('hidden');
      this.stopPart2Timer();
      return;
    }

    const cue = topic.cueCard;

    cardEl.classList.remove('hidden');
    const titleHtml = this.showChineseTranslation && cue.topicZh
      ? `${this.escapeHtml(cue.topic)}<span class="cue-zh">${this.escapeHtml(cue.topicZh)}</span>`
      : this.escapeHtml(cue.topic);

    document.getElementById('cue-card-title').innerHTML = titleHtml;
    document.getElementById('cue-card-prompts').innerHTML = cue.prompts
      .map(p => `<li>${this.escapeHtml(p)}</li>`)
      .join('');

    this.updateTimerDisplay();
  }

  resetPart2Timer(phase = 'prep') {
    this.stopPart2Timer();
    this.timerPhase = phase;
    this.timerSeconds = phase === 'prep' ? 60 : 120;
    this.updateTimerDisplay();
  }

  togglePart2Timer() {
    if (this.timerRunning) {
      this.stopPart2Timer();
    } else {
      this.timerRunning = true;
      this.updateTimerDisplay();
      this.timerInterval = setInterval(() => {
        if (this.timerSeconds > 0) {
          this.timerSeconds--;
          this.updateTimerDisplay();
        } else {
          if (this.timerPhase === 'prep') {
            this.timerPhase = 'speak';
            this.timerSeconds = 120;
            this.showToast('准备结束，开始陈述。');
            this.speech.speak("Your one minute preparation time is up. Please begin speaking now.", 'examiner');
            this.updateTimerDisplay();
          } else {
            this.stopPart2Timer();
            this.showToast('陈述时间到。可以发送这轮回答。');
          }
        }
      }, 1000);
    }
  }

  stopPart2Timer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.timerRunning = false;
    this.updateTimerDisplay();
  }

  updateTimerDisplay() {
    const timeEl = document.getElementById('part2-timer-display');
    const phaseEl = document.getElementById('part2-timer-phase');
    const btnEl = document.getElementById('part2-timer-btn');
    if (!timeEl || !phaseEl || !btnEl) return;

    const mins = String(Math.floor(this.timerSeconds / 60)).padStart(2, '0');
    const secs = String(this.timerSeconds % 60).padStart(2, '0');
    timeEl.textContent = `${mins}:${secs}`;

    phaseEl.textContent = this.timerPhase === 'prep' ? '准备' : '陈述';
    phaseEl.className = 'phase';
    phaseEl.dataset.phase = this.timerPhase;
    btnEl.textContent = this.timerRunning ? '暂停' : '开始';
  }

  // ============================================================================
  // Speech & Recording Interactions (Permanently Visible Bottom Dock)
  // ============================================================================
  handleListeningStateChange(listening) {
    const micBtn = document.getElementById('mic-record-btn');
    if (micBtn) {
      micBtn.classList.toggle('is-recording', listening);
      micBtn.setAttribute('aria-pressed', listening ? 'true' : 'false');
      micBtn.textContent = listening ? '停止' : '录音';
    }
    this.updateAmbient();
  }

  handleSpeakingStateChange() {
    this.updateAmbient();
  }

  handleLiveTranscript(finalText, interimText) {
    const inputEl = document.getElementById('user-text-input');
    if (!inputEl) return;
    const combined = (finalText + (interimText ? ' ' + interimText : '')).trim();
    inputEl.value = combined;
  }

  toggleMicrophone() {
    const inputEl = document.getElementById('user-text-input');
    if (this.speech.isListening) {
      const captured = this.speech.stopListening();
      if (inputEl && captured) {
        inputEl.value = captured;
      }
      if (inputEl && inputEl.value.trim().length > 0) {
        this.submitUserResponse();
      }
    } else {
      const currentDraft = inputEl ? inputEl.value : '';
      this.speech.startListening(currentDraft);
    }
  }

  // ============================================================================
  // Core Conversation Loop + Silent Parallel Grammar Analysis
  // ============================================================================
  appendAgentMessage(textEn, textZh = '', autoSpeak = true) {
    const msg = {
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      role: 'agent',
      text: textEn,
      textZh: textZh,
      part: this.currentPart,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      peekRevealed: false
    };
    this.messages.push(msg);
    this.renderMessages();
    this.updateStageQuestionPreview();

    if (autoSpeak) {
      this.speech.speak(textEn, this.agentMode);
    }
  }

  async submitUserResponse() {
    if (this.speech.isListening) {
      this.speech.stopListening();
    }
    this.speech.stopSpeaking();

    const inputEl = document.getElementById('user-text-input');
    const userText = inputEl ? inputEl.value.trim() : '';
    if (!userText) {
      this.showToast('先录音，或输入英文再发送。', 'warning');
      return;
    }

    inputEl.value = '';

    const lastAgentMsg = [...this.messages].reverse().find(m => m.role === 'agent');
    const lastQuestion = lastAgentMsg ? lastAgentMsg.text : '';

    const userMsgId = 'msg-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
    const userMsg = {
      id: userMsgId,
      role: 'user',
      text: userText,
      part: this.currentPart,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      correctionLoading: true,
      correction: null
    };

    this.messages.push(userMsg);
    this.questionIndex++;
    this.renderMessages();

    // PARALLEL TRACK A: Silent Background Grammar Correction + Chinese Translations
    this.llm.analyzeUtteranceParallel(userText, lastQuestion, this.agentMode)
      .then((correctionResult) => {
        const target = this.messages.find(m => m.id === userMsgId);
        if (target) {
          target.correctionLoading = false;
          target.correction = correctionResult;
          this.renderMessages();
        }
      })
      .catch(() => {
        const target = this.messages.find(m => m.id === userMsgId);
        if (target) {
          target.correctionLoading = false;
          target.correctionFailed = true;
          this.renderMessages();
        }
      });

    this._thinking = true;
    this.renderStatusLine();

    try {
      const topic = this.getCurrentTopic();
      const replyObj = await this.llm.generateAgentReply({
        agentMode: this.agentMode,
        currentTopic: topic,
        currentPart: this.currentPart,
        questionIndex: this.questionIndex,
        conversationHistory: this.messages.slice(0, -1),
        userText
      });

      const replyEn = typeof replyObj === 'string' ? replyObj : replyObj.en;
      const replyZh = typeof replyObj === 'object' ? (replyObj.zh || '') : '';

      if (this.agentMode === 'examiner' && this.currentPart === 'Part 2' && /Part 3/i.test(replyEn)) {
        this.currentPart = 'Part 3';
        this.stopPart2Timer();
        this.renderPartTabs();
        this.renderPart2CueCard();
        this.renderAgentStageHeader();
      }

      this.appendAgentMessage(replyEn, replyZh, true);
    } catch (e) {
      this.showToast('没能生成下一句，请再发一次。', 'warning');
    } finally {
      this._thinking = false;
      this.renderStatusLine();
    }
  }

  fillSampleAnswer() {
    const samples = [
      "Honestly, I very like traveling to small historic towns because there have less tourists and it make me feel relax.",
      "I think mobile apps are very important in my daily life, and more and more peoples use AI tools to help with their study.",
      "Last year I go to Yunnan with my college friends. The scenery was very good and we tried lots of local food."
    ];
    const inputEl = document.getElementById('user-text-input');
    if (inputEl) {
      inputEl.value = samples[this.questionIndex % samples.length];
      inputEl.focus();
      this.showToast('已填入示例。发送后可以看到批改。');
    }
  }

  // ============================================================================
  // Right Sidebar: Real-time Transcript & Silent Grammar Correction Stream
  // ============================================================================
  setTranscriptFilter(filterType) {
    this.transcriptFilter = filterType;
    const btnAll = document.getElementById('filter-btn-all');
    const btnCorr = document.getElementById('filter-btn-corrections');
    if (btnAll && btnCorr) {
      btnAll.classList.toggle('is-on', filterType === 'all');
      btnCorr.classList.toggle('is-on', filterType !== 'all');
      btnAll.setAttribute('aria-pressed', filterType === 'all' ? 'true' : 'false');
      btnCorr.setAttribute('aria-pressed', filterType !== 'all' ? 'true' : 'false');
    }
    this.renderMessages();
  }

  togglePeekMessage(msgId) {
    if (!this.blindListeningMode) return;
    const msg = this.messages.find(m => m.id === msgId);
    if (!msg) return;
    msg.peekRevealed = !msg.peekRevealed;
    this.renderMessages();
    this.updateStageQuestionPreview();
  }

  toggleUpgrades(msgId) {
    const msg = this.messages.find(m => m.id === msgId);
    if (!msg) return;
    msg.upgradesOpen = !msg.upgradesOpen;
    this.renderMessages();
  }

  syncHintButton() {
    const drawer = document.getElementById('hint-drawer');
    const hintBtn = document.getElementById('hint-toggle-btn');
    if (!hintBtn || !drawer) return;
    const open = !drawer.classList.contains('hidden');
    hintBtn.classList.toggle('is-on', open);
    hintBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  speakSpecificText(encodedText, role = 'examiner') {
    const text = decodeURIComponent(encodedText);
    this.speech.speak(text, role);
  }

  renderMessages() {
    const container = document.getElementById('transcript-stream');
    const countBadge = document.getElementById('turn-count-badge');
    if (!container) return;

    const userTurnCount = this.messages.filter(m => m.role === 'user').length;
    if (countBadge) countBadge.textContent = `${userTurnCount} 轮`;

    const stick = container.scrollHeight - container.scrollTop - container.clientHeight < 120;
    const savedTop = container.scrollTop;

    const visibleMessages = this.transcriptFilter === 'corrections'
      ? this.messages.filter(m => m.role === 'user')
      : this.messages;

    if (visibleMessages.length === 0) {
      const title = this.transcriptFilter === 'corrections' ? '还没有纠错' : '还没有对话';
      const body = this.transcriptFilter === 'corrections'
        ? '你回答之后，修正会出现在这里。'
        : '录音或输入一句英文，修正会跟在你的话后面。';
      container.innerHTML = `
        <div class="empty-state">
          <p><strong>${title}</strong></p>
          <p>${body}</p>
          <button type="button" class="btn" onclick="app.fillSampleAnswer()">填入示例</button>
        </div>
      `;
      return;
    }

    const examiner = this.agentMode === 'examiner';
    container.innerHTML = visibleMessages.map(msg => {
      if (msg.role === 'agent') {
        const hide = this.blindListeningMode && !msg.peekRevealed;
        const part = examiner ? `<span>${this.escapeHtml(msg.part || '')}</span>` : '';
        const zh = this.showChineseTranslation && msg.textZh && !hide
          ? `<p class="question-zh" lang="zh-CN">${this.escapeHtml(msg.textZh)}</p>`
          : '';
        return `
          <article class="turn">
            <div class="turn-meta">
              <span class="who">${examiner ? '考官' : '陪练'}</span>
              ${part}
              <time>${this.escapeHtml(msg.timestamp || '')}</time>
            </div>
            <p class="speech ${hide ? 'subtitle-blurred' : ''}" lang="en" onclick="app.togglePeekMessage('${msg.id}')">${this.escapeHtml(msg.text)}</p>
            ${zh}
          </article>
        `;
      }

      const wordCount = msg.text.trim().split(/\s+/).filter(Boolean).length;
      return `
        <article class="turn">
          <div class="turn-meta">
            <span class="who">你</span>
            <span>${wordCount} 词</span>
            <time>${this.escapeHtml(msg.timestamp || '')}</time>
          </div>
          <p class="speech speech-user" lang="en">${this.escapeHtml(msg.text)}</p>
          ${this.renderCorrectionCard(msg)}
        </article>
      `;
    }).join('');

    if (stick) {
      const latest = container.lastElementChild;
      if (latest) latest.scrollIntoView({ block: 'start', inline: 'nearest' });
    } else {
      container.scrollTop = savedTop;
    }
  }

  renderCorrectionCard(msg) {
    if (msg.correctionLoading) {
      return `<p class="pending">正在批改。</p>`;
    }

    if (msg.correctionFailed && !msg.correction) {
      return `<p class="pending">这句没有批改成功。</p>`;
    }

    if (!msg.correction) return '';

    const c = msg.correction;
    const showUpgrades = this.agentMode === 'examiner' && Array.isArray(c.band7Upgrades) && c.band7Upgrades.length > 0;
    const upgradesOpen = Boolean(msg.upgradesOpen);

    const issues = Array.isArray(c.issues) && c.issues.length > 0
      ? c.issues.map(iss => `
          <div class="issue">
            <div class="issue-type">${this.escapeHtml(iss.type)}</div>
            <div class="issue-change">
              ${iss.originalSpan ? `<span class="diff-del">${this.escapeHtml(iss.originalSpan)}</span>` : ''}
              ${iss.replacementSpan ? `<span class="diff-ins">${this.escapeHtml(iss.replacementSpan)}</span>` : ''}
            </div>
            ${iss.explanationZh ? `<p>${this.escapeHtml(iss.explanationZh)}</p>` : ''}
          </div>
        `).join('')
      : '';

    const upgrades = showUpgrades && upgradesOpen ? `
      <div class="upgrades">
        ${c.band7Upgrades.slice(0, 2).map((up, idx) => {
          const encodedUp = encodeURIComponent(up.sentence || '');
          const level = idx === 1 || /8/.test(up.level || '') ? '8分说法' : '7分说法';
          const kept = (Array.isArray(up.highlights) ? up.highlights : [])
            .filter(phrase => phrase && String(up.sentence || '').toLowerCase().includes(String(phrase).toLowerCase()))
            .slice(0, 2);
          return `
            <div class="upgrade">
              <div class="upgrade-top">
                <span class="upgrade-level">${level}</span>
                <button type="button" class="text-btn" onclick="app.speakSpecificText('${encodedUp}', '${this.agentMode}')">听这句</button>
                <button type="button" class="text-btn" onclick="app.saveUpgradeToNotebook('${msg.id}', ${idx})">收入语料</button>
              </div>
              <p class="upgrade-sentence">${this.highlightPhrases(up.sentence, kept)}</p>
              ${kept.length ? `<p class="upgrade-keep">先记 ${kept.map(phrase => `<span class="hl">${this.escapeHtml(phrase)}</span>`).join(' ')}</p>` : ''}
              ${this.showChineseTranslation && up.translationZh ? `<p class="correction-zh" lang="zh-CN">${this.escapeHtml(up.translationZh)}</p>` : ''}
              ${up.noteZh ? `<p class="upgrade-note">${this.escapeHtml(up.noteZh)}</p>` : ''}
            </div>
          `;
        }).join('')}
      </div>
    ` : '';

    return `
      <div class="correction">
        <div class="correction-head">
          <strong>修正</strong>
          <button type="button" class="text-btn push" onclick="app.saveCorrectionToNotebook('${msg.id}')">收藏</button>
        </div>
        <p class="correction-sentence" lang="en">${this.escapeHtml(c.corrected)}</p>
        ${this.showChineseTranslation && c.correctedZh ? `<p class="correction-zh" lang="zh-CN">${this.escapeHtml(c.correctedZh)}</p>` : ''}
        ${issues}
        ${showUpgrades ? `<button type="button" class="btn" onclick="app.toggleUpgrades('${msg.id}')">${upgradesOpen ? '收起' : '高分说法'}</button>` : ''}
        ${upgrades}
      </div>
    `;
  }

  highlightPhrases(sentence, highlights = []) {
    let safe = this.escapeHtml(sentence);
    if (!Array.isArray(highlights)) return safe;
    for (const h of highlights) {
      if (!h) continue;
      const escapedH = this.escapeHtml(h).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const reg = new RegExp(`(${escapedH})`, 'gi');
      safe = safe.replace(reg, '<span class="hl">$1</span>');
    }
    return safe;
  }

  // ============================================================================
  // Feature: 卡壳急救提示 (Stuck Hint / Idea Generator)
  // ============================================================================
  async toggleHintDrawer() {
    const drawer = document.getElementById('hint-drawer');
    if (!drawer) return;

    if (!drawer.classList.contains('hidden')) {
      drawer.classList.add('hidden');
      this.syncHintButton();
      return;
    }

    drawer.classList.remove('hidden');
    this.syncHintButton();
    const contentEl = document.getElementById('hint-drawer-content');
    contentEl.innerHTML = `<p class="pending">正在整理可以用的词和开口句。</p>`;

    const topic = this.getCurrentTopic();
    const lastAgentMsg = [...this.messages].reverse().find(m => m.role === 'agent');
    const lastQ = lastAgentMsg ? lastAgentMsg.text : topic.title;

    const hints = await this.llm.generateContextualHints(topic, lastQ, this.agentMode);

    const vocab = (hints.vocab || []).map(v => `
      <button type="button" class="hint-chip" data-insert="${this.escapeHtml(v.term)}">
        <span class="hint-term">${this.escapeHtml(v.term)}</span>
        <span class="hint-meaning">${this.escapeHtml(v.meaning || '')}</span>
      </button>
    `).join('');
    const angles = (hints.angles || []).map(a => `<p class="hint-line">${this.escapeHtml(a)}</p>`).join('');
    const starters = (hints.starters || []).map(s => `
      <button type="button" class="hint-chip" data-insert="${this.escapeHtml(s)}">
        <span class="hint-term">${this.escapeHtml(s)}</span>
      </button>
    `).join('');

    contentEl.innerHTML = `
      ${vocab ? `<div class="hint-group"><span class="hint-label">用词，点一下填进回答</span>${vocab}</div>` : ''}
      ${angles ? `<div class="hint-group"><span class="hint-label">角度</span>${angles}</div>` : ''}
      ${starters ? `<div class="hint-group"><span class="hint-label">开头，点一下填进回答</span>${starters}</div>` : ''}
    `;
  }

  insertTextToInput(text) {
    const inputEl = document.getElementById('user-text-input');
    if (!inputEl) return;
    const piece = String(text || '').trim();
    if (!piece) return;
    const cur = inputEl.value.trim();
    inputEl.value = cur ? `${cur} ${piece}` : piece;
    inputEl.focus();
    this.showToast('已填进回答。可以继续补，或按 Enter 发送。');
  }

  // ============================================================================
  // Feature: 错题与高分语料本 (Vocab & Error Book + Export MD/CSV)
  // ============================================================================
  saveCorrectionToNotebook(msgId) {
    const msg = this.messages.find(m => m.id === msgId);
    if (!msg || !msg.correction) return;

    const c = msg.correction;
    const firstIssue = c.issues?.[0];
    const item = {
      id: 'nb-' + Date.now(),
      type: 'correction',
      tag: firstIssue?.type || '语法与用词修正',
      original: msg.text,
      targetSentence: c.corrected,
      translationZh: c.correctedZh || '',
      highlights: firstIssue?.replacementSpan ? [firstIssue.replacementSpan] : [],
      noteZh: firstIssue?.explanationZh || '地道语法修正句',
      topicTitle: this.getCurrentTopic().title,
      createdAt: new Date().toLocaleDateString()
    };

    this.notebook.unshift(item);
    this.saveNotebook();
    this.showToast('已收入语料本。');
  }

  saveUpgradeToNotebook(msgId, upgradeIndex) {
    const msg = this.messages.find(m => m.id === msgId);
    if (!msg || !msg.correction || !msg.correction.band7Upgrades?.[upgradeIndex]) return;

    const up = msg.correction.band7Upgrades[upgradeIndex];
    const item = {
      id: 'nb-' + Date.now(),
      type: 'upgrade',
      tag: up.level || 'Band 7+ 升级',
      original: msg.text,
      targetSentence: up.sentence,
      translationZh: up.translationZh || '',
      highlights: up.highlights || [],
      noteZh: up.noteZh || '',
      topicTitle: this.getCurrentTopic().title,
      createdAt: new Date().toLocaleDateString()
    };

    this.notebook.unshift(item);
    this.saveNotebook();
    this.showToast('已收入语料本。');
  }

  removeNotebookItem(itemId) {
    this.notebook = this.notebook.filter(i => i.id !== itemId);
    this.saveNotebook();
    this.renderNotebookModal();
  }

  updateNotebookBadge() {
    const badge = document.getElementById('notebook-count-badge');
    if (!badge) return;
    const count = this.notebook.length;
    badge.textContent = String(count);
    badge.classList.toggle('hidden', count === 0);
  }

  openNotebookModal() {
    const modal = document.getElementById('notebook-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    this.renderNotebookModal();
  }

  closeNotebookModal() {
    const modal = document.getElementById('notebook-modal');
    if (modal) modal.classList.add('hidden');
  }

  renderNotebookModal() {
    const listEl = document.getElementById('notebook-items-list');
    if (!listEl) return;

    if (this.notebook.length === 0) {
      listEl.innerHTML = `
        <div class="empty-state">
          <p><strong>还没有收藏</strong></p>
          <p>批改里点「收藏」或「收入语料」。</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = this.notebook.map(item => {
      const encoded = encodeURIComponent(item.targetSentence || '');
      return `
        <article class="note-card">
          <div class="note-top">
            <div>
              <span class="note-tag">${this.escapeHtml(item.tag || '')}</span>
              <span class="note-meta">${this.escapeHtml(item.topicTitle || '')} ${this.escapeHtml(item.createdAt || '')}</span>
            </div>
            <div class="modal-actions">
              <button type="button" class="text-btn" onclick="app.speakSpecificText('${encoded}', 'examiner')">朗读</button>
              <button type="button" class="text-btn" onclick="app.removeNotebookItem('${item.id}')">删除</button>
            </div>
          </div>
          <p class="note-original">${this.escapeHtml(item.original)}</p>
          <div class="note-target">
            ${this.highlightPhrases(item.targetSentence, item.highlights)}
            ${item.translationZh ? `<p class="correction-zh" lang="zh-CN">${this.escapeHtml(item.translationZh)}</p>` : ''}
          </div>
          ${item.noteZh ? `<p class="upgrade-note">${this.escapeHtml(item.noteZh)}</p>` : ''}
        </article>
      `;
    }).join('');
  }

  exportNotebook(format = 'md') {
    if (this.notebook.length === 0) {
      this.showToast('语料本是空的。', 'warning');
      return;
    }

    let content = '';
    let filename = '';
    let mime = '';

    if (format === 'md') {
      filename = `雅思口语错题与高分语料本_${new Date().toISOString().slice(0, 10)}.md`;
      mime = 'text/markdown;charset=utf-8';
      content = `# 雅思口语错题与 Band 7+ 高分语料本\n\n导出时间：${new Date().toLocaleString()}\n\n` +
        this.notebook.map((item, idx) => (
          `### ${idx + 1}. [${item.tag}] 话题：${item.topicTitle}\n` +
          `- **我的原句**：${item.original}\n` +
          `- **地道/高分表达**：**${item.targetSentence}**\n` +
          `- **中文译文**：${item.translationZh || '-'}\n` +
          `- **核心亮点词伙**：${(item.highlights || []).join(', ') || '无'}\n` +
          `- **批改解析**：${item.noteZh || '-'}\n`
        )).join('\n');
    } else {
      filename = `雅思口语错题与高分语料本_${new Date().toISOString().slice(0, 10)}.csv`;
      mime = 'text/csv;charset=utf-8';
      const header = ['序号', '类型标签', '所属话题', '我的原句', '高分目标句', '中文译文', '核心词伙', '解析说明', '收藏日期'];
      const rows = this.notebook.map((item, idx) => [
        idx + 1,
        item.tag,
        item.topicTitle,
        item.original,
        item.targetSentence,
        item.translationZh || '',
        (item.highlights || []).join('; '),
        item.noteZh,
        item.createdAt
      ].map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(','));
      content = '\uFEFF' + [header.join(','), ...rows].join('\n');
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.showToast('已导出。');
  }

  // ============================================================================
  // Feature: 四维模考评估报告 (4-Dimensional Assessment Report Modal)
  // ============================================================================
  bandLabel(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number.toFixed(1) : '暂无';
  }

  async openAssessmentReportModal() {
    if (this.agentMode !== 'examiner') return;
    const userTurns = this.messages.filter(m => m.role === 'user');
    if (userTurns.length === 0) {
      this.showToast('先回答一轮，再看报告。', 'warning');
      return;
    }

    const modal = document.getElementById('assessment-modal');
    const bodyEl = document.getElementById('assessment-modal-body');
    if (!modal || !bodyEl) return;

    modal.classList.remove('hidden');
    bodyEl.innerHTML = `
      <div class="report-loading">
        <p>正在根据这几轮回答生成报告。</p>
        <div class="skeleton"></div>
        <div class="skeleton"></div>
        <div class="skeleton short"></div>
      </div>
    `;

    const report = await this.llm.generateSessionReport(this.messages, this.agentMode, this.getCurrentTopic());
    if (!report || !report.scores) {
      bodyEl.innerHTML = `<p>这次没能生成报告。</p>`;
      return;
    }

    const feedback = report.feedback || {};
    const fc = Number(report.scores.fc);
    const lr = Number(report.scores.lr);
    const gra = Number(report.scores.gra);
    const overall = [fc, lr, gra].every(Number.isFinite)
      ? (Math.round(((fc + lr + gra) / 3) * 2) / 2).toFixed(1)
      : '暂无';
    const rows = [
      ['流利与连贯', this.bandLabel(fc), feedback.fc],
      ['词汇', this.bandLabel(lr), feedback.lr],
      ['语法', this.bandLabel(gra), feedback.gra],
      ['发音', '未评估', '没有采集发音，这项不计分。']
    ];

    bodyEl.innerHTML = `
      <div class="report-top">
        <div>
          <h3>${this.escapeHtml(this.getCurrentTopic().title)}</h3>
          <p class="field-help">${userTurns.length} 轮。下面三项按文字估算，不含发音。</p>
        </div>
        <div class="report-score">
          <span>三项平均</span>
          <strong>${overall}</strong>
        </div>
      </div>
      ${rows.map(([label, value, note]) => `
        <div class="score-row">
          <span>${label}</span>
          <strong>${value}</strong>
          <p>${this.escapeHtml(note || '')}</p>
        </div>
      `).join('')}
      <div class="report-block">
        <h4>做得好的</h4>
        <ul>${(report.strengths || []).map(s => `<li>${this.escapeHtml(s)}</li>`).join('')}</ul>
      </div>
      <div class="report-block">
        <h4>接下来</h4>
        <ul>${(report.actionItems || []).map(s => `<li>${this.escapeHtml(s)}</li>`).join('')}</ul>
      </div>
    `;
  }

  closeAssessmentModal() {
    const modal = document.getElementById('assessment-modal');
    if (modal) modal.classList.add('hidden');
  }

  // ============================================================================
  // Feature: 自定义题卡/话题弹窗 (Custom Topic Modal)
  // ============================================================================
  openCustomTopicModal() {
    const modal = document.getElementById('custom-topic-modal');
    if (modal) modal.classList.remove('hidden');
  }

  closeCustomTopicModal() {
    const modal = document.getElementById('custom-topic-modal');
    if (modal) modal.classList.add('hidden');
  }

  saveNewCustomTopic() {
    const titleEl = document.getElementById('custom-topic-title');
    const modeEl = document.getElementById('custom-topic-mode');
    const cueEl = document.getElementById('custom-topic-cue');
    const questionsEl = document.getElementById('custom-topic-questions');

    const title = titleEl?.value.trim();
    if (!title) {
      this.showToast('先写题目。', 'warning');
      return;
    }

    const mode = modeEl?.value || 'examiner';
    const cueText = cueEl?.value.trim() || '';
    const qLines = (questionsEl?.value || '')
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const newTopic = {
      id: 'custom-' + Date.now(),
      agentMode: mode,
      part: mode === 'examiner' ? (cueText ? 'Part 2 & 3' : 'Part 1') : 'Custom Chat',
      tag: '自定义题卡',
      title,
      cueCard: cueText ? {
        topic: title,
        topicZh: `自定义题卡：${title}`,
        prompts: cueText.split('\n').map(s => s.trim()).filter(Boolean)
      } : null,
      questions: {
        part1: qLines.length > 0 ? qLines.map(q => ({ en: q, zh: '' })) : [{ en: `Let's talk about ${title}. What is your personal experience with this?`, zh: `我们来聊聊 ${title}。你对此有什么个人经历吗？` }],
        part2: [{ en: `Here is your custom topic card: "${title}". Please take a minute to prepare and then speak for up to two minutes.`, zh: `这是你的自定义题卡：“${title}”。请准备 1 分钟后开始陈述。` }],
        part3: qLines.length > 0 ? qLines.map(q => ({ en: q, zh: '' })) : [{ en: `Why do you think ${title} has become an important topic in modern society?`, zh: `为什么你认为 ${title} 在现代社会成为了一个重要话题？` }]
      },
      openingPrompt: qLines[0] || `Hey! Let's chat about "${title}". What's on your mind about it?`,
      openingPromptZh: `嗨！我们来聊聊「${title}」吧，你对此有什么想法？`
    };

    if (mode === 'casual') {
      this.agentMode = 'casual';
      this.renderAgentCards();
      this.updateTopicChrome();
      this.closeCustomTopicModal();
      this.startNewSession(true);
      this.showToast('陪练不按题目来，我们自然聊。');
      return;
    }

    this.customTopics.push(newTopic);
    this.saveCustomTopics();

    this.agentMode = mode;
    this.currentTopicId = newTopic.id;
    this.renderAgentCards();
    this.updateTopicChrome();
    this.closeCustomTopicModal();
    this.startNewSession(true);
    this.showToast('已换成这道题。');
  }

  // ============================================================================
  // Feature: AI & Open-Source Voice Settings Modal
  // ============================================================================
  openSettingsModal() {
    const modal = document.getElementById('settings-modal');
    if (!modal) return;
    modal.classList.remove('hidden');

    document.getElementById('api-provider-select').value = this.llm.config.provider || 'auto';
    document.getElementById('api-base-url').value = this.llm.config.baseUrl || '';
    document.getElementById('api-key-input').value = this.llm.config.apiKey || '';
    document.getElementById('api-model-input').value = this.llm.config.model || '';
    const ttsModeEl = document.getElementById('tts-engine-select');
    if (ttsModeEl) ttsModeEl.value = this.speech.ttsEngineMode || 'auto';
  }

  closeSettingsModal() {
    const modal = document.getElementById('settings-modal');
    if (modal) modal.classList.add('hidden');
  }

  applyProviderPreset(preset) {
    const urlEl = document.getElementById('api-base-url');
    const modelEl = document.getElementById('api-model-input');
    if (preset === 'deepseek') {
      urlEl.value = 'https://api.deepseek.com/v1';
      modelEl.value = 'deepseek-chat';
    } else if (preset === 'openai') {
      urlEl.value = 'https://api.openai.com/v1';
      modelEl.value = 'gpt-4o-mini';
    } else if (preset === 'siliconflow') {
      urlEl.value = 'https://api.siliconflow.cn/v1';
      modelEl.value = 'Qwen/Qwen2.5-72B-Instruct';
    } else if (preset === 'gemini') {
      urlEl.value = 'https://generativelanguage.googleapis.com/v1beta/openai';
      modelEl.value = 'gemini-2.0-flash';
    }
  }

  saveApiSettings() {
    const provider = document.getElementById('api-provider-select').value;
    const baseUrl = document.getElementById('api-base-url').value.trim();
    const apiKey = document.getElementById('api-key-input').value.trim();
    const model = document.getElementById('api-model-input').value.trim();
    const ttsModeEl = document.getElementById('tts-engine-select');

    if (ttsModeEl) {
      this.speech.setTtsEngineMode(ttsModeEl.value);
    }

    this.llm.saveConfig({ provider, baseUrl, apiKey, model });
    this.updateApiStatusIndicator();
    this.closeSettingsModal();
    this.showToast('已保存。');
  }

  async testApiSettings() {
    const btn = document.getElementById('test-api-btn');
    const provider = document.getElementById('api-provider-select').value;
    const baseUrl = document.getElementById('api-base-url').value.trim();
    const apiKey = document.getElementById('api-key-input').value.trim();
    const model = document.getElementById('api-model-input').value.trim();

    this.llm.saveConfig({ provider, baseUrl, apiKey, model });
    if (btn) btn.textContent = '测试中';
    try {
      const res = await this.llm.testConnection();
      this.showToast(`已连上。模型回复：${res}`);
    } catch (e) {
      this.showToast(`没连上。${e.message}`, 'warning');
    } finally {
      if (btn) btn.textContent = '测试连接';
      this.updateApiStatusIndicator();
    }
  }

  updateApiStatusIndicator() {
    const dot = document.getElementById('api-status-dot');
    const label = document.getElementById('api-status-text');
    const button = dot ? dot.closest('button') : null;
    if (!dot || !label) return;
    label.textContent = '设置';
    const live = this.llm.isLiveApiActive();
    dot.className = live ? 'status-dot is-live' : 'status-dot';
    if (button) {
      button.title = live ? `正在用云端模型 ${this.llm.config.model || ''}` : '正在用内置批改';
    }
  }

  escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  showToast(message, type = 'info') {
    const toast = document.getElementById('app-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = type === 'warning' ? 'toast is-warning' : 'toast';
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.add('hidden');
    }, 3200);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.app = new IELTSSpeakingApp();
});
