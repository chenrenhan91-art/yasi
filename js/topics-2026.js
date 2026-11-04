// 2026年9–12月公开考后回忆。不是雅思官方题库。中文是练习译文。
(function () {
  const bank = window.IELTS_DATA && window.IELTS_DATA.ieltsTopics;
  if (!bank) return;

  const q = (en, zh) => ({ en, zh });

  function part1(id, title, questions, term) {
    bank.push({
      id,
      part: 'Part 1',
      category: '2026年9–12月考生回忆',
      title,
      tag: '考生回忆',
      cueCard: null,
      questions: { part1: questions },
      sampleHints: {
        vocab: term ? [term] : [],
        angles: ['用一件具体的小事回答，答完可以补一个原因。'],
        starters: ['It depends, but usually...']
      }
    });
  }

  function card(id, title, topic, topicZh, prompts, part1Questions, part3, term) {
    bank.push({
      id,
      part: 'Part 2 & 3',
      category: '2026年9–12月考生回忆',
      title,
      tag: '考生回忆',
      cueCard: { topic, topicZh, prompts },
      questions: {
        part1: part1Questions,
        part2: [
          q(
            `Here is your topic card: '${topic}' You have one minute to prepare, then please speak for one to two minutes.`,
            `题卡是：${topicZh}请准备一分钟，然后说一到两分钟。`
          )
        ],
        part3
      },
      sampleHints: {
        vocab: term ? [term] : [],
        angles: ['按题卡上的几点讲一件真事。没做过的细节不要现编。'],
        starters: ["The one I'd like to talk about is..."]
      }
    });
  }

  part1('p1-2026-shoes', '2026年9–12月考生回忆：鞋子', [
    q('Do you like buying shoes? How often do you buy them?', '你喜欢买鞋吗？多久买一次？'),
    q('Have you ever bought shoes online?', '你在网上买过鞋吗？'),
    q('How much money do you usually spend on a pair of shoes?', '你一双鞋通常花多少钱？'),
    q('Which do you prefer, fashionable shoes or comfortable ones?', '你更在意好看，还是舒服？'),
    q('What is your favourite type of shoes?', '你最喜欢哪种鞋？')
  ], { term: 'break in a pair of shoes', meaning: '把新鞋穿得合脚', example: 'These boots took a week to break in.' });

  part1('p1-2026-headphones', '2026年9–12月考生回忆：耳机', [
    q('Do you use headphones?', '你用耳机吗？'),
    q('Do you find headphones comfortable to wear?', '你戴耳机觉得舒服吗？'),
    q('How often do you wear them?', '你多久戴一次？'),
    q('In what situations do you think people should not wear headphones?', '哪些场合你觉得不该戴耳机？')
  ], { term: 'tune out', meaning: '把周围的声音隔开', example: 'I put on headphones to tune out the traffic.' });

  part1('p1-2026-punctuality', '2026年9–12月考生回忆：守时', [
    q('Are you a punctual person?', '你是个守时的人吗？'),
    q('Do you think it is important to be on time?', '你觉得准时重要吗？'),
    q('How do you feel when other people are late?', '别人迟到时你是什么感觉？'),
    q('How do you remind yourself to be on time?', '你怎么提醒自己不要迟到？'),
    q('Why are some people always late?', '为什么有些人总是迟到？')
  ], { term: 'running late', meaning: '要迟到了', example: 'I hate running late for a class.' });

  part1('p1-2026-politeness', '2026年9–12月考生回忆：礼貌', [
    q('What did you do to show politeness when you were a child?', '小时候你怎么表现礼貌？'),
    q('On what occasions do you think people should be polite?', '哪些场合应该有礼貌？'),
    q('Do you think being polite is very important?', '你觉得礼貌很重要吗？'),
    q('How did you learn to be polite?', '你的礼貌是怎么学会的？')
  ], { term: 'mind your manners', meaning: '注意礼节', example: 'My parents always told me to mind my manners at the table.' });

  part1('p1-2026-tiredness', '2026年9–12月考生回忆：疲惫', [
    q('Do you often feel tired?', '你经常觉得累吗？'),
    q('When do you usually feel tired?', '你一般什么时候会累？'),
    q('When you feel tired, do you still go out with your friends?', '累的时候你还会和朋友出去吗？')
  ], { term: 'worn out', meaning: '精疲力尽', example: 'I was worn out after the night shift.' });

  part1('p1-2026-recycling', '2026年9–12月考生回忆：垃圾与回收', [
    q('Did you recycle when you were a child?', '你小时候会做回收吗？'),
    q('Is waste sorting common where you live?', '你住的地方垃圾分类常见吗？'),
    q('How do you recycle things like paper and plastic?', '纸和塑料你一般怎么回收？'),
    q('What do you do if you see rubbish on the street?', '看到街上有垃圾，你会怎么做？')
  ], { term: 'sort the rubbish', meaning: '把垃圾分类', example: 'We sort the rubbish before it goes out.' });

  part1('p1-2026-names', '2026年9–12月考生回忆：记名字', [
    q("Do you often forget people's names?", '你经常忘记别人的名字吗？'),
    q('How do you feel when someone cannot remember your name?', '别人记不住你的名字时，你是什么感觉？'),
    q("How do you remember people's names?", '你怎么记住别人的名字？')
  ], { term: 'it slipped my mind', meaning: '我一时想不起来了', example: 'His name slipped my mind the moment I saw him.' });

  part1('p1-2026-music', '2026年9–12月考生回忆：音乐', [
    q('Do you like music?', '你喜欢音乐吗？'),
    q('What kinds of music do you listen to?', '你听什么类型的音乐？'),
    q('Do you listen to music while you are doing something else?', '你做事的时候会同时听音乐吗？'),
    q('Did you have music lessons at school?', '你在学校上过音乐课吗？')
  ], { term: 'have something on in the background', meaning: '放着当背景声', example: 'I have music on in the background when I cook.' });

  part1('p1-2026-old-buildings', '2026年9–12月考生回忆：老建筑', [
    q('Have you seen old buildings in your city?', '你在自己的城市见过老建筑吗？'),
    q('Do you think cities should preserve old buildings?', '你觉得城市应该保留老建筑吗？'),
    q('Would you rather live in an old building or a modern house?', '你更想住老房子，还是新房子？'),
    q('Is there an old building you would like to see?', '有没有一座你想去看的老建筑？')
  ], { term: 'stand the test of time', meaning: '经得起时间', example: 'That hall has stood the test of time.' });

  part1('p1-2026-street-markets', '2026年9–12月考生回忆：街头市场', [
    q('Are there many street markets where you live?', '你住的地方街头市场多吗？'),
    q('When was the last time you went to one?', '你上次去是什么时候？'),
    q('Do you prefer a shopping mall or a street market?', '你更喜欢商场，还是街头市场？'),
    q('What do people usually buy at a street market?', '人们通常在街头市场买什么？')
  ], { term: 'browse the stalls', meaning: '逛摊位', example: 'I like to browse the stalls before I buy anything.' });

  part1('p1-2026-ads', '2026年9–12月考生回忆：广告', [
    q('Do you often see advertisements on your phone or computer?', '你经常在手机或电脑上看到广告吗？'),
    q('What kind of advertising do you like?', '你喜欢哪一类广告？'),
    q('Do you see a lot of advertising on trains or other transport?', '你在火车或其他交通工具上看到很多广告吗？'),
    q('Was there an advertisement that stayed in your mind when you were a child?', '小时候有没有一条广告让你一直记得？')
  ], { term: 'stick in your mind', meaning: '留在脑子里', example: 'That jingle still sticks in my mind.' });

  part1('p1-2026-growing', '2026年9–12月考生回忆：种菜和水果', [
    q('Are you interested in growing vegetables or fruit?', '你对种菜或种水果感兴趣吗？'),
    q('Is growing vegetables popular in your country?', '在你们国家，种菜常见吗？'),
    q('Do you think it is easy to grow vegetables?', '你觉得种菜容易吗？'),
    q('Should schools teach students how to grow food?', '学校应该教学生种菜吗？')
  ], { term: 'a green thumb', meaning: '擅长种花种菜', example: 'My grandmother has a green thumb.' });

  card(
    'p2-2026-smart-solution',
    '2026年9–12月考生回忆：用聪明办法解决问题的人',
    'Describe a person who solved a problem in a smart way.',
    '描述一个用聪明办法解决问题的人。',
    [
      'Who the person is (这个人是谁)',
      'What the problem was (问题是什么)',
      'How they solved it (他们怎么解决的)',
      'And explain why you thought the solution was smart. (并说明你为什么觉得这个办法聪明)'
    ],
    [
      q('Do you enjoy solving problems?', '你喜欢解决问题吗？'),
      q('Who do you ask for help when you are stuck?', '卡住的时候你会问谁？')
    ],
    [
      q('Are people born intelligent, or do they become intelligent through experience?', '聪明是天生的，还是靠经历慢慢来的？'),
      q('How do children develop problem-solving skills at school?', '孩子在学校怎样学会解决问题？'),
      q('Why are some people good at many things, while others excel at just one?', '为什么有的人样样都行，有的人只在一件事上突出？'),
      q('Why does modern society need a range of different talents?', '为什么现代社会需要各种各样的才能？')
    ],
    { term: 'a workaround', meaning: '绕开问题的办法', example: 'She found a workaround when the system crashed.' }
  );

  card(
    'p2-2026-cake',
    '2026年9–12月考生回忆：别人送的特别蛋糕',
    'Describe a special cake you received from someone else.',
    '描述一个别人送给你的特别蛋糕。',
    [
      'When it happened (什么时候)',
      'Where it happened (在哪里)',
      'Who you got the cake from (谁送给你的)',
      'And explain why the cake was special. (并说明为什么这个蛋糕特别)'
    ],
    [
      q('Do you like sweet food?', '你喜欢甜食吗？'),
      q('Do you celebrate birthdays with a cake?', '过生日时你们会准备蛋糕吗？')
    ],
    [
      q('Is there any food in your country that people eat on special occasions?', '你们国家有没有只在特殊场合吃的食物？'),
      q('Why are some people willing to spend a lot of money on a meal for a special day?', '为什么有人为了特殊日子愿意花很多钱吃饭？'),
      q('Do you think it is good to talk while eating with your family?', '和家人吃饭时聊天，你觉得好吗？'),
      q('Do people in your country cook at home as often as they used to?', '你们国家的人现在还像以前那样经常在家做饭吗？')
    ],
    { term: 'mark the occasion', meaning: '用某件事纪念这个场合', example: 'We bought a small cake to mark the occasion.' }
  );

  card(
    'p2-2026-happy-event',
    '2026年9–12月考生回忆：成功组织的快乐活动',
    'Describe a time when you organised a happy event successfully.',
    '描述一次你成功组织的快乐活动。',
    [
      'What the event was (活动是什么)',
      'How you prepared for it (你怎么准备的)',
      'Who helped you (谁帮了你)',
      'And explain why you think it was successful. (并说明你为什么觉得它成功)'
    ],
    [
      q('Do you like planning events, or do you prefer to join them?', '你喜欢张罗活动，还是更喜欢参加别人组织的？'),
      q('When was the last time you helped organise something?', '你上次帮忙张罗事情是什么时候？')
    ],
    [
      q('How can parents help children become more organised?', '父母可以怎样帮孩子变得更有条理？'),
      q('On what occasions do people need to be organised?', '哪些场合特别需要有条理？'),
      q('Does everything need to be carefully prepared?', '是不是每件事都要准备得很充分？'),
      q('Do people need help from others when they organise something?', '组织一件事时，是不是需要别人帮忙？')
    ],
    { term: 'pull something off', meaning: '把一件难办的事做成', example: 'We pulled the party off with very little money.' }
  );

  card(
    'p2-2026-cheap-day',
    '2026年9–12月考生回忆：花钱不多的特别外出',
    'Describe a special day out that did not cost much.',
    '描述一次花钱不多、却很特别的外出。',
    [
      'When it was (哪一天)',
      'Where you went (你去了哪里)',
      'How much you spent (花了多少钱)',
      'And explain how you felt about the day. (并说明你对这一天的感受)'
    ],
    [
      q('Do you often go out in your free time?', '空闲时你经常出门吗？'),
      q('Do you prefer a cheap day out or an expensive one?', '你更喜欢便宜的出门，还是花钱多的？')
    ],
    [
      q('Do people in your country like to spend their free time outside?', '你们国家的人喜欢把空闲时间花在外面吗？'),
      q('How has technology changed the way people spend their free time?', '技术怎样改变了人们打发空闲时间的方式？'),
      q('Do you think only older people have time for leisure?', '你觉得是不是只有年纪大的人才有空休闲？'),
      q('Why do people still want a holiday when travelling can be tiring?', '旅行很累，为什么人们还是想出去？')
    ],
    { term: 'on a shoestring', meaning: '花很少的钱', example: 'We spent the day out on a shoestring.' }
  );

  card(
    'p2-2026-river',
    '2026年9–12月考生回忆：重要的河或湖',
    'Describe an important river or lake in your country.',
    '描述你们国家一条重要的河，或一个重要的湖。',
    [
      'Where it is (它在哪里)',
      'How big or how long it is (它有多大或多长)',
      'What it looks like (它是什么样的)',
      'And explain why it is important. (并说明它为什么重要)'
    ],
    [
      q('Do you like being near water?', '你喜欢待在有水的地方吗？'),
      q('Is there a river or a lake near your home?', '你家附近有河或湖吗？')
    ],
    [
      q('Why are rivers and lakes important to a country?', '河流和湖泊对一个国家为什么重要？'),
      q('What water sports are popular in your country?', '你们国家流行哪些水上运动？'),
      q('Are rivers still useful for transport?', '河流现在还适合用来运输吗？'),
      q('How do rivers and lakes affect local tourism?', '河和湖怎样影响当地旅游？')
    ],
    { term: 'a lifeline', meaning: '赖以生存的命脉', example: 'The river is a lifeline for the towns along it.' }
  );

  card(
    'p2-2026-language',
    '2026年9–12月考生回忆：为学外语做过的事',
    'Describe something you did to learn another language.',
    '描述你为了学一门外语做过的一件事。',
    [
      'What language you learned (你学的是哪一门)',
      'What you did (你做了什么)',
      'How it helped you (它怎样帮到你)',
      'And explain how you felt about it. (并说明你的感受)'
    ],
    [
      q('Are you learning a foreign language at the moment?', '你现在在学外语吗？'),
      q('Do you prefer learning alone or with other people?', '你更喜欢一个人学，还是和别人一起学？')
    ],
    [
      q('What difficulties do people face when they learn a language?', '学语言时人们会遇到什么困难？'),
      q('Which is better, studying a language alone or in a group?', '一个人学语言，和小组一起学，哪个更好？'),
      q('What do you think is a useful way to learn a language?', '你觉得学语言有什么有用的方法？'),
      q('Some people say technology makes language learning unnecessary. What do you think?', '有人说有了技术就不必学语言了。你怎么看？')
    ],
    { term: 'pick up a language', meaning: '把一门语言学起来', example: 'I picked up a little of the language by watching films.' }
  );

  card(
    'p2-2026-athlete',
    '2026年9–12月考生回忆：你钦佩的运动员',
    'Describe a successful sportsperson you admire.',
    '描述一位你钦佩的成功运动员。',
    [
      'Who this person is (这个人是谁)',
      'What you know about them (你对他们了解什么)',
      'What they have achieved (他们有什么成绩)',
      'And explain why you admire them. (并说明你为什么钦佩他们)'
    ],
    [
      q('Do you play any sport?', '你做运动吗？'),
      q('Do you watch sport on television?', '你在电视上看体育比赛吗？')
    ],
    [
      q('Should students do sport at school?', '学生在学校应该上体育课吗？'),
      q('What qualities does an athlete need?', '运动员需要哪些品质？'),
      q('Is talent the most important thing in sport?', '天赋是运动里最重要的东西吗？'),
      q('Why are there so few athletes at the very top?', '为什么顶尖运动员那么少？')
    ],
    { term: 'bounce back', meaning: '受挫后恢复过来', example: 'She bounced back after a serious injury.' }
  );

  card(
    'p2-2026-waiting',
    '2026年9–12月考生回忆：等待一件特别的事',
    'Describe a time when you waited for something special to happen.',
    '描述一次你等待一件特别的事发生的经历。',
    [
      'What you waited for (你在等什么)',
      'Where you waited (你在哪里等)',
      'Why it was special (它为什么特别)',
      'And explain how you felt while you were waiting. (并说明等待时的感受)'
    ],
    [
      q('Do you mind waiting?', '你介意等待吗？'),
      q('Where do you often have to wait?', '你经常要在哪里等？')
    ],
    [
      q('On what occasions do people usually have to wait?', '人们通常在什么场合需要等？'),
      q('Who behaves better when they have to wait, children or adults?', '等待的时候，孩子和大人谁更沉得住气？'),
      q('Are people less patient now than they were in the past?', '现在的人是不是比过去更没耐心？'),
      q('Where do children learn to be patient?', '孩子的耐心是在家里学会的，还是在学校？')
    ],
    { term: 'on edge', meaning: '坐立不安', example: 'I was on edge the whole time I was waiting.' }
  );

  card(
    'p2-2026-good-service',
    '2026年9–12月考生回忆：商店里的好服务',
    'Describe a time when you received good service in a shop.',
    '描述一次你在商店受到良好服务的经历。',
    [
      'Where the shop was (商店在哪里)',
      'When you went there (你什么时候去的)',
      'What the staff did for you (店员为你做了什么)',
      'And explain how you felt about the service. (并说明你对这次服务的感受)'
    ],
    [
      q('Do you enjoy shopping?', '你喜欢购物吗？'),
      q('Do you prefer small shops or large stores?', '你更喜欢小店，还是大商场？')
    ],
    [
      q('Why are shopping malls popular in your country?', '为什么你们国家的购物中心很受欢迎？'),
      q('What are the advantages and disadvantages of small shops?', '小店有什么好处和坏处？'),
      q('How is online shopping different from shopping in a store?', '网购和在店里买有什么不同？'),
      q('Can spending by ordinary people help the economy grow?', '普通人的消费能带动经济增长吗？')
    ],
    { term: 'go the extra mile', meaning: '多做一步', example: 'The assistant went the extra mile and found the size I needed.' }
  );

  card(
    'p2-2026-city-again',
    '2026年9–12月考生回忆：还想再去的城市',
    'Describe a city you have been to and would like to visit again.',
    '描述一座你去过、还想再去的城市。',
    [
      'When you visited it (你什么时候去的)',
      'What you did there (你在那里做了什么)',
      'What the city was like (这座城市是什么样的)',
      'And explain why you would like to go back. (并说明你为什么还想再去)'
    ],
    [
      q('Do you like visiting other cities?', '你喜欢去别的城市吗？'),
      q('Which city have you visited most recently?', '你最近去过哪座城市？')
    ],
    [
      q('What is the difference between life in a city and life in the countryside?', '城市生活和乡村生活有什么不同？'),
      q('Are large cities a good place for older people?', '大城市适合老年人住吗？'),
      q('Could most of the population move into cities?', '大部分人口都搬进城市，可能吗？'),
      q('Do you think people in the countryside are friendlier than people in cities?', '你觉得乡下人比城里人更友好吗？')
    ],
    { term: 'worth a second visit', meaning: '值得再去一次', example: 'The old town is worth a second visit.' }
  );

  card(
    'p2-2026-decision',
    '2026年9–12月考生回忆：结果让你满意的决定',
    'Describe a time you made an important decision and were happy with the result.',
    '描述一次你做出重要决定、并对结果很满意的经历。',
    [
      'What the decision was (决定是什么)',
      'Why you made it (你为什么做这个决定)',
      'How easy or hard it was (做决定难不难)',
      'And explain why you were happy with the result. (并说明你为什么对结果满意)'
    ],
    [
      q('Do you make decisions quickly?', '你做决定快吗？'),
      q('Do you ask other people before you decide something important?', '重要的事你会先问别人吗？')
    ],
    [
      q('Is it better to decide quickly or slowly?', '决定做得快好，还是慢好？'),
      q('What happens if people in a group disagree about a decision?', '一组人意见不一致时会怎样？'),
      q('What small decisions do people make every day?', '人们每天会做哪些小决定？'),
      q('How can you tell an important decision from an easy one?', '怎么区分重要的决定和容易的决定？')
    ],
    { term: 'weigh something up', meaning: '把利弊想清楚', example: 'I weighed it up for a week before I decided.' }
  );

  card(
    'p2-2026-happy-person',
    '2026年9–12月考生回忆：一个快乐的人',
    'Describe a happy person you know.',
    '描述一个你认识的快乐的人。',
    [
      'Who this person is (这个人是谁)',
      'What they are like (他们是什么样的人)',
      'How they show that they are happy (他们怎样表现出快乐)',
      'And explain why you think they are a happy person. (并说明你为什么觉得他们快乐)'
    ],
    [
      q('What usually makes you happy?', '什么事情通常会让你开心？'),
      q('Do you know someone who stays cheerful most of the time?', '你认识几乎总是很开朗的人吗？')
    ],
    [
      q('When do you think people are happiest?', '你觉得人在什么时候最快乐？'),
      q('Can teachers notice when a child is unhappy?', '老师能看出来孩子不快乐吗？'),
      q('What would make a student happy at school?', '什么会让学生在学校里感到开心？'),
      q('Is doing a job you like more important than other things?', '做自己喜欢的工作，是不是比别的事更重要？')
    ],
    { term: 'light up', meaning: '露出明显的高兴', example: 'She lights up when she talks about her students.' }
  );

  card(
    'p2-2026-interview',
    '2026年9–12月考生回忆：看名人接受采访',
    'Describe a time you watched a famous person being interviewed.',
    '描述一次你看名人接受采访的经历。',
    [
      'Who the famous person was (名人是谁)',
      'What the interview was about (采访在谈什么)',
      'Where you watched it (你在哪里看的)',
      'And explain how you felt about the interview. (并说明你对这次采访的感受)'
    ],
    [
      q('Do you watch interviews on television or online?', '你在电视或网上看采访吗？'),
      q('Have you ever been interviewed yourself?', '你自己接受过采访吗？')
    ],
    [
      q('What should people wear to a job interview?', '求职面试应该穿什么？'),
      q('Why do employers use interviews?', '用人单位为什么要面试？'),
      q('Why do some people dislike being interviewed?', '为什么有人不喜欢被采访？'),
      q('What kinds of things do famous people often say in an interview?', '名人接受采访时经常说哪一类话？')
    ],
    { term: 'come across as', meaning: '给人某种印象', example: 'In the interview she came across as very calm.' }
  );

  card(
    'p2-2026-organised',
    '2026年9–12月考生回忆：做事有条理的人',
    'Describe a person you know who is very organised.',
    '描述一个你认识的、做事很有条理的人。',
    [
      'Who this person is (这个人是谁)',
      'What they do to stay organised (他们怎样保持有条理)',
      'When you have noticed this (你在什么情况下注意到的)',
      'And explain why being organised matters to them. (并说明有条理对他们为什么重要)'
    ],
    [
      q('Are you an organised person?', '你是个有条理的人吗？'),
      q('Do you make lists?', '你会列清单吗？')
    ],
    [
      q('Is it important for a manager to be well organised?', '管理者有条理重要吗？'),
      q('Should parents teach children to be organised?', '父母应该教孩子有条理吗？'),
      q('What can people do to become more organised?', '人可以做些什么让自己更有条理？'),
      q('Are organised people more likely to do well at work or in their studies?', '有条理的人是不是更容易在工作或学习上做得好？')
    ],
    { term: 'have a system', meaning: '有一套自己的做法', example: 'He has a system for every deadline.' }
  );

  card(
    'p2-2026-noisy',
    '2026年9–12月考生回忆：嘈杂的地方',
    'Describe a noisy place you have been to.',
    '描述一个你去过的嘈杂的地方。',
    [
      'Where it is (它在哪里)',
      'When you went there (你什么时候去的)',
      'What you did there (你在那里做了什么)',
      'And explain why it felt noisy. (并说明你为什么觉得那里吵)'
    ],
    [
      q('Do you mind noise?', '你介意吵吗？'),
      q('Where is the noisiest place near your home?', '你家附近最吵的地方在哪？')
    ],
    [
      q('How can people think about others when they talk in public?', '在公共场所说话时，怎样顾及别人？'),
      q('Which is noisier, the city or the countryside?', '城市和乡下，哪里更吵？'),
      q('What kinds of noise do people live with?', '生活里有哪些噪音？'),
      q('Should children be stopped from making any noise?', '是不是应该不让孩子发出任何声音？')
    ],
    { term: 'a din', meaning: '一片嘈杂', example: 'There was a din of voices in the market.' }
  );

  card(
    'p2-2026-saving',
    '2026年9–12月考生回忆：攒钱买特别的东西',
    'Describe a time when you saved money to buy something special.',
    '描述一次你攒钱买特别东西的经历。',
    [
      'What you bought (你买了什么)',
      'Why you wanted it (你为什么想要它)',
      'How you saved the money (你怎么攒的钱)',
      'And explain how you felt after you bought it. (并说明买到之后的感受)'
    ],
    [
      q('Do you save money?', '你会存钱吗？'),
      q('What was the last thing you saved up for?', '你上次攒钱是为了买什么？')
    ],
    [
      q('What do people usually save money for?', '人们通常为什么存钱？'),
      q('Is it easier to spend money or to save it?', '花钱容易，还是存钱容易？'),
      q('Should parents teach children to save, or let them spend freely?', '父母应该教孩子存钱，还是让他们随便花？'),
      q('Should schools teach children how to manage money?', '学校应该教孩子管钱吗？')
    ],
    { term: 'put money aside', meaning: '把钱留出来', example: 'I put a little money aside every month.' }
  );

  card(
    'p2-2026-child-skill',
    '2026年9–12月考生回忆：小时候学会的新技能',
    'Describe a new skill you learned when you were a child.',
    '描述一项你小时候学会的新技能。',
    [
      'What the skill was (技能是什么)',
      'Who taught you (谁教你的)',
      'How you learned it (你怎么学的)',
      'And explain how you felt about learning it. (并说明学习时的感受)'
    ],
    [
      q('Did you learn any skill outside school as a child?', '小时候你在学校以外学过什么技能吗？'),
      q('Do you still use that skill?', '那个技能你现在还用吗？')
    ],
    [
      q('Should everyone have one skill they are especially good at?', '是不是每个人都该有一项特别擅长的技能？'),
      q('Can a child learn a skill from another child?', '孩子能向别的孩子学技能吗？'),
      q('Is it easier for children to learn new skills than for adults?', '学新技能，孩子是不是比大人更容易？'),
      q('What skills should children learn before they start school?', '上学之前，孩子应该学会哪些技能？')
    ],
    { term: 'get the hang of something', meaning: '摸到门道', example: 'It took me a month to get the hang of it.' }
  );

  card(
    'p2-2026-older-admire',
    '2026年9–12月考生回忆：你钦佩的年长者',
    'Describe someone older than you whom you admire.',
    '描述一个比你年长、让你钦佩的人。',
    [
      'Who this person is (这个人是谁)',
      'How you know them (你怎么认识他们的)',
      'What you like to do together (你们喜欢一起做什么)',
      'And explain why you admire them. (并说明你为什么钦佩他们)'
    ],
    [
      q('Do you spend time with people older than you?', '你会和比你年长的人相处吗？'),
      q('Is there an older person you often talk to?', '有没有一位你经常聊天的年长者？')
    ],
    [
      q('What do older people usually do in their daily life?', '老年人的日常生活通常是怎样的？'),
      q('Why is there often a gap between younger and older people?', '年轻人和年长者之间为什么常常有隔阂？'),
      q('Has the quality of life for older people improved?', '老年人的生活质量比过去好了吗？'),
      q('What can young people and older people learn from each other?', '年轻人和年长者可以互相学到什么？')
    ],
    { term: 'look up to', meaning: '敬佩', example: 'I look up to my uncle for the way he treats people.' }
  );

  card(
    'p2-2026-evening',
    '2026年9–12月考生回忆：和朋友度过的愉快夜晚',
    'Describe an enjoyable evening you spent with friends.',
    '描述一个你和朋友一起度过的愉快夜晚。',
    [
      'When and where it was (什么时候、在哪里)',
      'What you did (你们做了什么)',
      'Who you were with (你和谁在一起)',
      'And explain why the evening was enjoyable. (并说明为什么那个晚上愉快)'
    ],
    [
      q('Do you often go out in the evening?', '你晚上经常出门吗？'),
      q('Do you prefer a quiet evening or a busy one?', '你更喜欢安静的晚上，还是热闹的？')
    ],
    [
      q('How is young people’s free time different from older people’s?', '年轻人的空闲和老年人的有什么不同？'),
      q('What can people do to bring a family closer?', '怎样能让家人更亲近？'),
      q('Is it important to talk with your family?', '和家人说话重要吗？'),
      q('Why do people need friends?', '人为什么需要朋友？')
    ],
    { term: 'lose track of time', meaning: '忘记了时间', example: 'We lost track of time talking in the kitchen.' }
  );

  card(
    'p2-2026-history-person',
    '2026年9–12月考生回忆：热爱历史的人',
    'Describe a person you know who loves history.',
    '描述一个你认识的、热爱历史的人。',
    [
      'Who this person is (这个人是谁)',
      'How they learn about history (他们怎样了解历史)',
      'Why they love it (他们为什么热爱历史)',
      'And explain how you feel about them. (并说明你对他们的看法)'
    ],
    [
      q('Did you enjoy history at school?', '你在学校喜欢历史课吗？'),
      q('Do you watch programmes about the past?', '你会看关于过去的节目吗？')
    ],
    [
      q('Besides famous events, what else matters when people learn history?', '除了大事件，学历史还有什么重要？'),
      q('Should people learn how ordinary people lived in the past?', '人们应该了解过去普通人怎么生活吗？'),
      q('At what age should children start learning history?', '孩子应该从几岁开始学历史？'),
      q('How do children learn about the past before they go to school?', '上学之前，孩子怎样了解过去？')
    ],
    { term: 'a keen interest in', meaning: '浓厚的兴趣', example: 'He has a keen interest in local history.' }
  );

  card(
    'p2-2026-group',
    '2026年9–12月考生回忆：小组合作',
    'Describe a time when you worked in a group.',
    '描述一次你参与小组合作的经历。',
    [
      'What you did (你们做了什么)',
      'Who you worked with (你和谁一起)',
      'What problems you faced (遇到了什么问题)',
      'And explain why you worked in that group. (并说明你为什么参加这次合作)'
    ],
    [
      q('Do you prefer working alone or with other people?', '你更喜欢一个人做事，还是和别人一起？'),
      q('Have you done group work at school or at work?', '你在学校或工作中做过小组任务吗？')
    ],
    [
      q('Why do some people prefer to work by themselves?', '为什么有些人更想一个人工作？'),
      q('What should a leader do so that others want to follow?', '领导者怎样做，别人才愿意跟着走？'),
      q('Should students learn to work in groups?', '学生应该学着做小组合作吗？'),
      q('What are the advantages of teamwork at school?', '在学校做团队任务有什么好处？')
    ],
    { term: 'pull your weight', meaning: '尽自己的那一份力', example: 'Everyone pulled their weight on that project.' }
  );

  card(
    'p2-2026-local-news',
    '2026年9–12月考生回忆：大家感兴趣的本地新闻',
    'Describe a piece of local news that people were interested in.',
    '描述一条大家感兴趣的本地新闻。',
    [
      'What it was about (它在讲什么)',
      'Where you saw or heard it (你在哪里看到或听到的)',
      'Who was involved (涉及哪些人)',
      'And explain why people were interested. (并说明人们为什么感兴趣)'
    ],
    [
      q('Do you follow the news?', '你看新闻吗？'),
      q('Do you pay more attention to local news or national news?', '你更关注本地新闻，还是全国新闻？')
    ],
    [
      q('Do people where you live still read newspapers?', '你住的地方还有人看报纸吗？'),
      q('Do people prefer local news or international news?', '人们更喜欢本地新闻，还是国际新闻？'),
      q('Do young people or older people care more about local news?', '年轻人和老年人，谁更关心本地新闻？'),
      q('Why do some people want to be closely involved in their community?', '为什么有些人很想参与自己的社区？')
    ],
    { term: 'word got around', meaning: '消息传开了', example: 'Word got around before the official notice came out.' }
  );

  card(
    'p2-2026-gift',
    '2026年9–12月考生回忆：想送给朋友的礼物',
    'Describe a gift you would like to buy for a friend.',
    '描述一件你想买给朋友的礼物。',
    [
      'How you know this friend (你怎么认识这位朋友的)',
      'How long you have known them (认识了多久)',
      'What gift you would choose (你会选什么礼物)',
      'And explain why you would choose it. (并说明你为什么选它)'
    ],
    [
      q('Do you enjoy giving gifts?', '你喜欢送礼物吗？'),
      q('Is it hard for you to choose a present?', '挑礼物对你来说难吗？')
    ],
    [
      q('Are there gifts that people in your country avoid giving?', '你们国家有没有不适合送的礼物？'),
      q('Do people feel happy when they receive an expensive gift?', '收到贵的礼物，人会开心吗？'),
      q('When do people usually give gifts?', '人们通常在什么时候送礼物？'),
      q('What do people think about when they buy a gift?', '买礼物时人们会考虑什么？')
    ],
    { term: 'put thought into something', meaning: '花心思', example: 'I wanted a gift that I had put some thought into.' }
  );

  card(
    'p2-2026-childhood-friend',
    '2026年9–12月考生回忆：童年时的朋友',
    'Describe a friend from your childhood.',
    '描述一位你童年时的朋友。',
    [
      'Who this person is (这个人是谁)',
      'Where and how you met (你们在哪里、怎么认识的)',
      'What you often did together (你们经常一起做什么)',
      'And explain what made you like them. (并说明你为什么喜欢他们)'
    ],
    [
      q('Do you still know anyone from your childhood?', '你现在还联系着童年的人吗？'),
      q('Where did you usually play as a child?', '小时候你通常在哪里玩？')
    ],
    [
      q('Do people stay in touch with childhood friends?', '人们还会和童年的朋友保持联系吗？'),
      q('How important is childhood friendship?', '童年的友谊有多重要？'),
      q('What is the difference between having younger friends and older friends?', '年幼的朋友和年长的朋友有什么不同？'),
      q('Has technology changed the way people keep friendships?', '技术改变了人们维持友谊的方式吗？')
    ],
    { term: 'grow up together', meaning: '一起长大', example: 'We grew up together on the same street.' }
  );

  card(
    'p2-2026-live-sport',
    '2026年9–12月考生回忆：现场看过的体育比赛',
    'Describe a live sports event you watched and enjoyed.',
    '描述一场你在现场看过、并且喜欢的体育比赛。',
    [
      'What it was (比赛是什么)',
      'When and where you watched it (你何时何地看的)',
      'Who you watched it with (你和谁一起看)',
      'And explain why you liked it. (并说明你为什么喜欢)'
    ],
    [
      q('Have you ever been to a stadium?', '你去过体育场吗？'),
      q('Do you prefer watching sport live or on a screen?', '你更喜欢现场看，还是在屏幕上看？')
    ],
    [
      q('Why do some people like watching sports events?', '为什么有些人喜欢看体育比赛？'),
      q('What are the advantages of watching sport online?', '在网上看比赛有什么好处？'),
      q('Why do some people travel to another country to watch a match?', '为什么有人会花钱去别的国家看比赛？'),
      q('How is watching in a stadium different from watching on television?', '在体育场看和在电视上看有什么主要差别？')
    ],
    { term: 'the atmosphere', meaning: '现场气氛', example: 'The atmosphere in the stadium was louder than I expected.' }
  );

  card(
    'p2-2026-handmade',
    '2026年9–12月考生回忆：擅长手工的人',
    'Describe a person who is good at making things by hand.',
    '描述一个擅长手工制作的人。',
    [
      'Who this person is (这个人是谁)',
      'What they make (他们做什么)',
      'What materials they use (他们用什么材料)',
      'And explain why you think they are good at it. (并说明你为什么觉得他们擅长)'
    ],
    [
      q('Do you like making things with your hands?', '你喜欢动手做东西吗？'),
      q('Did you do arts and crafts at school?', '你在学校做过手工吗？')
    ],
    [
      q('Do children still enjoy making things by hand?', '现在的孩子还喜欢动手做东西吗？'),
      q('Why do some children like crafts?', '为什么有些孩子喜欢手工？'),
      q('Are art classes important for children?', '美术课对孩子重要吗？'),
      q('Is it useful to have a creative person on a team?', '团队里有一个有创造力的人，有用吗？')
    ],
    { term: 'a handmade piece', meaning: '手工做的一件东西', example: 'She gave me a handmade piece instead of something from a shop.' }
  );

  card(
    'p2-2026-crowded',
    '2026年9–12月考生回忆：拥挤的地方',
    'Describe a crowded place you have visited.',
    '描述一个你去过的拥挤的地方。',
    [
      'Where it was (它在哪里)',
      'When you went there (你什么时候去的)',
      'Who you went with (你和谁一起去)',
      'And explain how you felt about it. (并说明你对这次经历的感受)'
    ],
    [
      q('Do you like crowded places?', '你喜欢人多的地方吗？'),
      q('When is your city most crowded?', '你的城市什么时候最挤？')
    ],
    [
      q('Which cities in your country are especially crowded?', '你们国家哪些城市特别挤？'),
      q('Why do people still go to crowded places?', '为什么人们还是会去人多的地方？'),
      q('Do some people actually enjoy crowds?', '有些人是不是真的喜欢拥挤？'),
      q('Will cities have more green space in the future, or less?', '将来城市的绿地会更多，还是更少？')
    ],
    { term: 'packed', meaning: '挤满了人', example: 'The station was packed when I arrived.' }
  );
})();
