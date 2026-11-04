// Dual-Channel AI Service with Full Optional Chinese Translation Support (correctedZh, translationZh, replyZh)
class LLMService {
  constructor() {
    this.loadConfig();
  }

  loadConfig() {
    const saved = localStorage.getItem('ielts_llm_config');
    const defaults = {
      provider: 'auto', // 'auto' | 'demo'
      baseUrl: 'https://api.deepseek.com/v1',
      apiKey: '',
      model: 'deepseek-chat'
    };
    try {
      this.config = saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
    } catch (e) {
      this.config = defaults;
    }
  }

  saveConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    localStorage.setItem('ielts_llm_config', JSON.stringify(this.config));
  }

  isLiveApiActive() {
    return this.config.provider !== 'demo' && Boolean(this.config.apiKey && this.config.apiKey.trim());
  }

  async callChatCompletion(messages, temperature = 0.7, jsonMode = false) {
    const baseUrl = (this.config.baseUrl || 'https://api.openai.com/v1').replace(/\/+$/, '');
    const url = baseUrl.endsWith('/chat/completions') ? baseUrl : `${baseUrl}/chat/completions`;

    const body = {
      model: this.config.model || 'gpt-4o-mini',
      messages,
      temperature
    };
    if (jsonMode) {
      body.response_format = { type: 'json_object' };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey.trim()}`
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`API Error (${response.status}): ${errText.slice(0, 180)}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }

  async testConnection() {
    if (!this.config.apiKey || !this.config.apiKey.trim()) {
      throw new Error('请先填写 API Key');
    }
    const reply = await this.callChatCompletion([
      { role: 'user', content: 'Say "Connected!" in 2 words.' }
    ], 0.3, false);
    return reply;
  }

  // ============================================================================
  // CHANNEL 1: Main Conversational Agent Reply (Returns { en, zh })
  // ============================================================================
  async generateAgentReply({ agentMode, currentTopic, currentPart, questionIndex, conversationHistory, userText }) {
    if (this.isLiveApiActive()) {
      try {
        const systemPrompt = this.buildAgentSystemPrompt(agentMode, currentTopic, currentPart, questionIndex);
        const recentHistory = conversationHistory.slice(-8).map(msg => ({
          role: msg.role === 'agent' ? 'assistant' : 'user',
          content: msg.text
        }));
        const messages = [
          { role: 'system', content: systemPrompt },
          ...recentHistory,
          { role: 'user', content: userText }
        ];
        const raw = await this.callChatCompletion(messages, agentMode === 'examiner' ? 0.55 : 0.78, true);
        const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
        if (parsed && parsed.en) {
          return {
            en: parsed.en.trim(),
            zh: (parsed.zh || '').trim()
          };
        }
      } catch (err) {
        console.warn('Live API fallback to local conversational engine:', err.message);
      }
    }

    return this.generateLocalAgentReply({ agentMode, currentTopic, currentPart, questionIndex, conversationHistory, userText });
  }

  buildAgentSystemPrompt(agentMode, currentTopic, currentPart, questionIndex) {
    if (agentMode === 'examiner') {
      const cueInfo = currentTopic?.cueCard
        ? `Current Part 2 Cue Card: "${currentTopic.cueCard.topic}".`
        : '';
      const qBank = currentTopic?.questions ? JSON.stringify(currentTopic.questions) : '';

      return `You are Dr. Arthur Pendelton, an official, certified IELTS Speaking Senior Examiner.
Rules:
1. Respond with a concise, natural British/International English examiner turn (1-3 sentences) and its accurate Chinese translation.
2. NEVER correct grammar out loud in your spoken reply (a separate sidebar handles grammar corrections).
3. Acknowledge the candidate's point briefly, then ask the next question or a probing follow-up ("Why do you think that is?", "Could you give a concrete example?").
4. Current Topic: "${currentTopic?.title || 'IELTS Speaking'}", Current Section: ${currentPart}. ${cueInfo}
Question Bank: ${qBank}
Return ONLY valid JSON: {"en": "Your spoken English response", "zh": "对应的自然中文翻译"}`;
    } else {
      return `You are Maya Lin, a warm, upbeat native-speaking friend chatting casually with the user to practice everyday spoken English.
Rules:
1. Use natural, idiomatic English (phrasal verbs, warm reactions, conversational rhythm) in 2-3 sentences, ending with a fun follow-up question.
2. NEVER lecture on grammar out loud.
3. Current Scenario: "${currentTopic?.title || 'Casual Catch-up'}".
Return ONLY valid JSON: {"en": "Your spoken English response", "zh": "对应的自然中文翻译"}`;
    }
  }

  generateLocalAgentReply({ agentMode, currentTopic, currentPart, questionIndex, userText }) {
    const wordCount = userText.trim().split(/\s+/).filter(Boolean).length;

    if (agentMode === 'examiner') {
      if (wordCount < 9 && currentPart !== 'Part 2') {
        const probes = [
          {
            en: "Thank you. Could you elaborate a little more on why you feel that way?",
            zh: "谢谢。你能进一步展开说说为什么会有这样的感受吗？"
          },
          {
            en: "I see. Could you give me a concrete example from your own experience?",
            zh: "我明白了。你能结合自己的亲身经历举一个具体的例子吗？"
          },
          {
            en: "Interesting point. And why do you think that is the case for most people?",
            zh: "很有意思的观点。那么你认为为什么对大多数人来说情况是这样的呢？"
          }
        ];
        return probes[questionIndex % probes.length];
      }

      const partKey = currentPart === 'Part 2' ? 'part2' : (currentPart === 'Part 3' ? 'part3' : 'part1');
      const pool = currentTopic?.questions?.[partKey]
        || currentTopic?.questions?.part1
        || currentTopic?.questions?.part3
        || [
          {
            en: "How do you think this trend will evolve over the next ten years?",
            zh: "你认为这一趋势在未来十年会如何演变？"
          }
        ];

      const item = pool[questionIndex % pool.length];
      const qEn = typeof item === 'string' ? item : item.en;
      const qZh = typeof item === 'string' ? '请结合你的个人看法或经历进一步谈谈这个问题。' : item.zh;

      const transitions = [
        { en: "Thank you for sharing that.", zh: "感谢你的分享。" },
        { en: "I see, that's a very clear point.", zh: "我明白了，这是一个非常清晰的观点。" },
        { en: "Right, thank you.", zh: "好的，谢谢。" },
        { en: "That's an interesting perspective.", zh: "这是一个很有意思的视角。" }
      ];
      const prefix = transitions[questionIndex % transitions.length];

      if (currentPart === 'Part 2' && wordCount >= 22) {
        const p3Item = currentTopic?.questions?.part3?.[0] || {
          en: "Why do you think people value these experiences so much nowadays?",
          zh: "你认为为什么现在的人们如此重视这类经历？"
        };
        const p3En = typeof p3Item === 'string' ? p3Item : p3Item.en;
        const p3Zh = typeof p3Item === 'string' ? '' : p3Item.zh;
        return {
          en: `Thank you. You've covered the key points on the card well. Now let's move on to Part 3 to discuss some broader questions. ${p3En}`,
          zh: `谢谢，你已经很好地涵盖了题卡上的要点。现在我们进入 Part 3，探讨一些更宏观的问题。${p3Zh}`
        };
      }

      return {
        en: `${prefix.en} ${qEn}`,
        zh: `${prefix.zh}${qZh}`
      };
    } else {
      const lower = userText.toLowerCase();
      if (lower.includes('tired') || lower.includes('busy') || lower.includes('work') || lower.includes('study')) {
        return {
          en: "Oh man, I totally feel you on that! Sounds like you've been burning the midnight oil lately. What do you usually do to unwind and recharge when you finally get some free time?",
          zh: "天哪，我太懂你的感受了！听起来你最近一直在熬夜连轴转。等你终于有空的时候，平时都会做些什么来放松充电呢？"
        };
      }
      if (lower.includes('movie') || lower.includes('watch') || lower.includes('show') || lower.includes('music')) {
        return {
          en: "Ooh, that sounds right up my alley! Nothing beats getting completely hooked on a good story after a long day. What was your favorite part about it without giving away too many spoilers?",
          zh: "哇，这听起来完全对我的胃口！忙碌一天后沉浸在一个好故事里简直太棒了。在不剧透太多的前提下，你最喜欢它的哪个部分？"
        };
      }
      if (lower.includes('coffee') || lower.includes('food') || lower.includes('eat') || lower.includes('tea')) {
        return {
          en: "Haha, we are definitely on the same wavelength! Good food and a proper caffeine fix can turn any day around. Do you have a favorite local spot you always go back to?",
          zh: "哈哈，咱俩绝对在一个频道上！美食加一杯到位的咖啡能瞬间治愈一整天。你有什么经常去打卡的宝藏小店吗？"
        };
      }
      if (lower.includes('travel') || lower.includes('trip') || lower.includes('visit') || lower.includes('city')) {
        return {
          en: "No way, that sounds like such an awesome getaway! Getting a change of scenery always does wonders for your mood. If you could pack your bags and go anywhere next month, where would you head?",
          zh: "太棒了吧，听起来是一次超赞的度假体验！换个环境总能让心情焕然一新。如果下个月可以收拾行李去任何地方，你最想去哪儿？"
        };
      }

      const casualFollowUps = [
        {
          en: "I totally get what you mean! It's funny how those little everyday moments make such a big difference. Have you always felt that way, or did something change your mind recently?",
          zh: "我完全明白你的意思！奇妙的是，往往就是日常里这些小瞬间能带来巨大的改变。你一直都是这么觉得的，还是最近有什么事改变了你的想法？"
        },
        {
          en: "That's so cool! Honestly, hearing you talk about it makes me want to give it a shot too. How did you first get into that?",
          zh: "这也太酷了吧！老实说，听你这么一聊我都想亲自去试试了。你最初是怎么接触到这个的？"
        },
        {
          en: "Haha, tell me about it! Life has been moving at warp speed lately. By the way, do you have anything exciting lined up for the coming weekend?",
          zh: "哈哈，谁说不是呢！最近生活节奏快得像开了倍速一样。对了，即将到来的周末你有什么好玩的安排吗？"
        }
      ];
      return casualFollowUps[questionIndex % casualFollowUps.length];
    }
  }

  // ============================================================================
  // CHANNEL 2: Silent Parallel Grammar Correction + Optional Chinese Translations
  // ============================================================================
  async analyzeUtteranceParallel(userText, contextQuestion = '', agentMode = 'examiner') {
    if (this.isLiveApiActive()) {
      try {
        const prompt = `You are an expert IELTS Speaking Band 9 coach. Analyze the user's spoken English utterance silently in the background.
Context question asked to user: "${contextQuestion}"
User's spoken utterance: "${userText}"

Return ONLY a valid JSON object with the exact following keys (MUST include accurate, natural Chinese translations in "correctedZh" and each upgrade's "translationZh"):
{
  "status": "perfect" | "minor_issues" | "needs_improvement",
  "original": "the exact user utterance",
  "corrected": "a grammatically correct, natural English version of the user's sentence",
  "correctedZh": "地道修正句对应的精准中文翻译",
  "estimatedTurnBand": 6.5,
  "issues": [
    {
      "type": "语法/时态/搭配/用词",
      "originalSpan": "problematic part in user's text",
      "replacementSpan": "corrected phrase",
      "explanationZh": "concise Chinese explanation of why this should be improved"
    }
  ],
  "band7Upgrades": [
    {
      "level": "Band 7.0 地道表达",
      "sentence": "An upgraded, idiomatic Band 7.0 English version of what the user wanted to say",
      "translationZh": "该句 Band 7.0 英文对应的流畅中文翻译",
      "highlights": ["key collocation 1", "idiom 2"],
      "noteZh": "Brief Chinese note explaining the highlight expressions"
    },
    {
      "level": "Band 8.0 高分进阶",
      "sentence": "A sophisticated Band 8.0+ English version with complex sentence structure and precise lexical resource",
      "translationZh": "该句 Band 8.0 英文对应的流畅中文翻译",
      "highlights": ["advanced phrase 1", "complex structure 2"],
      "noteZh": "Brief Chinese note on the advanced grammar/lexical upgrade"
    }
  ]
}`;

        const rawJson = await this.callChatCompletion([
          { role: 'system', content: 'You are a precise JSON-outputting IELTS Speaking grammar and lexical analyzer with bilingual Chinese translation.' },
          { role: 'user', content: prompt }
        ], 0.3, true);

        const parsed = JSON.parse(rawJson.replace(/```json|```/g, '').trim());
        if (parsed && parsed.corrected && Array.isArray(parsed.band7Upgrades)) {
          return parsed;
        }
      } catch (err) {
        console.warn('Parallel grammar analysis fallback to local diagnostic engine:', err.message);
      }
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.runLocalGrammarDiagnosis(userText, contextQuestion));
      }, 550);
    });
  }

  // Translates common English clauses & user sentences into natural Chinese for offline/instant mode
  translateSentenceToChinese(engText) {
    const lower = engText.toLowerCase();
    if (lower.includes('small historic towns') || (lower.includes('travel') && lower.includes('tourist'))) {
      return '老实说，我非常喜欢去富有历史韵味的小镇旅行，因为那里游客较少，能让我真正放松身心。';
    }
    if (lower.includes('mobile apps') && lower.includes('ai tools')) {
      return '我认为手机应用在日常生活中至关重要，而且越来越多的人正在借助人工智能工具来辅助学习。';
    }
    if (lower.includes('yunnan') && lower.includes('scenery')) {
      return '去年我和大学朋友们一起去了云南，那里的自然风光美不胜收，我们还品尝了许多地道美食。';
    }

    // Clause-level smart bilingual synthesis
    let zhParts = [];
    if (lower.includes('apartment') || lower.includes('flat')) zhParts.push('我目前住在一套公寓里');
    if (lower.includes('house')) zhParts.push('我住在独栋住宅里');
    if (lower.includes('student') || lower.includes('major')) zhParts.push('我目前是一名在校学生，专注于专业课程的学习');
    if (lower.includes('work') || lower.includes('job') || lower.includes('career')) zhParts.push('我在工作中积累了不少实践经验');
    if (lower.includes('coffee') || lower.includes('latte')) zhParts.push('每天早上一杯咖啡是我开启高效状态的必备习惯');
    if (lower.includes('movie') || lower.includes('series') || lower.includes('watch')) zhParts.push('闲暇时我喜欢通过看优质剧集或电影来转换心情');
    if (lower.includes('environment') || lower.includes('city') || lower.includes('green')) zhParts.push('城市的可持续发展需要政府政策与个人环保意识的共同努力');
    if (lower.includes('relax') || lower.includes('unwind') || lower.includes('stress')) zhParts.push('这能帮我有效缓解日常压力、恢复精力');
    if (lower.includes('important') || lower.includes('crucial') || lower.includes('essential')) zhParts.push('它在我的日常生活中扮演着不可或缺的角色');

    if (zhParts.length > 0) {
      return zhParts.join('，并且') + '。';
    }
    return '坦率地说，这件事在我的日常生活与个人成长中带来了非常积极且充实的体验。';
  }

  runLocalGrammarDiagnosis(userText, contextQuestion = '') {
    const raw = userText.trim();
    let corrected = raw;
    const issues = [];

    if (corrected.length > 0 && /^[a-z]/.test(corrected)) {
      corrected = corrected.charAt(0).toUpperCase() + corrected.slice(1);
    }
    if (corrected.length > 0 && !/[.!?]$/.test(corrected)) {
      corrected += '.';
    }

    const rules = [
      {
        regex: /\bvery like\b/gi,
        replace: 'really enjoy',
        type: '中式英语搭配',
        orig: 'very like',
        rep: 'really enjoy / am fond of',
        exp: '英语中副词 very 不能直接修饰动词 like，地道表达应使用 really enjoy 或 be keen on。'
      },
      {
        regex: /\bthere have\b/gi,
        replace: 'there are',
        type: '存现句语法',
        orig: 'there have',
        rep: 'there are / there exist',
        exp: '表示“某处存在某物”需用 there be 句型，不可受中文字面影响混用 there have。'
      },
      {
        regex: /\bless tourists\b/gi,
        replace: 'fewer tourists',
        type: '可数名词修饰',
        orig: 'less tourists',
        rep: 'fewer tourists',
        exp: 'tourists 是可数名词复数，表示“更少的”应使用 fewer 而非修饰不可数名词的 less。'
      },
      {
        regex: /\bmore and more\b/gi,
        replace: 'an increasing number of',
        type: '词汇多样性 (LR)',
        orig: 'more and more',
        rep: 'increasingly / a growing number of',
        exp: 'more and more 属于基础口语表达，替换为 a growing number of 更契合雅思 7 分词汇要求。'
      },
      {
        regex: /\bi think\b/gi,
        replace: 'From my perspective,',
        type: '高分连接标记',
        orig: 'I think',
        rep: 'From my perspective / I reckon',
        exp: '高频重复 I think 会限制流利度与连贯性（FC）得分，可替换为 I reckon 或 From my perspective。'
      },
      {
        regex: /\bvery important\b/gi,
        replace: 'indispensable',
        type: '精准词汇替换',
        orig: 'very important',
        rep: 'indispensable / crucial / paramount',
        exp: '用高阶形容词 indispensable（不可或缺的）替代 very + 基础词，能显著拉升词汇分（LR）。'
      },
      {
        regex: /\bvery good\b/gi,
        replace: 'breathtaking',
        type: '精准词汇替换',
        orig: 'very good',
        rep: 'breathtaking / exceptional / rewarding',
        exp: '避免过度依赖 very good，根据语境使用 breathtaking（令人惊叹的）或 rewarding（有收获的）更地道。'
      },
      {
        regex: /\b(?:last year|yesterday|ago)\s+I\s+go\b/gi,
        replace: (match) => match.replace(/\bgo\b/i, 'went'),
        type: '过去时态一致',
        orig: 'I go (过去时间)',
        rep: 'I went',
        exp: '句中含有明确过去时间状语（如 last year / yesterday）时，谓语动词必须使用过去式 went。'
      },
      {
        regex: /\bit make me\b/gi,
        replace: 'it makes me',
        type: '第三人称主谓一致',
        orig: 'it make me',
        rep: 'it makes me',
        exp: '主语为第三人称单数 it 时，一般现在时谓语动词需加 -s（makes）。'
      },
      {
        regex: /\bmake(?:s)? me feel relax\b/gi,
        replace: 'helps me unwind and feel relaxed',
        type: '词性与地道短语',
        orig: 'feel relax',
        rep: 'feel relaxed / unwind',
        exp: '系动词 feel 后接形容词分词 relaxed（感到放松的），或直接使用地道母语动词 unwind（松弛解乏）。'
      },
      {
        regex: /\bpeoples\b/gi,
        replace: 'people',
        type: '名词单复数',
        orig: 'peoples',
        rep: 'people / individuals',
        exp: 'people 本身即为复数集合名词，表示“人们”时不加词尾 -s。'
      }
    ];

    for (const rule of rules) {
      if (rule.regex.test(corrected)) {
        corrected = corrected.replace(rule.regex, rule.replace);
        issues.push({
          type: rule.type,
          originalSpan: rule.orig,
          replacementSpan: rule.rep,
          explanationZh: rule.exp
        });
      }
    }

    const words = raw.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    if (wordCount < 10 && issues.length === 0) {
      issues.push({
        type: '句群拓展建议 (FC & GRA)',
        originalSpan: raw,
        replacementSpan: `${corrected.replace(/\.$/, '')}, mainly because it brings a genuine sense of fulfillment.`,
        explanationZh: '当前回答较为简短，在雅思口语中建议采用“直接观点 + 原因阐述（mainly because...）+ 细节举例”结构拉长句群。'
      });
    }

    const cleanCore = corrected.replace(/^(From my perspective,\s*|Honestly,\s*|I think\s*|Well,\s*|Actually,\s*)/i, '').replace(/[.!?]+$/, '');
    const lowerCore = cleanCore.charAt(0).toLowerCase() + cleanCore.slice(1);
    const baseMeaningZh = this.translateSentenceToChinese(corrected);

    const band7Sentence = `To be completely honest, ${lowerCore}, which really makes a noticeable difference in my day-to-day life.`;
    const band7Zh = `坦率地说，${baseMeaningZh.replace(/^(老实说，|坦率地说，|我认为)/, '').replace(/。$/, '')}，这在我的日常生活中确实带来了显著的积极改变。`;

    const band8Sentence = `What stands out to me most is the fact that ${lowerCore}, offering both practical value and a genuine sense of fulfillment.`;
    const band8Zh = `最令我印象深刻的一点在于，${baseMeaningZh.replace(/^(老实说，|坦率地说，|我认为)/, '').replace(/。$/, '')}，这不仅兼具实际价值，更带来了满满的充实感。`;

    const estimatedBand = wordCount >= 22
      ? (issues.length === 0 ? 7.5 : 7.0)
      : (wordCount >= 12 ? (issues.length <= 1 ? 6.5 : 6.0) : 5.5);

    return {
      status: issues.length === 0 ? 'perfect' : (issues.length === 1 ? 'minor_issues' : 'needs_improvement'),
      original: raw,
      corrected: corrected,
      correctedZh: baseMeaningZh,
      estimatedTurnBand: estimatedBand,
      issues: issues.length > 0 ? issues : [
        {
          type: '语法与表意准确',
          originalSpan: raw,
          replacementSpan: corrected,
          explanationZh: '本句基础语法准确！可参考下方 Band 7.0 / 8.0 进阶句型，加入非限定性定语从句或主语从句进一步拔高得分。'
        }
      ],
      band7Upgrades: [
        {
          level: 'Band 7.0 地道表达',
          sentence: band7Sentence,
          translationZh: band7Zh,
          highlights: ['To be completely honest', 'makes a noticeable difference', 'day-to-day life'],
          noteZh: '引入自然话语标记语（Discourse Marker）与 which 非限定性定语从句，语流自然连贯。'
        },
        {
          level: 'Band 8.0 高分进阶',
          sentence: band8Sentence,
          translationZh: band8Zh,
          highlights: ['What stands out to me most', 'a genuine sense of fulfillment'],
          noteZh: '使用 What 主语从句聚焦核心观点，并搭配现在分词伴随状语（offering...），大幅提升语法广度（GRA）。'
        }
      ]
    };
  }

  // ============================================================================
  // CHANNEL 3: Stuck Hint / Idea Generator (卡壳急救提示)
  // ============================================================================
  async generateContextualHints(currentTopic, lastAgentQuestion, agentMode) {
    if (this.isLiveApiActive()) {
      try {
        const prompt = `The user is practicing English speaking (${agentMode === 'examiner' ? 'IELTS Speaking Test' : 'Casual English Conversation'}) and is stuck on how to answer:
Question: "${lastAgentQuestion}"
Topic: "${currentTopic?.title || ''}"

Provide instant speaking hints in JSON format:
{
  "vocab": [
    { "term": "idiomatic phrase 1", "meaning": "中文释义", "example": "Short natural example sentence" },
    { "term": "idiomatic phrase 2", "meaning": "中文释义", "example": "Short natural example sentence" },
    { "term": "idiomatic phrase 3", "meaning": "中文释义", "example": "Short natural example sentence" }
  ],
  "angles": [
    "中文思路切入点 1（具体好展开的角度）",
    "中文思路切入点 2（对比或个人经历角度）"
  ],
  "starters": [
    "Ready-to-use Band 7+ English opening sentence template 1...",
    "Ready-to-use Band 7+ English opening sentence template 2..."
  ]
}`;
        const raw = await this.callChatCompletion([
          { role: 'system', content: 'You are a helpful IELTS speaking coach outputting valid JSON.' },
          { role: 'user', content: prompt }
        ], 0.6, true);
        const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
        if (parsed && Array.isArray(parsed.vocab)) {
          return parsed;
        }
      } catch (e) {
        console.warn('Hint fallback to built-in topic hints:', e.message);
      }
    }

    if (currentTopic && currentTopic.sampleHints) {
      return currentTopic.sampleHints;
    }
    return window.IELTS_DATA.ieltsTopics[0].sampleHints;
  }

  // ============================================================================
  // CHANNEL 4: 4-Dimensional IELTS Assessment Report Generator
  // ============================================================================
  async generateSessionReport(conversationHistory, agentMode, currentTopic) {
    const userMessages = conversationHistory.filter(m => m.role === 'user');
    if (userMessages.length === 0) return null;

    if (this.isLiveApiActive()) {
      try {
        const transcript = conversationHistory.map(m => `${m.role === 'agent' ? 'Examiner/Partner' : 'Candidate'}: ${m.text}`).join('\n');
        const prompt = `Evaluate the candidate's spoken performance in the following transcript based on official IELTS Speaking assessment criteria:
Topic: "${currentTopic?.title || 'Speaking Practice'}"
Transcript:
${transcript}

Return ONLY a valid JSON object:
{
  "overallBand": 6.5,
  "scores": { "fc": 6.5, "lr": 6.5, "gra": 6.0, "p": 7.0 },
  "feedback": {
    "fc": "中文点评流利度与连贯性",
    "lr": "中文点评词汇多样性",
    "gra": "中文点评语法多样性及准确性",
    "p": "中文点评表达自然度与语流节奏"
  },
  "strengths": ["中文亮点总结 1", "中文亮点总结 2"],
  "actionItems": ["具体可执行的提分行动建议 1", "具体可执行的提分行动建议 2", "具体可执行的提分行动建议 3"]
}`;
        const raw = await this.callChatCompletion([
          { role: 'system', content: 'You are an official IELTS Speaking Senior Examiner outputting JSON assessment reports.' },
          { role: 'user', content: prompt }
        ], 0.4, true);
        const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
        if (parsed && parsed.scores) {
          return parsed;
        }
      } catch (e) {
        console.warn('Assessment fallback to local metrics calculator:', e.message);
      }
    }

    const totalTurns = userMessages.length;
    const totalWords = userMessages.reduce((acc, m) => acc + m.text.trim().split(/\s+/).filter(Boolean).length, 0);
    const avgWordsPerTurn = totalWords / Math.max(1, totalTurns);
    const issueCount = userMessages.reduce((acc, m) => acc + (m.correction?.issues?.length || 0), 0);

    const fcScore = avgWordsPerTurn >= 25 ? 7.0 : (avgWordsPerTurn >= 14 ? 6.5 : 6.0);
    const lrScore = avgWordsPerTurn >= 20 ? 7.0 : 6.5;
    const graScore = issueCount <= totalTurns ? 6.5 : 6.0;
    const pScore = 6.5;
    const rawOverall = (fcScore + lrScore + graScore + pScore) / 4;
    const overallBand = Math.round(rawOverall * 2) / 2;

    return {
      overallBand,
      stats: { totalTurns, totalWords, avgWordsPerTurn: Math.round(avgWordsPerTurn) },
      scores: { fc: fcScore, lr: lrScore, gra: graScore, p: pScore },
      feedback: {
        fc: `本次共完成 ${totalTurns} 轮开口表达，平均每轮词数约 ${Math.round(avgWordsPerTurn)} 词。${avgWordsPerTurn >= 18 ? '回答展开度良好，能够主动补充原因与细节。' : '部分回答略显简短，建议多使用 "What I mean is..." 或 "For instance..." 进行拓展。'}`,
        lr: '能够围绕话题准确传达核心意思。建议有意识地把 good、important 这类词，换成批改里给出的更具体说法。',
        gra: '基本句意表达清晰，简单句掌控稳健。可在 Part 2 与 Part 3 中进一步增加非限定性定语从句（which...）与主语从句（What stands out is...）的比例。',
        p: '交互回应及时自然。建议结合“盲听模式”与高自然度神经人声跟读模仿句重音与语调起伏。'
      },
      strengths: [
        '具备良好的实时问答反应能力，能够紧扣考官/陪练伙伴的问题核心作答',
        `在「${currentTopic?.title || '口语话题'}」中展现了清晰的主观观点与个人经历结合能力`
      ],
      actionItems: [
        '把高分说法收进语料本，合上英文，看着中文译回英语。',
        'Part 1 和 Part 3 按“观点、原因、例子”来说，每轮尽量说满三句。',
        '打开盲听，不看英文再答同一题。'
      ]
    };
  }
}

window.LLMService = LLMService;
