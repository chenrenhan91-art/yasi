// Built-in IELTS Speaking Topic Bank, Bilingual Translations & Natural Voice Presets
window.IELTS_DATA = {
  // Open-Source Voice Presets & Character Profiles
  voicePresets: [
    {
      id: 'uk-ryan',
      name: 'Ryan · 英伦考官男声 (Neural)',
      accent: 'en-GB',
      gender: 'male',
      edgeVoice: 'en-GB-RyanNeural',
      kokoroVoice: 'bm_george',
      openaiVoice: 'onyx',
      badge: '推荐考官音色',
      desc: '基于 rany2/edge-tts 与 Kokoro 音色映射，沉稳自然的伦敦腔男声'
    },
    {
      id: 'uk-sonia',
      name: 'Sonia · 英伦知性女声 (Neural)',
      accent: 'en-GB',
      gender: 'female',
      edgeVoice: 'en-GB-SoniaNeural',
      kokoroVoice: 'bf_emma',
      openaiVoice: 'shimmer',
      badge: '温柔英音',
      desc: '咬字清晰、语调柔和的英式女考官/陪练音色'
    },
    {
      id: 'us-ava',
      name: 'Ava · 美式自然女伴 (Neural)',
      accent: 'en-US',
      gender: 'female',
      edgeVoice: 'en-US-AvaMultilingualNeural',
      kokoroVoice: 'af_heart',
      openaiVoice: 'nova',
      badge: '推荐陪练音色',
      desc: '富有呼吸感与情感起伏的北美日常对话女声'
    },
    {
      id: 'us-andrew',
      name: 'Andrew · 美式温暖男声 (Neural)',
      accent: 'en-US',
      gender: 'male',
      edgeVoice: 'en-US-AndrewMultilingualNeural',
      kokoroVoice: 'am_adam',
      openaiVoice: 'echo',
      badge: '阳光美音',
      desc: '松弛感十足的美式日常播客级男声'
    }
  ],

  // Agent Profiles
  agents: {
    examiner: {
      id: 'examiner',
      name: 'Claire Hargreaves',
      nameZh: '克莱尔·哈格里夫斯',
      role: 'IELTS Speaking Examiner',
      badge: '雅思口语考官',
      avatar: '🎓',
      defaultVoiceId: 'uk-ryan',
      themeColor: 'indigo',
      description: '按 Part 1、Part 2、Part 3 往下问，不在对话里改语法。',
      defaultGreeting: "Good morning. My name is Claire Hargreaves. Could you tell me your full name, please?",
      defaultGreetingZh: "早上好。我是克莱尔·哈格里夫斯。请告诉我你的全名。"
    },
    casual: {
      id: 'casual',
      name: 'Maya Lin',
      role: 'Native Speaking Partner',
      badge: '日常口语陪练伙伴',
      avatar: '✨',
      defaultVoiceId: 'us-ava',
      themeColor: 'teal',
      description: '无考试规则束缚，像母语好友一样松弛闲聊，多用地道习语与短语动词，帮你培养英语直觉、告别开口焦虑。',
      defaultGreeting: "Hey there! Awesome to catch up with you today. How's your week been going so far? Anything fun or unexpected happen lately?",
      defaultGreetingZh: "嗨！今天能和你叙叙旧太棒了。这周过得怎么样？最近有什么好玩或意想不到的事发生吗？"
    }
  },

  // IELTS Examiner Topics
  ieltsTopics: [
    {
      id: 'full-mock-1',
      part: 'Full Mock',
      category: '全真模考套题',
      title: '全真模考：居住地 + 难忘的旅行 + 旅游业影响',
      tag: '当季高频套题',
      cueCard: {
        topic: 'Describe an unforgettable journey you went on.',
        topicZh: '描述一次令你难忘的旅行经历。',
        prompts: [
          'Where you went on this journey (你去了哪里)',
          'Who you went with (你和谁一起去的)',
          'What you did and saw during the trip (你在旅途中做了什么、看到了什么)',
          'And explain why this journey was so unforgettable for you. (并解释为什么这次旅行令你如此难忘)'
        ]
      },
      questions: {
        part1: [
          {
            en: "Let's talk about where you live. Do you live in a house or an apartment?",
            zh: "我们来聊聊你居住的地方吧。你目前住在独栋住宅还是公寓里？"
          },
          {
            en: "What do you like most about your neighborhood?",
            zh: "你最喜欢你所在社区/街区的哪一点？"
          },
          {
            en: "Is there anything you would like to change about your hometown?",
            zh: "关于你的家乡，有什么是你希望改善或改变的吗？"
          },
          {
            en: "Do you think your hometown is a good place for young people to live? Why?",
            zh: "你认为你的家乡适合年轻人定居生活吗？为什么？"
          }
        ],
        part2: [
          {
            en: "Now I'm going to give you a topic, and I'd like you to talk about it for one to two minutes. Before you talk, you'll have one minute to think about what you're going to say. Here is your topic card: 'Describe an unforgettable journey you went on.' Please start speaking when you're ready.",
            zh: "现在我将给你一个话题，请围绕它进行 1 到 2 分钟的陈述。在开始前你有 1 分钟的准备时间。你的题卡是：“描述一次令你难忘的旅行经历”。准备好后请开始发言。"
          }
        ],
        part3: [
          {
            en: "We've been talking about an unforgettable journey, and I'd like to discuss some more general questions related to travel. Why do you think more and more people prefer independent travel over package tours nowadays?",
            zh: "刚才我们聊了难忘的旅行，接下来我想讨论一些与旅游相关的宏观问题。你认为为什么现在越来越多的人偏爱自由行而不是跟团游？"
          },
          {
            en: "How does mass tourism affect local communities and traditional cultures?",
            zh: "大众旅游业对当地社区和传统文化会产生怎样的影响？"
          },
          {
            en: "Do you think virtual reality technology might replace physical travel in the future?",
            zh: "你认为虚拟现实（VR）技术在未来有可能会取代实地旅行吗？"
          }
        ]
      },
      sampleHints: {
        vocab: [
          { term: 'off the beaten track', meaning: '人迹罕至的、小众路线', example: 'We decided to venture off the beaten track instead of visiting tourist traps.' },
          { term: 'eye-opening experience', meaning: '大开眼界的经历', example: 'Interacting with the local artisans was truly an eye-opening experience.' },
          { term: 'cultural immersion', meaning: '深度文化沉浸体验', example: 'Independent travel allows for much deeper cultural immersion.' }
        ],
        angles: [
          '从“感官冲击与自然风光”切入：描述当地独特的气候、建筑或饮食带来的第一印象',
          '从“意外插曲带来的成长”切入：比如迷路或遇到热心当地人，让旅行从观光变成心灵触动'
        ],
        starters: [
          "If I had to pick one journey that really left a lasting impression on me, it would definitely be my trip to...",
          "What made this experience stand out from any other trip I've taken is the fact that..."
        ]
      }
    },
    {
      id: 'p1-work-study',
      part: 'Part 1',
      category: 'Part 1 必考基础话题',
      title: 'Work & Study (工作与学业)',
      tag: '必考题',
      cueCard: null,
      questions: {
        part1: [
          {
            en: "Do you work or are you currently a student?",
            zh: "你目前已经工作了，还是一名在读学生？"
          },
          {
            en: "Why did you choose this major or career path?",
            zh: "你当初为什么选择了这个专业或职业方向？"
          },
          {
            en: "What does a typical day look like for you in your work or studies?",
            zh: "在你日常的工作或学习中，典型的一天是怎样度过的？"
          },
          {
            en: "Is there any new skill you're hoping to pick up in the near future?",
            zh: "在不久的将来，有什么新技能是你希望掌握的吗？"
          }
        ]
      },
      sampleHints: {
        vocab: [
          { term: 'fast-paced environment', meaning: '快节奏的环境', example: 'I thrive in a fast-paced environment where every day brings new challenges.' },
          { term: 'steep learning curve', meaning: '陡峭的学习曲线（初期难但收获大）', example: 'Although the course had a steep learning curve, it paid off handsomely.' },
          { term: 'strike a work-life balance', meaning: '保持工作与生活的平衡', example: 'My top priority right now is to strike a healthier work-life balance.' }
        ],
        angles: [
          '结合个人长期职业规划说明当初选择该专业/工作的动机',
          '具体对比自己最享受的日常环节与最具挑战性的部分'
        ],
        starters: [
          "Currently, I'm a final-year undergraduate majoring in..., which keeps me pretty occupied.",
          "To be completely honest, what initially drew me to this field was..."
        ]
      }
    },
    {
      id: 'p1-technology-ai',
      part: 'Part 1',
      category: 'Part 1 日常高频话题',
      title: 'Technology & Apps (科技与手机应用)',
      tag: '当季新题',
      cueCard: null,
      questions: {
        part1: [
          {
            en: "What mobile apps do you use most frequently in your daily life?",
            zh: "你在日常生活中最常使用哪些手机应用程序？"
          },
          {
            en: "Have you ever used artificial intelligence tools to help with your work or study?",
            zh: "你是否用过人工智能工具来辅助你的工作或学习？"
          },
          {
            en: "Do you think people nowadays rely too much on smartphones?",
            zh: "你觉得现在的人们是否过度依赖智能手机了？"
          },
          {
            en: "What kind of technology would you like to buy if money wasn't an issue?",
            zh: "如果预算不是问题，你最想购买什么样的科技产品？"
          }
        ]
      },
      sampleHints: {
        vocab: [
          { term: 'indispensable tool', meaning: '不可或缺的工具', example: 'Productivity apps have become an indispensable tool in my daily routine.' },
          { term: 'streamline my workflow', meaning: '简化/优化工作流', example: 'AI assistants really help streamline my workflow when drafting outlines.' },
          { term: 'digital detox', meaning: '数字排毒（暂时远离电子屏幕）', example: 'Every weekend I try to do a mini digital detox to clear my head.' }
        ],
        angles: [
          '举例说明某个具体 App 如何帮你节省时间或提升效率',
          '辩证看待手机依赖：既承认便利性，也提及碎片化注意力的问题'
        ],
        starters: [
          "Without a doubt, the app I find myself opening dozens of times a day is...",
          "I see technology as a double-edged sword; on the one hand it boosts efficiency, but on the other..."
        ]
      }
    },
    {
      id: 'p2-person-admire',
      part: 'Part 2 & 3',
      category: 'Part 2 人物类高频题卡',
      title: 'Describe a person who inspired you to do something interesting',
      tag: '高频题卡',
      cueCard: {
        topic: 'Describe a person who inspired you to do something interesting.',
        topicZh: '描述一位激励你去做某件有趣之事的人。',
        prompts: [
          'Who this person is and how you knew him/her (这个人是谁，你们是如何认识的)',
          'What interesting thing this person inspired you to do (TA激励你做了什么有趣的事)',
          'How he/she helped or motivated you (TA是如何帮助或启发你的)',
          'And explain how you felt after doing this interesting thing. (并解释做完这件事后你的感受)'
        ]
      },
      questions: {
        part2: [
          {
            en: "Here is your Part 2 topic card: 'Describe a person who inspired you to do something interesting.' You have one minute to prepare your notes, and then you'll speak for up to two minutes.",
            zh: "这是你的 Part 2 题卡：“描述一位激励你去做某件有趣之事的人”。你有 1 分钟时间准备笔记，随后请进行 1 至 2 分钟的陈述。"
          }
        ],
        part3: [
          {
            en: "Who do you think has a stronger influence on teenagers: parents, teachers, or celebrities?",
            zh: "你认为谁对青少年的影响力更大：父母、老师，还是公众人物/明星？"
          },
          {
            en: "What qualities make someone a genuinely good role model in modern society?",
            zh: "在现代社会中，具备哪些品质的人才能成为真正优秀的榜样？"
          },
          {
            en: "Do you think social media influencers have a responsibility to set a positive example for young followers?",
            zh: "你认为社交媒体博主有责任为年轻粉丝树立积极的榜样吗？"
          }
        ]
      },
      sampleHints: {
        vocab: [
          { term: 'step out of my comfort zone', meaning: '走出舒适区', example: 'She nudged me to step out of my comfort zone and try public speaking.' },
          { term: 'lead by example', meaning: '以身作则', example: 'Instead of lecturing me, my mentor always chose to lead by example.' },
          { term: 'infectious enthusiasm', meaning: '极具感染力的热情', example: 'His infectious enthusiasm for photography completely won me over.' }
        ],
        angles: [
          '起因：自己原本对某件事犹豫不决或缺乏自信',
          '转折：对方的一句话或亲身示范打消了你的顾虑，带来持久的积极改变'
        ],
        starters: [
          "The person who immediately springs to mind is my former mentor..., whom I first met...",
          "Had it not been for her constant encouragement, I probably wouldn't have had the courage to..."
        ]
      }
    },
    {
      id: 'p2-skill-learned',
      part: 'Part 2 & 3',
      category: 'Part 2 事件与经历类题卡',
      title: 'Describe a practical skill you learned that took a long time',
      tag: '当季重点',
      cueCard: {
        topic: 'Describe a practical skill you learned that took a lot of time to master.',
        topicZh: '描述一项你花了很长时间才掌握的实用技能。',
        prompts: [
          'What the skill is and why you decided to learn it (这项技能是什么，为什么决定学)',
          'Who taught you or how you learned it (谁教你的，或者你是如何学习的)',
          'Why it took a long time to master (为什么花了很长时间才掌握)',
          'And explain how useful this skill has been in your life. (并解释这项技能在你的生活中多么有用)'
        ]
      },
      questions: {
        part2: [
          {
            en: "Here is your Part 2 topic card: 'Describe a practical skill you learned that took a lot of time to master.' Take one minute to organize your thoughts, then speak for one to two minutes.",
            zh: "这是你的 Part 2 题卡：“描述一项你花了很长时间才掌握的实用技能”。请用 1 分钟整理思路，然后进行 1 到 2 分钟的陈述。"
          }
        ],
        part3: [
          {
            en: "Why do many young people nowadays prefer watching short video tutorials rather than reading manuals?",
            zh: "为什么现在的许多年轻人更喜欢看短视频教程，而不是阅读文字说明书？"
          },
          {
            en: "Should schools place more emphasis on practical life skills like cooking and financial management?",
            zh: "学校是否应该更加重视烹饪、理财等实用生活技能的教育？"
          },
          {
            en: "In the age of automation, which human skills do you think will remain irreplaceable?",
            zh: "在自动化与人工智能时代，你认为人类的哪些技能依然是不可替代的？"
          }
        ]
      },
      sampleHints: {
        vocab: [
          { term: 'trial and error', meaning: '反复试验、摸索', example: 'Mastering video editing involved months of painstaking trial and error.' },
          { term: 'muscle memory', meaning: '肌肉记忆', example: 'It took countless hours of practice before the chords became muscle memory.' },
          { term: 'sense of accomplishment', meaning: '成就感', example: 'Successfully cooking a full meal from scratch gave me an immense sense of accomplishment.' }
        ],
        angles: [
          '描述初期遇到的挫败感（比如总是出错、效率低）以及如何坚持突破瓶颈',
          '强调这项技能在当下生活或工作中带来的实际回报与心理满足'
        ],
        starters: [
          "One practical skill that genuinely tested my patience was learning how to...",
          "At first glance, it seemed straightforward, but once I dived in, I realized how much precision it required."
        ]
      }
    },
    {
      id: 'p3-environment-city',
      part: 'Part 3',
      category: 'Part 3 社会思辨专项',
      title: 'Urbanization & Green Living (城市化与环保生活)',
      tag: '高分冲刺',
      cueCard: null,
      questions: {
        part3: [
          {
            en: "What are the main environmental challenges facing megacities today?",
            zh: "当今超大城市面临的主要环境挑战有哪些？"
          },
          {
            en: "Do you think individual actions make a real difference in protecting the environment, or does it mainly depend on government policies?",
            zh: "你认为个人行动对环保能起到实质作用，还是主要取决于政府政策？"
          },
          {
            en: "How can urban planners make modern cities more livable and eco-friendly in the next decade?",
            zh: "在未来十年里，城市规划者如何才能让现代城市更加宜居和环保？"
          }
        ]
      },
      sampleHints: {
        vocab: [
          { term: 'carbon footprint', meaning: '碳足迹', example: 'Expanding public transit is key to shrinking a city’s overall carbon footprint.' },
          { term: 'sustainable urban planning', meaning: '可持续城市规划', example: 'Sustainable urban planning must prioritize green spaces over concrete sprawl.' },
          { term: 'concerted effort', meaning: '齐心协力的共同努力', example: 'Tackling climate change requires a concerted effort from both citizens and policymakers.' }
        ],
        angles: [
          '采用“个人意识 + 政策激励”双管齐下的辩证结构（Band 7+ 最稳妥的 Part 3 答题逻辑）',
          '举具体例子（如垃圾分类、新能源公交补贴、城市口袋公园）支撑论点'
        ],
        starters: [
          "That's a multifaceted question. While grass-roots efforts certainly raise awareness, systemic change ultimately hinges on...",
          "Looking at most rapidly growing metropolises, the most pressing issue tends to be..."
        ]
      }
    },
    {
      id: 'uk-2025-10-lives-alone',
      part: 'Full Mock',
      category: '考生回忆',
      title: '2025年10月英国场：工作、假期、朋友 + 独自生活的人',
      tag: '考生回忆',
      cueCard: {
        topic: 'Describe someone you know who lives alone.',
        topicZh: '描述一个你认识的独自生活的人。',
        prompts: [
          'Who this person is (这个人是谁)',
          'Where they live (他们住在哪里)',
          'Why they live alone (为什么独自生活)',
          'And explain how they feel about living alone. (并说明他们对独自生活的感受)'
        ]
      },
      questions: {
        part1: [
          { en: "Do you work or are you a student?", zh: "你是在工作，还是学生？" },
          { en: "What do you do to improve your performance at work?", zh: "你会做些什么来提高工作表现？" },
          { en: "How many hours do you usually work each week?", zh: "你通常每周工作多少小时？" },
          { en: "If you could change one thing about your job, what would it be?", zh: "如果能改工作里的一件事，你会改什么？" },
          { en: "What is your favourite day of the week, and why?", zh: "你一周里最喜欢哪一天？为什么？" },
          { en: "Do your holidays always follow a similar routine?", zh: "你的假期是不是总是差不多的安排？" },
          { en: "Why do you think friendships are important?", zh: "你为什么觉得友谊重要？" },
          { en: "How often do you meet your friends?", zh: "你多久见一次朋友？" }
        ],
        part2: [
          { en: "Now I'm going to give you a topic, and I'd like you to talk about it for one to two minutes. You have one minute to prepare. Here is your topic card: 'Describe someone you know who lives alone.'", zh: "现在给你一个话题，请说一到两分钟。你有一分钟准备。题卡是：描述一个你认识的独自生活的人。" }
        ],
        part3: [
          { en: "Why do you think more young people today prefer living on their own?", zh: "你为什么觉得现在更多年轻人愿意一个人住？" },
          { en: "What kind of skills are important for people who live alone?", zh: "独自生活的人需要哪些重要的能力？" },
          { en: "How does living alone in one's hometown differ from living alone in another city?", zh: "在家乡独自生活，和在另一座城市独自生活，有什么不同？" },
          { en: "Do you think living alone can make people more responsible?", zh: "你觉得独自生活会让人更有责任感吗？" },
          { en: "What challenges do people face when they live by themselves?", zh: "一个人生活会遇到哪些困难？" },
          { en: "How do cultural values influence people's decisions about living alone?", zh: "文化观念会怎样影响人们是否选择独自生活？" }
        ]
      },
      sampleHints: {
        vocab: [
          { term: 'live on my own', meaning: '独自生活', example: 'My aunt has lived on her own since she moved to the city.' },
          { term: 'a sense of independence', meaning: '独立感', example: 'Living alone gave her a strong sense of independence.' }
        ],
        angles: ['先说这个人是谁、住在哪，再讲一件能看出他们感受的小事。'],
        starters: ["The person who comes to mind is my...", "What stands out about their life alone is..."]
      }
    },
    {
      id: 'p2-actor-admire',
      part: 'Part 2 & 3',
      category: '考生回忆',
      title: '考生回忆：你欣赏的演员',
      tag: '考生回忆',
      cueCard: {
        topic: 'Describe an actor or actress you admire.',
        topicZh: '描述一个你欣赏的演员。',
        prompts: [
          'Who the person is (这个人是谁)',
          'What kind of roles they usually play (他们通常演什么角色)',
          'Why you admire them (你为什么欣赏他们)',
          'And explain how they have impressed you. (并说明他们如何给你留下印象)'
        ]
      },
      questions: {
        part1: [
          { en: "Do you like watching films?", zh: "你喜欢看电影吗？" },
          { en: "What kind of films do you enjoy most?", zh: "你最喜欢哪一类电影？" },
          { en: "Do you prefer watching films at home or at the cinema?", zh: "你更喜欢在家看，还是去电影院？" }
        ],
        part2: [
          { en: "Here is your topic card: 'Describe an actor or actress you admire.' You have one minute to prepare, then please speak for one to two minutes.", zh: "题卡是：描述一个你欣赏的演员。请准备一分钟，然后说一到两分钟。" }
        ],
        part3: [
          { en: "What makes a performance convincing to an audience?", zh: "怎样的表演会让观众觉得真实？" },
          { en: "Do you think actors should be responsible for the influence they have on young people?", zh: "你觉得演员是否该为他们对年轻人的影响负责？" },
          { en: "How has streaming changed the way people choose what to watch?", zh: "流媒体怎样改变了人们挑选节目的方式？" }
        ]
      },
      sampleHints: {
        vocab: [
          { term: 'a convincing performance', meaning: '有说服力的表演', example: 'Her performance was convincing because it felt unforced.' }
        ],
        angles: ['不要只报名字。说一个角色，以及它为什么打动你。'],
        starters: ["An actor I genuinely admire is..."]
      }
    },
    {
      id: 'p2-creative-person',
      part: 'Part 2 & 3',
      category: '常见题卡',
      title: '常见题卡：你欣赏的有创造力的人',
      tag: '常见题卡',
      cueCard: {
        topic: 'Describe a creative person you admire, such as an artist, a musician or an architect.',
        topicZh: '描述一个你欣赏的有创造力的人，比如艺术家、音乐人或建筑师。',
        prompts: [
          'Who this person is (这个人是谁)',
          'How you know about them (你是怎么知道他们的)',
          'What creative work they do (他们做什么样的创作)',
          'And explain why you think they are creative. (并说明你为什么觉得他们有创造力)'
        ]
      },
      questions: {
        part1: [
          { en: "Do you enjoy making things with your hands?", zh: "你喜欢动手做东西吗？" },
          { en: "Did you learn art or music at school?", zh: "你在学校学过美术或音乐吗？" }
        ],
        part2: [
          { en: "Here is your topic card: 'Describe a creative person you admire.' Please take one minute to prepare, then speak for up to two minutes.", zh: "题卡是：描述一个你欣赏的有创造力的人。请准备一分钟，然后最多说两分钟。" }
        ],
        part3: [
          { en: "Can creativity be taught, or is it something people are born with?", zh: "创造力是可以教的，还是天生的？" },
          { en: "Do schools give children enough chance to be creative?", zh: "学校给孩子的创作机会够不够？" },
          { en: "Why do some creative jobs become more valued as technology develops?", zh: "为什么技术发展以后，有些创造性的工作反而更受重视？" }
        ]
      },
      sampleHints: {
        vocab: [
          { term: 'think outside the box', meaning: '不按常规想', example: 'She thinks outside the box when a design looks too ordinary.' }
        ],
        angles: ['用一件具体作品说明创造力，不要只说他们很有才。'],
        starters: ["The creative person I'd like to talk about is..."]
      }
    },
    {
      id: 'p2-secondhand-app',
      part: 'Part 2 & 3',
      category: '考生回忆',
      title: '考生回忆：买二手或回收物品的网站',
      tag: '考生回忆',
      cueCard: {
        topic: 'Describe a website or an app that you use to buy second-hand or recycled things.',
        topicZh: '描述一个你用来买二手或回收物品的网站或应用。',
        prompts: [
          'What the website or app is (它是什么)',
          'How you knew about it (你是怎么知道它的)',
          'What kind of items are sold on it (上面卖什么)',
          'And explain why you use it. (并说明你为什么用它)'
        ]
      },
      questions: {
        part1: [
          { en: "Do you often shop online?", zh: "你经常网购吗？" },
          { en: "What was the last thing you bought online?", zh: "你上次在网上买了什么？" },
          { en: "Do you compare prices before you buy something?", zh: "买东西之前你会比价吗？" }
        ],
        part2: [
          { en: "Here is your topic card: 'Describe a website or an app that you use to buy second-hand or recycled things.' You have one minute to prepare.", zh: "题卡是：描述一个你用来买二手或回收物品的网站或应用。你有一分钟准备。" }
        ],
        part3: [
          { en: "Why are more people willing to buy second-hand goods now?", zh: "为什么现在更多人愿意买二手东西？" },
          { en: "What risks are there in buying used items online?", zh: "在网上买二手物品有什么风险？" },
          { en: "Should governments do more to encourage recycling and reuse?", zh: "政府是否应该更推动回收和再利用？" }
        ]
      },
      sampleHints: {
        vocab: [
          { term: 'a bargain', meaning: '划算的东西', example: 'I found a bargain on a second-hand bookshelf.' },
          { term: 'give something a second life', meaning: '让东西再被使用', example: 'Buying used clothes gives them a second life.' }
        ],
        angles: ['说一次真实下单：你买了什么，为什么比买新的更合适。'],
        starters: ["The app I keep going back to is..."]
      }
    },
    {
      id: 'p2-quiet-place',
      part: 'Part 2 & 3',
      category: '常见题卡',
      title: '常见题卡：你喜欢去的安静地方',
      tag: '常见题卡',
      cueCard: {
        topic: 'Describe a quiet place you like to go to.',
        topicZh: '描述一个你喜欢去的安静地方。',
        prompts: [
          'Where it is (它在哪里)',
          'How you found it (你是怎么找到它的)',
          'What you do there (你在那里做什么)',
          'And explain why you like it. (并说明你为什么喜欢它)'
        ]
      },
      questions: {
        part1: [
          { en: "Do you like a quiet environment when you study?", zh: "学习时你喜欢安静的环境吗？" },
          { en: "Is your home usually noisy or quiet?", zh: "你家里通常吵还是安静？" }
        ],
        part2: [
          { en: "Here is your topic card: 'Describe a quiet place you like to go to.' Please prepare for one minute, then speak for one to two minutes.", zh: "题卡是：描述一个你喜欢去的安静地方。请准备一分钟，然后说一到两分钟。" }
        ],
        part3: [
          { en: "Why is it harder to find quiet places in modern cities?", zh: "为什么现代城市里更难找到安静的地方？" },
          { en: "Do people need silence in order to concentrate?", zh: "人们是不是必须在安静中才能集中注意力？" },
          { en: "How can city design reduce noise for residents?", zh: "城市规划可以怎样减少居民受到的噪音？" }
        ]
      },
      sampleHints: {
        vocab: [
          { term: 'switch off', meaning: '暂时放下杂事', example: 'That library is where I switch off after class.' }
        ],
        angles: ['描述你看见和听见的东西，再说这个地方对你有什么用。'],
        starters: ["A place I go to when I need quiet is..."]
      }
    },
    {
      id: 'p2-long-friendship',
      part: 'Part 2 & 3',
      category: '常见题卡',
      title: '常见题卡：认识很久的朋友',
      tag: '常见题卡',
      cueCard: {
        topic: 'Describe a friend you have known for a long time.',
        topicZh: '描述一个你认识很久的朋友。',
        prompts: [
          'How you met (你们怎么认识的)',
          'How long you have known each other (认识了多久)',
          'What you do together (你们一起做什么)',
          'And explain why this friendship has lasted. (并说明这段友谊为什么能持续)'
        ]
      },
      questions: {
        part1: [
          { en: "Do you have a lot of friends, or a few close ones?", zh: "你是朋友很多，还是只有几个亲近的？" },
          { en: "How do you usually keep in touch with friends?", zh: "你通常怎么和朋友保持联系？" }
        ],
        part2: [
          { en: "Here is your topic card: 'Describe a friend you have known for a long time.' Take one minute to prepare, then speak for up to two minutes.", zh: "题卡是：描述一个你认识很久的朋友。准备一分钟，然后最多说两分钟。" }
        ],
        part3: [
          { en: "Is it easier to make friends as a child than as an adult?", zh: "小时候交朋友是不是比成年后更容易？" },
          { en: "What can cause a long friendship to fade?", zh: "什么会让一段长久的友谊变淡？" },
          { en: "Do social media friendships count as real friendships?", zh: "社交媒体上的朋友算不算真正的朋友？" }
        ]
      },
      sampleHints: {
        vocab: [
          { term: 'hit it off', meaning: '一见如故', example: 'We hit it off on the first day of school.' }
        ],
        angles: ['用一次你们一起度过的具体事情，说明为什么还保持联系。'],
        starters: ["I've known this friend since..."]
      }
    },
    {
      id: 'p2-park',
      part: 'Part 2 & 3',
      category: '常见题卡',
      title: '常见题卡：你喜欢的公园或花园',
      tag: '常见题卡',
      cueCard: {
        topic: 'Describe a park or garden you enjoy visiting.',
        topicZh: '描述一个你喜欢去的公园或花园。',
        prompts: [
          'Where it is (它在哪里)',
          'What it looks like (它是什么样的)',
          'Who you go there with (你和谁一起去)',
          'And explain why you enjoy it. (并说明你为什么喜欢它)'
        ]
      },
      questions: {
        part1: [
          { en: "Are there many parks near where you live?", zh: "你住的地方附近公园多吗？" },
          { en: "How often do you spend time outdoors?", zh: "你多久到户外待一会儿？" }
        ],
        part2: [
          { en: "Here is your topic card: 'Describe a park or garden you enjoy visiting.' You have one minute to think about what you are going to say.", zh: "题卡是：描述一个你喜欢去的公园或花园。你有一分钟想一想要说什么。" }
        ],
        part3: [
          { en: "Why do cities need public parks?", zh: "城市为什么需要公园？" },
          { en: "Should parks charge an entrance fee?", zh: "公园应该收门票吗？" },
          { en: "How can green spaces affect people's health?", zh: "绿地会怎样影响人的健康？" }
        ]
      },
      sampleHints: {
        vocab: [
          { term: 'a breath of fresh air', meaning: '透一口气，换个环境', example: 'A walk in the park is a breath of fresh air after work.' }
        ],
        angles: ['说你在那里看到的人在做什么，不只描述树和花。'],
        starters: ["The park I enjoy most is..."]
      }
    },
    {
      id: 'p2-famous-person',
      part: 'Part 2 & 3',
      category: '常见题卡',
      title: '常见题卡：你想见到的名人',
      tag: '常见题卡',
      cueCard: {
        topic: 'Describe a famous person you would like to meet.',
        topicZh: '描述一个你想见的名人。',
        prompts: [
          'Who this person is (这个人是谁)',
          'What they are famous for (他们因什么出名)',
          'What you would ask them (你会问他们什么)',
          'And explain why you would like to meet them. (并说明你为什么想见他们)'
        ]
      },
      questions: {
        part1: [
          { en: "Are you interested in famous people?", zh: "你关注名人吗？" },
          { en: "Do you follow any public figures on social media?", zh: "你在社交媒体上关注公众人物吗？" }
        ],
        part2: [
          { en: "Here is your topic card: 'Describe a famous person you would like to meet.' Prepare for one minute, then speak for one to two minutes.", zh: "题卡是：描述一个你想见的名人。准备一分钟，然后说一到两分钟。" }
        ],
        part3: [
          { en: "Why are people so interested in the private lives of celebrities?", zh: "为什么人们对名人的私生活这么感兴趣？" },
          { en: "Is fame a fair reward for talent?", zh: "名声是对才能的公平回报吗？" },
          { en: "What problems can sudden fame create?", zh: "突然成名会带来什么问题？" }
        ]
      },
      sampleHints: {
        vocab: [
          { term: 'look up to someone', meaning: '敬佩某人', example: 'I look up to her because of the way she talks about her work.' }
        ],
        angles: ['说你会问的一个具体问题，比罗列成就更像在聊天。'],
        starters: ["If I could meet one famous person, it would be..."]
      }
    }
  ],

  // Casual Conversation Partner Scenarios
  casualScenarios: [
    {
      id: 'casual-free',
      part: 'Free Talk',
      category: '无拘束日常畅聊',
      title: 'Catching Up with a Friend (好友日常寒暄)',
      tag: '零压力开口',
      cueCard: null,
      openingPrompt: "Hey! It's so great to hang out. How has your week been treating you? Tell me about anything interesting you've watched, eaten, or done recently!",
      openingPromptZh: "嗨！能一起出来聚聚太棒了。这周过得怎么样？快跟我说说你最近看了什么好剧、吃了什么美食，或者做了什么有趣的事！",
      sampleHints: {
        vocab: [
          { term: 'recharge my batteries', meaning: '给自己充电/休息放松', example: 'I spent the whole Sunday binge-watching shows just to recharge my batteries.' },
          { term: 'snowed under with work', meaning: '忙得不可开交', example: 'Honestly, I’ve been completely snowed under with deadlines all week.' },
          { term: 'grab a bite', meaning: '随便吃点东西', example: 'Me and a couple of friends went out to grab a bite at a new Thai place.' }
        ],
        angles: [
          '聊聊这周让你开心的一件小事（比如喝到好喝的咖啡、看了一部剧）',
          '吐槽一下最近学业或工作上的小忙碌，并顺便反问对方最近怎么样'
        ],
        starters: [
          "Honestly, it's been a pretty hectic week, so I'm really glad to finally unwind a bit!",
          "Oh, you won't believe what I tried over the weekend—I actually went to..."
        ]
      }
    },
    {
      id: 'casual-coffee',
      part: 'Roleplay',
      category: '生活社交场景',
      title: 'Coffee Shop & Weekend Plans (咖啡馆偶遇聊周末计划)',
      tag: '地道习语练习',
      cueCard: null,
      openingPrompt: "Morning! This coffee line is taking forever, isn't it? What's your go-to coffee order, and do you have any fun plans lined up for the weekend?",
      openingPromptZh: "早啊！这家咖啡店排队也太久了吧？你平时最常点什么咖啡？周末有什么好玩的安排吗？",
      sampleHints: {
        vocab: [
          { term: 'my go-to order', meaning: '我最常点的单品', example: 'An iced oat latte is definitely my go-to order, rain or shine.' },
          { term: 'play it by ear', meaning: '见机行事、随性安排', example: 'I don’t have concrete plans yet—I’ll probably just play it by ear.' },
          { term: 'sleep in', meaning: '睡懒觉', example: 'First things first, I’m definitely going to sleep in on Saturday morning.' }
        ],
        angles: [
          '分享你最爱的咖啡/茶饮口味，或者为什么需要咖啡因续命',
          '聊聊周末是打算宅家休息（low-key weekend）还是出门探索'
        ],
        starters: [
          "Tell me about it! I desperately need my morning caffeine fix—I usually go for...",
          "As for the weekend, I'm keeping things pretty low-key, maybe just..."
        ]
      }
    },
    {
      id: 'casual-movies',
      part: 'Discussion',
      category: '兴趣与文化闲聊',
      title: 'Movies, Music & Pop Culture (电影、音乐与流行文化)',
      tag: '高频生活表达',
      cueCard: null,
      openingPrompt: "I'm desperately looking for something new to watch or listen to tonight! What's the best movie, series, or album you've gotten into lately?",
      openingPromptZh: "我今晚急需找点新剧或新歌来打发时间！你最近迷上的最棒的电影、剧集或专辑是什么？",
      sampleHints: {
        vocab: [
          { term: 'binge-watch', meaning: '一口气刷完（剧集）', example: 'I literally binge-watched the entire season in two nights.' },
          { term: 'plot twist', meaning: '剧情反转', example: 'The plot twist in the final episode caught me completely off guard.' },
          { term: 'live up to the hype', meaning: '名副其实、不负盛名', example: 'Everyone was raving about that movie, and it totally lived up to the hype.' }
        ],
        angles: [
          '推荐一部你最近看过的电影/剧集，简单说说为什么吸引你（不用剧透）',
          '或者聊聊你平时喜欢什么流派的音乐/播客来放松心情'
        ],
        starters: [
          "Ooh, if you're into suspense or sci-fi, you seriously have to check out...",
          "Lately I've been totally obsessed with this show called..., mainly because..."
        ]
      }
    },
    {
      id: 'casual-career-life',
      part: 'Deep Chat',
      category: '海外校园与职场社交',
      title: 'Campus & Workplace Small Talk (留学/外企茶水间闲聊)',
      tag: '实用社交口语',
      cueCard: null,
      openingPrompt: "Hey! Taking a quick break from the screen? How is your current project or semester coming along? Feel like we've all been working non-stop lately!",
      openingPromptZh: "嗨！也出来离开屏幕喘口气呀？你最近的项目或这学期进展得怎么样？感觉大家最近都忙得连轴转！",
      sampleHints: {
        vocab: [
          { term: 'wrap up', meaning: '收尾、完成', example: 'We are finally wrapping up the first phase of the project this Friday.' },
          { term: 'on the same page', meaning: '达成共识、步调一致', example: 'It took a couple of meetings to get the whole team on the same page.' },
          { term: 'burn the midnight oil', meaning: '熬夜加班/苦读', example: 'I had to burn the midnight oil yesterday to finish my presentation slides.' }
        ],
        angles: [
          '自然回应对方关于近况的关心，分享最近刚忙完或正在推进的一件事',
          '用轻松幽默的语气聊聊如何缓解久坐或高强度工作的疲劳'
        ],
        starters: [
          "Yeah, my eyes were starting to glaze over, so I needed a five-minute breather!",
          "Things are moving along, though we hit a small snag earlier this week with..."
        ]
      }
    }
  ]
};
