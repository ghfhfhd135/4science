// 생태계 데이터 및 생물 정보
export const ECOSYSTEMS = [
  {
    id: 'forest',
    name: '신비로운 초록 숲',
    badge: '🌲 숲의 수호자',
    timeLimit: 180,
    bgGradient: 'from-emerald-950 via-slate-950 to-teal-950',
    description: '나무와 풀이 우거진 육상 생태계의 기초를 세워보세요.',
    disaster: {
      title: '🚨 메뚜기 떼 전염병 발생!',
      description: '의문의 전염병이 숲 전체에 번져 메뚜기가 완전히 사라졌습니다!',
      target: '메뚜기',
      message: '1차 소비자인 메뚜기가 멸종했습니다! 대체 먹이가 없는 동물은 굶어 죽을 위기에 처합니다.'
    },
    organisms: [
      { id: 'f_top', name: '매', role: 'top', emoji: '🦅', eats: ['뱀', '개구리', '산토끼', '다람쥐'], desc: '하늘의 최고 포식자' },
      { id: 'f_s1', name: '개구리', role: 'secondary', emoji: '🐸', eats: ['메뚜기'], desc: '작은 곤충을 날쌔게 잡아먹음' },
      { id: 'f_s2', name: '뱀', role: 'secondary', emoji: '🐍', eats: ['개구리', '산토끼', '다람쥐'], desc: '작은 동물을 통째로 삼킴' },
      { id: 'f_p1', name: '메뚜기', role: 'primary', emoji: '🦗', eats: ['풀잎'], desc: '풀잎을 갉아먹는 곤충' },
      { id: 'f_p2', name: '산토끼', role: 'primary', emoji: '🐇', eats: ['풀잎'], desc: '풀과 어린 싹을 먹는 초식동물' },
      { id: 'f_p3', name: '다람쥐', role: 'primary', emoji: '🐿️', eats: ['도토리'], desc: '도토리와 열매를 모으는 동물' },
      { id: 'f_b1', name: '풀잎', role: 'producer', emoji: '🌿', eats: [], desc: '햇빛을 받아 자라는 야생 풀' },
      { id: 'f_b2', name: '도토리', role: 'producer', emoji: '🌰', eats: [], desc: '참나무가 맺는 영양 많은 열매' }
    ]
  },
  {
    id: 'river',
    name: '맑은 여울 강',
    badge: '🏞️ 강의 수호자',
    timeLimit: 150,
    bgGradient: 'from-cyan-950 via-slate-950 to-blue-950',
    description: '물속과 물가를 잇는 맑은 강 생태계를 완성하세요.',
    disaster: {
      title: '🚨 공장 폐수 유출 사고!',
      description: '하천에 유독 물질이 흘러들어 물밑의 다슬기가 떼죽음을 당했습니다!',
      target: '다슬기',
      message: '하천의 바닥을 청소하던 다슬기가 멸종했습니다! 강의 먹이그물이 무너질까요?'
    },
    organisms: [
      { id: 'r_top', name: '수달', role: 'top', emoji: '🦦', eats: ['메기', '피라미', '붕어'], desc: '강 생태계 최상위 포식자' },
      { id: 'r_s1', name: '피라미', role: 'secondary', emoji: '🐟', eats: ['물벼룩', '다슬기'], desc: '작은 곤충과 플랑크톤을 먹는 물고기' },
      { id: 'r_s2', name: '메기', role: 'secondary', emoji: '🦈', eats: ['피라미', '붕어'], desc: '물 밑에 숨어 다른 물고기를 사냥' },
      { id: 'r_p1', name: '물벼룩', role: 'primary', emoji: '🦐', eats: ['녹조류'], desc: '물속 조류를 걸러 먹는 플랑크톤' },
      { id: 'r_p2', name: '다슬기', role: 'primary', emoji: '🐚', eats: ['녹조류', '물풀'], desc: '돌에 낀 이끼와 부스러기를 먹음' },
      { id: 'r_p3', name: '붕어', role: 'primary', emoji: '🐡', eats: ['물풀', '물벼룩'], desc: '물풀과 벌레를 먹는 민물고기' },
      { id: 'r_b1', name: '물풀', role: 'producer', emoji: '🌱', eats: [], desc: '맑은 물속에서 광합성하는 식물' },
      { id: 'r_b2', name: '녹조류', role: 'producer', emoji: '🦠', eats: [], desc: '강가 바위에 자라는 미세 조류' }
    ]
  },
  {
    id: 'desert',
    name: '불타는 황금 사막',
    badge: '🏜️ 사막의 수호자',
    timeLimit: 120,
    bgGradient: 'from-amber-950 via-neutral-950 to-yellow-950',
    description: '가혹한 사막 환경 속에서도 끈질기게 이어지는 생명의 사슬을 만드세요.',
    disaster: {
      title: '🚨 극심한 100년 만의 모래폭풍과 가뭄!',
      description: '사막 메뚜기 무리가 모래폭풍에 휩쓸려 완전히 사라졌습니다!',
      target: '사막메뚜기',
      message: '사막 메뚜기가 멸종했습니다! 포식자들이 다른 먹이로 버텨낼 수 있을까요?'
    },
    organisms: [
      { id: 'd_top', name: '사막독수리', role: 'top', emoji: '🦅', eats: ['도마뱀', '사막여우', '캥거루쥐'], desc: '사막 하늘을 감시하는 맹금류' },
      { id: 'd_s1', name: '전갈', role: 'secondary', emoji: '🦂', eats: ['사막메뚜기'], desc: '독침으로 작은 벌레를 사냥' },
      { id: 'd_s2', name: '도마뱀', role: 'secondary', emoji: '🦎', eats: ['사막메뚜기', '전갈'], desc: '메뚜기와 전갈을 잡아먹는 파충류' },
      { id: 'd_p1', name: '사막메뚜기', role: 'primary', emoji: '🦗', eats: ['마른풀'], desc: '사막 식물을 뜯어먹는 곤충' },
      { id: 'd_p2', name: '캥거루쥐', role: 'primary', emoji: '🐁', eats: ['선인장', '마른풀'], desc: '씨앗과 줄기를 먹고 수분을 섭취' },
      { id: 'd_p3', name: '사막여우', role: 'secondary', emoji: '🦊', eats: ['캥거루쥐', '도마뱀'], desc: '큰 귀로 소리를 듣고 쥐를 사냥' },
      { id: 'd_b1', name: '선인장', role: 'producer', emoji: '🌵', eats: [], desc: '가시와 두꺼운 줄기에 물을 저장' },
      { id: 'd_b2', name: '마른풀', role: 'producer', emoji: '🌾', eats: [], desc: '뿌리를 깊게 내려 살아남는 사막 풀' }
    ]
  },
  {
    id: 'ocean',
    name: '깊고 푸른 심해 바다',
    badge: '🌊 바다의 수호자',
    timeLimit: 120,
    bgGradient: 'from-blue-950 via-slate-950 to-cyan-950',
    description: '거대한 해양 생태계를 완성하는 최종 관문입니다.',
    disaster: {
      title: '🚨 미세플라스틱 오염 및 무차별 남획!',
      description: '작은 물고기 떼가 인간들의 그물망에 걸려 바다에서 자취를 감추었습니다!',
      target: '작은물고기',
      message: '바다의 중간 다리인 작은 물고기 가 사라졌습니다! 생태계 균형을 지켜낼 수 있을까요?'
    },
    organisms: [
      { id: 'o_top', name: '범고래', role: 'top', emoji: '🐋', eats: ['참치', '물개', '오징어'], desc: '바다의 최정점 지배자' },
      { id: 'o_s1', name: '오징어', role: 'secondary', emoji: '🦑', eats: ['크릴새우', '작은물고기'], desc: '촉수로 크릴과 물고기를 낚아챔' },
      { id: 'o_s2', name: '참치', role: 'secondary', emoji: '🦈', eats: ['작은물고기', '오징어'], desc: '헤엄치며 물고기와 오징어를 사냥' },
      { id: 'o_p1', name: '크릴새우', role: 'primary', emoji: '🦐', eats: ['식물플랑크톤'], desc: '작은 식물 플랑크톤을 먹는 갑각류' },
      { id: 'o_p2', name: '작은물고기', role: 'primary', emoji: '🐟', eats: ['크릴새우'], desc: '크릴새우를 먹고 무리 지어 다니는 물고기' },
      { id: 'o_p3', name: '물개', role: 'secondary', emoji: '🦭', eats: ['작은물고기', '오징어'], desc: '물고기와 오징어를 골고루 사냥' },
      { id: 'o_b1', name: '식물플랑크톤', role: 'producer', emoji: '🌿', eats: [], desc: '바다의 영양분을 생산하는 미세 식물' },
      { id: 'o_b2', name: '해조류(다시마)', role: 'producer', emoji: '🥬', eats: [], desc: '바위에 뿌리내린 바다 숲' }
    ]
  }
];
