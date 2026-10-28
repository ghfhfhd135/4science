import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, Shield, AlertTriangle, RefreshCw, Trophy, 
  HelpCircle, Play, Sparkles, BookOpen, Lock, Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';

// 4개 생태계 데이터 정의 (각 8~9종으로 최적화, 1회용 도감 힌트 내장)
const ECOSYSTEMS = [
  {
    id: 'forest',
    name: '신비로운 초록 숲',
    badge: '🌲 숲의 수호자',
    timeLimit: 180, // 3분
    bgGradient: 'from-emerald-900 via-green-950 to-teal-950',
    cardBg: 'bg-emerald-950/80 border-emerald-500/30',
    accentColor: '#10b981',
    description: '나무와 풀이 우거진 육상 생태계의 기초를 세워보세요.',
    disaster: {
      title: '🚨 인간들의 무차별 참새 포획!',
      description: '사냥꾼들이 참새를 마구 잡아 참새가 숲에서 완전히 사라졌습니다!',
      target: '참새',
      message: '참새가 멸종했습니다! 참새에만 의존하던 상위 포식자는 굶어 죽을 위기에 처합니다.'
    },
    organisms: [
      { id: 'f1', name: '참나무/도토리', role: 'producer', emoji: '🌳', eats: [], desc: '햇빛을 받아 양분을 만드는 식물' },
      { id: 'f2', name: '야생풀', role: 'producer', emoji: '🌿', eats: [], desc: '숲 바닥에서 자라는 흔한 풀' },
      { id: 'f3', name: '메뚜기', role: 'primary', emoji: '🦗', eats: ['야생풀'], desc: '풀잎을 갉아먹는 곤충' },
      { id: 'f4', name: '다람쥐', role: 'primary', emoji: '🐿️', eats: ['참나무/도토리'], desc: '도토리와 열매를 모으는 작은 동물' },
      { id: 'f5', name: '참새', role: 'secondary', emoji: '🐦', eats: ['메뚜기'], desc: '작은 곤충을 잡아먹는 새' },
      { id: 'f6', name: '개구리', role: 'secondary', emoji: '🐸', eats: ['메뚜기'], desc: '긴 혀로 곤충을 사냥하는 양서류' },
      { id: 'f7', name: '뱀', role: 'secondary', emoji: '🐍', eats: ['개구리', '참새', '다람쥐'], desc: '작은 동물이나 새를 통째로 삼킴' },
      { id: 'f8', name: '매', role: 'top', emoji: '🦅', eats: ['뱀', '참새', '다람쥐'], desc: '숲 최고의 공중 포식자' }
    ]
  },
  {
    id: 'river',
    name: '맑은 여울 강',
    badge: '🏞️ 강의 수호자',
    timeLimit: 150, // 2분 30초
    bgGradient: 'from-cyan-950 via-sky-950 to-blue-950',
    cardBg: 'bg-cyan-950/80 border-cyan-500/30',
    accentColor: '#06b6d4',
    description: '물속과 물가를 잇는 복잡한 수생 생태계를 지켜내세요.',
    disaster: {
      title: '🚨 공장 폐수 유출 사건!',
      description: '하천에 유독 폐수가 흘러들어 물밑의 다슬기가 떼죽음을 당했습니다!',
      target: '다슬기',
      message: '하천의 청소부 다슬기가 전멸했습니다! 강 생태계의 먹이그물이 시험대에 오릅니다.'
    },
    organisms: [
      { id: 'r1', name: '물풀(검정말)', role: 'producer', emoji: '🌱', eats: [], desc: '물속에서 광합성하는 식물' },
      { id: 'r2', name: '녹조류/이끼', role: 'producer', emoji: '🦠', eats: [], desc: '바위에 끼는 미세 조류' },
      { id: 'r3', name: '물벼룩', role: 'primary', emoji: '🦐', eats: ['녹조류/이끼'], desc: '물속을 헤엄치며 조류를 먹는 플랑크톤' },
      { id: 'r4', name: '다슬기', role: 'primary', emoji: '🐚', eats: ['녹조류/이끼', '물풀(검정말)'], desc: '돌에 붙은 이끼와 유기물을 갉아먹음' },
      { id: 'r5', name: '피라미', role: 'secondary', emoji: '🐟', eats: ['물벼룩', '다슬기'], desc: '물벼룩이나 작은 수생 생물을 먹는 물고기' },
      { id: 'r6', name: '붕어', role: 'secondary', emoji: '🐡', eats: ['물풀(검정말)', '물벼룩', '다슬기'], desc: '물풀과 곤충을 모두 먹는 잡식성 물고기' },
      { id: 'r7', name: '메기', role: 'secondary', emoji: '🦈', eats: ['피라미', '붕어'], desc: '바닥에 숨어 물고기를 사냥하는 육식어' },
      { id: 'r8', name: '수달', role: 'top', emoji: '🦦', eats: ['피라미', '붕어', '메기'], desc: '강가 먹이사슬의 최고 정점' }
    ]
  },
  {
    id: 'desert',
    name: '불타는 황금 사막',
    badge: '🏜️ 사막의 수호자',
    timeLimit: 120, // 2분
    bgGradient: 'from-amber-950 via-stone-900 to-yellow-950',
    cardBg: 'bg-amber-950/80 border-amber-500/30',
    accentColor: '#f59e0b',
    description: '물이 극도로 부족한 극한의 환경에서 얽힌 생명의 끈을 만드세요.',
    disaster: {
      title: '🚨 극심한 100년 만의 혹독한 가뭄!',
      description: '사막의 지하수마저 말라 사막 메뚜기 떼가 전멸했습니다!',
      target: '사막메뚜기',
      message: '사막 곤충이 멸종했습니다! 사막 포식자들이 다른 먹이를 찾을 수 있을까요?'
    },
    organisms: [
      { id: 'd1', name: '선인장', role: 'producer', emoji: '🌵', eats: [], desc: '줄기에 물을 저장하는 사막 식물' },
      { id: 'd2', name: '사막가시대추풀', role: 'producer', emoji: '🌾', eats: [], desc: '모래땅에 뿌리를 깊게 내린 풀' },
      { id: 'd3', name: '사막쥐(캥거루쥐)', role: 'primary', emoji: '🐁', eats: ['선인장', '사막가시대추풀'], desc: '식물의 씨앗과 즙을 먹으며 수분을 섭취' },
      { id: 'd4', name: '사막메뚜기', role: 'primary', emoji: '🦗', eats: ['사막가시대추풀'], desc: '마른 풀잎을 찾아 이동하는 곤충' },
      { id: 'd5', name: '전갈', role: 'secondary', emoji: '🦂', eats: ['사막메뚜기'], desc: '독침으로 작은 곤충을 사냥' },
      { id: 'd6', name: '도마뱀', role: 'secondary', emoji: '🦎', eats: ['사막메뚜기', '전갈'], desc: '메뚜기와 전갈을 날쌔게 낚아챔' },
      { id: 'd7', name: '사막여우', role: 'secondary', emoji: '🦊', eats: ['사막쥐(캥거루쥐)', '도마뱀'], desc: '큰 귀로 소리를 듣고 쥐와 도마뱀 사냥' },
      { id: 'd8', name: '사막독수리', role: 'top', emoji: '🦅', eats: ['뱀', '도마뱀', '사막여우', '사막쥐(캥거루쥐)'], desc: '사막 하늘을 지배하는 맹금류' }
    ]
  },
  {
    id: 'ocean',
    name: '깊고 푸른 심해 바다',
    badge: '🌊 바다의 수호자',
    timeLimit: 120, // 2분
    bgGradient: 'from-blue-950 via-indigo-950 to-slate-950',
    cardBg: 'bg-blue-950/80 border-blue-500/30',
    accentColor: '#3b82f6',
    description: '지구에서 가장 거대한 해양 생태계를 완성하는 최종 보스 맵입니다.',
    disaster: {
      title: '🚨 미세플라스틱 오염 및 무차별 남획!',
      description: '인간들이 바다를 오염시키고 작은 정어리 떼를 싹쓸이 어획했습니다!',
      target: '작은물고기(정어리)',
      message: '바다의 허리인 작은 물고기가 사라졌습니다! 바다 생태계가 버텨낼 수 있을까요?'
    },
    organisms: [
      { id: 'o1', name: '식물플랑크톤', role: 'producer', emoji: '🌿', eats: [], desc: '햇빛으로 영양분을 만드는 바다의 기초' },
      { id: 'o2', name: '해조류(다시마)', role: 'producer', emoji: '🥬', eats: [], desc: '바위에 붙어 숲을 이루는 대형 조류' },
      { id: 'o3', name: '동물플랑크톤(크릴)', role: 'primary', emoji: '🦐', eats: ['식물플랑크톤'], desc: '식물 플랑크톤을 걸러 먹는 작은 동물' },
      { id: 'o4', name: '바다성게', role: 'primary', emoji: '🦔', eats: ['해조류(다시마)'], desc: '단단한 이빨로 해조류를 갉아먹음' },
      { id: 'o5', name: '작은물고기(정어리)', role: 'secondary', emoji: '🐟', eats: ['동물플랑크톤(크릴)'], desc: '떼를 지어 다니며 크릴을 섭취' },
      { id: 'o6', name: '오징어', role: 'secondary', emoji: '🦑', eats: ['동물플랑크톤(크릴)', '작은물고기(정어리)'], desc: '촉수로 크릴과 작은 물고기를 사냥' },
      { id: 'o7', name: '참치(다랑어)', role: 'secondary', emoji: '🦈', eats: ['작은물고기(정어리)', '오징어'], desc: '빠른 속도로 헤엄쳐 큰 물고기와 오징어를 먹음' },
      { id: 'o8', name: '물개', role: 'secondary', emoji: '🦭', eats: ['작은물고기(정어리)', '오징어'], desc: '바다성게, 물고기, 오징어를 골고루 사냥' },
      { id: 'o9', name: '범고래', role: 'top', emoji: '🐋', eats: ['참치(다랑어)', '오징어', '물개'], desc: '바다 최상위 포식자' }
    ]
  }
];

export default function FoodWebGame() {
  const [unlockedStages, setUnlockedStages] = useState(['forest']);
  const [clearedStages, setClearedStages] = useState([]);
  const [currentStageId, setCurrentStageId] = useState(null); // null이면 월드맵 화면
  const [timeLeft, setTimeLeft] = useState(180);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // 게임 진행 상태
  const [selectedPrey, setSelectedPrey] = useState(null);
  const [connections, setConnections] = useState([]); // [{ from, to }]
  const [feedback, setFeedback] = useState(null); // { text, type: 'success' | 'error' | 'warning' }
  const [guideCount, setGuideCount] = useState(1); // 스테이지당 1회 힌트
  const [showGuideModal, setShowGuideModal] = useState(false);

  // 시뮬레이션 상태
  const [phase, setPhase] = useState('building'); // 'building' | 'disaster' | 'simulating' | 'result'
  const [extinctList, setExtinctList] = useState([]);
  const [starvingList, setStarvingList] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [miracleUsed, setMiracleUsed] = useState(false);

  const timerRef = useRef(null);
  const currentStage = ECOSYSTEMS.find(e => e.id === currentStageId);

  // 타이머 작동
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      clearInterval(timerRef.current);
      setIsTimerRunning(false);
      startDisaster(); // 시간 초과 시 자동 재난 시작
    }
    return () => clearInterval(timerRef.current);
  }, [isTimerRunning, timeLeft]);

  // 스테이지 입장
  const enterStage = (stageId) => {
    const stage = ECOSYSTEMS.find(e => e.id === stageId);
    setCurrentStageId(stageId);
    setTimeLeft(stage.timeLimit);
    setConnections([]);
    setSelectedPrey(null);
    setFeedback(null);
    setGuideCount(1);
    setShowGuideModal(false);
    setPhase('building');
    setExtinctList([]);
    setStarvingList([]);
    setIsSuccess(false);
    setMiracleUsed(false);
    setIsTimerRunning(true);
  };

  // 피드백 띄우기 함수
  const triggerFeedback = (text, type = 'info') => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 3500);
  };

  // 생물 클릭 처리 (먹이 사슬 연결)
  const handleOrganismClick = (org) => {
    if (phase !== 'building') return;

    if (!selectedPrey) {
      // 1. 피식자(먹히는 생물) 선택
      if (org.role === 'top') {
        triggerFeedback(`[${org.name}]은(는) 최고 포식자라서 다른 생물에게 먹히지 않아요! 먹히는 생물을 먼저 골라주세요.`, 'warning');
        return;
      }
      setSelectedPrey(org);
      triggerFeedback(`[${org.name}]을(를) 먹을 포식자 동물을 골라주세요!`, 'info');
    } else {
      // 2. 포식자(먹는 생물) 선택
      if (selectedPrey.id === org.id) {
        setSelectedPrey(null);
        triggerFeedback('선택을 취소했습니다.', 'info');
        return;
      }

      // 실제 먹이 관계 검증
      const isValidEat = org.eats && org.eats.includes(selectedPrey.name);

      if (!isValidEat) {
        // 거꾸로 연결했는지 확인
        const isReverse = selectedPrey.eats && selectedPrey.eats.includes(org.name);
        if (isReverse) {
          triggerFeedback(`앗! 거꾸로 연결했어요! [${selectedPrey.name}]이(가) [${org.name}]을(를) 먹는 관계예요!`, 'error');
        } else {
          triggerFeedback(`[${org.name}]은(는) [${selectedPrey.name}]을(를) 먹지 않아요! 실제 먹이를 생각해 보세요.`, 'error');
        }
        setSelectedPrey(null);
        return;
      }

      // 이미 연결된 선인지 확인
      const isAlready = connections.some(c => c.from === selectedPrey.id && c.to === org.id);
      if (isAlready) {
        triggerFeedback('이미 연결된 먹이사슬입니다!', 'warning');
        setSelectedPrey(null);
        return;
      }

      // 연결 성공
      setConnections(prev => [...prev, { from: selectedPrey.id, to: org.id }]);
      triggerFeedback(`연결 성공! ➔ ${selectedPrey.name}을(를) ${org.name}이(가) 먹습니다.`, 'success');
      setSelectedPrey(null);
    }
  };

  // 선 클릭 시 삭제
  const handleRemoveConnection = (fromId, toId) => {
    if (phase !== 'building') return;
    setConnections(prev => prev.filter(c => !(c.from === fromId && c.to === toId)));
    triggerFeedback('먹이 관계 연결을 끊었습니다.', 'info');
  };

  // 도감 열기 (1회 제한)
  const openGuide = () => {
    if (guideCount <= 0) {
      triggerFeedback('먹이 도감은 한 번만 열람할 수 있어 이미 잠겼습니다!', 'error');
      return;
    }
    setGuideCount(0);
    setShowGuideModal(true);
  };

  // 시련(재난) 시작
  const startDisaster = () => {
    clearInterval(timerRef.current);
    setIsTimerRunning(false);
    setSelectedPrey(null);
    setPhase('disaster');

    // 2초 후 시뮬레이션 돌입
    setTimeout(() => {
      runSimulation();
    }, 2800);
  };

  // 도미노 멸종 시뮬레이션
  const runSimulation = () => {
    setPhase('simulating');
    const targetName = currentStage.disaster.target;
    const targetOrg = currentStage.organisms.find(o => o.name === targetName);

    let deadList = [targetOrg.id];
    setExtinctList(deadList);

    // 연쇄 멸종 알고리즘
    let currentDead = new Set(deadList);
    let starved = [];
    let changed = true;

    // 반복적으로 대체 먹이가 없는 동물 탐색
    while (changed) {
      changed = false;
      for (const org of currentStage.organisms) {
        if (org.role === 'producer') continue;
        if (currentDead.has(org.id)) continue;

        // 이 생물이 먹는 것 중 현재 살아있는 먹이 선(연결) 확인
        const activeFeedLines = connections.filter(c => {
          if (c.to !== org.id) return false;
          // 먹히는 생물이 죽었는지 확인
          return !currentDead.has(c.from);
        });

        // 먹이가 0개가 되면 굶어 죽음!
        if (activeFeedLines.length === 0) {
          currentDead.add(org.id);
          starved.push(org.id);
          changed = true;
        }
      }
    }

    setStarvingList(starved);

    // 판정 (최종 소비자가 살아남았는가?)
    setTimeout(() => {
      const topOrg = currentStage.organisms.find(o => o.role === 'top');
      const isTopAlive = !currentDead.has(topOrg.id);

      setIsSuccess(isTopAlive);
      setPhase('result');

      if (isTopAlive) {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        if (!clearedStages.includes(currentStage.id)) {
          setClearedStages(prev => [...prev, currentStage.id]);
        }
        // 다음 스테이지 해금
        const currentIndex = ECOSYSTEMS.findIndex(e => e.id === currentStage.id);
        if (currentIndex < ECOSYSTEMS.length - 1) {
          const nextStageId = ECOSYSTEMS[currentIndex + 1].id;
          if (!unlockedStages.includes(nextStageId)) {
            setUnlockedStages(prev => [...prev, nextStageId]);
          }
        }
      }
    }, 2500);
  };

  // 기적의 부활 (1회 찬스)
  const useMiracle = () => {
    if (miracleUsed) return;
    setMiracleUsed(true);
    setExtinctList([]);
    setStarvingList([]);
    setPhase('building');
    setTimeLeft(45); // 45초 보너스 시간 부여
    setIsTimerRunning(true);
    triggerFeedback('✨ 창조주의 기적으로 생태계가 복구되었습니다! 45초 동안 먹이그물을 더 촘촘히 보강하세요!', 'success');
  };

  // 월드맵으로 복귀
  const returnToMap = () => {
    clearInterval(timerRef.current);
    setCurrentStageId(null);
    setPhase('building');
  };

  // ---------------- 화면 렌더링 ----------------

  // 1. 월드맵 화면
  if (!currentStageId) {
    const isGameClear = ECOSYSTEMS.every(e => clearedStages.includes(e.id));

    return (
      <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 flex flex-col items-center select-none">
        {/* 헤더 */}
        <header className="max-w-4xl w-full text-center my-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-900/50 border border-indigo-400/30 text-indigo-300 text-sm font-semibold mb-3">
            <Sparkles className="w-4 h-4" /> 4학년 2학기 과학 탐구
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-300">
            위대한 창조주: 생태계 마스터
          </h1>
          <p className="mt-3 text-slate-400 text-sm md:text-base max-w-xl mx-auto">
            당신은 별을 가꾸는 창조주입니다. 생물들의 먹고 먹히는 관계를 복잡하게 얽어,
            다가오는 대자연의 시련으로부터 생태계를 지켜내세요!
          </p>
        </header>

        {/* 올 클리어 축하 화면 */}
        {isGameClear && (
          <div className="max-w-xl w-full bg-gradient-to-b from-amber-500/20 to-indigo-950/80 border-2 border-amber-400/50 rounded-3xl p-6 text-center my-6 shadow-2xl backdrop-blur-md">
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto animate-bounce" />
            <h2 className="text-2xl font-bold text-amber-300 mt-2">지구의 위대한 마스터 창조주 등극!</h2>
            <p className="text-slate-300 text-sm mt-1">4개의 모든 생태계를 완벽한 먹이그물로 지켜내셨습니다.</p>
          </div>
        )}

        {/* 4개 스테이지 맵 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full my-auto py-4">
          {ECOSYSTEMS.map((stage, idx) => {
            const isUnlocked = unlockedStages.includes(stage.id);
            const isCleared = clearedStages.includes(stage.id);

            return (
              <div 
                key={stage.id}
                onClick={() => isUnlocked && enterStage(stage.id)}
                className={`relative rounded-3xl p-6 border-2 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg ${
                  isUnlocked 
                    ? 'cursor-pointer hover:scale-[1.02] border-slate-700 bg-slate-900/90 hover:border-cyan-400' 
                    : 'opacity-50 border-slate-800 bg-slate-950/40 cursor-not-allowed'
                }`}
              >
                {/* 배경 그라데이션 장식 */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stage.bgGradient} opacity-30 rounded-bl-full`} />

                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-800 text-slate-300">
                      STAGE {idx + 1}
                    </span>
                    {isCleared ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-500/30 px-3 py-1 rounded-full">
                        <Trophy className="w-3.5 h-3.5" /> 방어 완료
                      </span>
                    ) : !isUnlocked ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-900 px-3 py-1 rounded-full">
                        <Lock className="w-3.5 h-3.5" /> 잠김
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
                        도전 가능
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl md:text-2xl font-black mt-3 text-white flex items-center gap-2">
                    {stage.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {stage.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
                  <span>생물 {stage.organisms.length}종</span>
                  <span>제한시간 {Math.floor(stage.timeLimit / 60)}분 {stage.timeLimit % 60 ? stage.timeLimit % 60 + '초' : ''}</span>
                </div>
              </div>
            );
          })}
        </div>

        <footer className="text-slate-500 text-xs mt-8 pb-4">
          초등학교 4학년 과학 • 먹이그물과 생태계 보전 학습용
        </footer>
      </div>
    );
  }

  // 2. 인게임 캔버스 화면
  return (
    <div className={`min-h-screen bg-gradient-to-b ${currentStage.bgGradient} text-white flex flex-col select-none overflow-hidden relative`}>
      
      {/* 상단 컨트롤 바 */}
      <header className="bg-slate-950/80 backdrop-blur border-b border-white/10 px-4 py-3 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <button 
            onClick={returnToMap}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-xl font-bold transition"
          >
            ← 월드맵
          </button>
          <div>
            <h2 className="text-base md:text-lg font-black flex items-center gap-2 text-white">
              {currentStage.name}
            </h2>
            <div className="text-[11px] text-slate-400">
              연결된 먹이 사슬: <b className="text-cyan-400">{connections.length}개</b>
            </div>
          </div>
        </div>

        {/* 타이머 & 먹이도감 & 창조완료 버튼 */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* 타이머 */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono font-bold text-sm ${
            timeLeft <= 30 ? 'bg-rose-950/70 border-rose-500 text-rose-400 animate-pulse' : 'bg-slate-900 border-slate-700 text-slate-200'
          }`}>
            ⏰ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>

          {/* 1회용 먹이 도감 힌트 */}
          <button
            onClick={openGuide}
            disabled={guideCount <= 0 || phase !== 'building'}
            className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl border transition ${
              guideCount > 0 && phase === 'building'
                ? 'bg-amber-900/40 border-amber-500/50 text-amber-300 hover:bg-amber-800/50'
                : 'bg-slate-900/60 border-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            {guideCount > 0 ? (
              <>
                <BookOpen className="w-3.5 h-3.5" /> 먹이 도감 ({guideCount}/1)
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" /> 도감 잠김
              </>
            )}
          </button>

          {/* 창조 완료 (시련 즉시 시작) */}
          {phase === 'building' && (
            <button
              onClick={startDisaster}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs md:text-sm px-4 py-1.5 rounded-xl shadow-lg transition"
            >
              창조 완료 ➔
            </button>
          )}
        </div>
      </header>

      {/* 알림 피드백 배너 */}
      {feedback && (
        <div className={`absolute top-16 left-1/2 -translate-x-1/2 z-30 px-5 py-2.5 rounded-2xl shadow-2xl font-bold text-xs md:text-sm transition-all border ${
          feedback.type === 'success' ? 'bg-emerald-950/95 border-emerald-500 text-emerald-300' :
          feedback.type === 'error' ? 'bg-rose-950/95 border-rose-500 text-rose-300' :
          feedback.type === 'warning' ? 'bg-amber-950/95 border-amber-500 text-amber-300' :
          'bg-slate-900/95 border-cyan-500 text-cyan-300'
        }`}>
          {feedback.text}
        </div>
      )}

      {/* 게임 본화면 (먹이그물 캔버스) */}
      <main className="flex-1 relative overflow-hidden flex flex-col justify-between p-4 md:p-8">
        
        {/* 먹이그물 화살표 SVG 레이어 */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
            </marker>
            <marker id="arrow-broken" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#f43f5e" />
            </marker>
          </defs>

          {connections.map((c, i) => {
            const fromEl = document.getElementById(`org-${c.from}`);
            const toEl = document.getElementById(`org-${c.to}`);
            if (!fromEl || !toEl) return null;

            const fromRect = fromEl.getBoundingClientRect();
            const toRect = toEl.getBoundingClientRect();

            // 부모 컨테이너 기준 상대 좌표
            const x1 = fromRect.left + fromRect.width / 2;
            const y1 = fromRect.top + fromRect.height / 2;
            const x2 = toRect.left + toRect.width / 2;
            const y2 = toRect.top + toRect.height / 2;

            const isBroken = extinctList.includes(c.from) || extinctList.includes(c.to);

            return (
              <g key={i} className="pointer-events-auto cursor-pointer" onClick={() => handleRemoveConnection(c.from, c.to)}>
                {/* 터치하기 편한 투명 선 */}
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="transparent" strokeWidth="24" />
                {/* 실제 시각화 선 */}
                <line 
                  x1={x1} y1={y1} x2={x2} y2={y2} 
                  stroke={isBroken ? '#f43f5e' : '#38bdf8'} 
                  strokeWidth="3" 
                  strokeDasharray={isBroken ? '6 6' : 'none'}
                  markerEnd={isBroken ? 'url(#arrow-broken)' : 'url(#arrow)'}
                  className="transition-all hover:stroke-rose-400"
                />
              </g>
            );
          })}
        </svg>

        {/* 생물 3단계 레이어 배치 (상: 최종소비자 / 중: 2차소비자 / 하: 1차소비자 및 생산자) */}
        <div className="relative z-10 flex flex-col justify-between h-full gap-4 max-w-5xl mx-auto w-full">
          
          {/* 1. 최상위 소비자 층 */}
          <div className="flex justify-center items-center gap-6 md:gap-12 pt-2">
            {currentStage.organisms.filter(o => o.role === 'top').map(org => renderOrganismCard(org))}
          </div>

          {/* 2. 중간 소비자 층 */}
          <div className="flex justify-center items-center flex-wrap gap-4 md:gap-10 py-4">
            {currentStage.organisms.filter(o => o.role === 'secondary').map(org => renderOrganismCard(org))}
          </div>

          {/* 3. 1차 소비자 및 생산자 층 */}
          <div className="flex justify-center items-center flex-wrap gap-4 md:gap-8 pb-4">
            {currentStage.organisms.filter(o => o.role === 'primary' || o.role === 'producer').map(org => renderOrganismCard(org))}
          </div>

        </div>

      </main>

      {/* 안내 문구 하단 바 */}
      {phase === 'building' && (
        <div className="bg-slate-950/60 border-t border-white/5 py-2 px-4 text-center text-xs text-slate-400 z-10">
          💡 <b>연결 방법:</b> 먹히는 생물(피식자)을 먼저 누르고, 그 생물을 먹는 동물(포식자)을 눌러 선을 잇습니다. 잘못 그은 선은 클릭하면 지워집니다.
        </div>
      )}

      {/* ---------------- 모달 1. 먹이 도감 (1회 제한) ---------------- */}
      {showGuideModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-amber-300 flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> {currentStage.name} 먹이 도감
              </h3>
              <span className="text-xs text-rose-400 font-bold">⚠️ 닫으면 다시 열 수 없습니다!</span>
            </div>

            <div className="overflow-y-auto my-4 space-y-2.5 pr-1">
              {currentStage.organisms.map(org => (
                <div key={org.id} className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-start gap-3">
                  <span className="text-3xl p-1 bg-slate-900 rounded-xl">{org.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{org.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                        {org.role === 'producer' ? '생산자' : org.role === 'primary' ? '1차 소비자' : org.role === 'secondary' ? '2차 소비자' : '최종 소비자'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{org.desc}</p>
                    {org.eats && org.eats.length > 0 && (
                      <p className="text-xs text-cyan-300 font-semibold mt-1">
                        🍽️ 먹는 것: {org.eats.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 font-black rounded-2xl text-white text-sm transition"
            >
              도감 확인 완료 (닫기)
            </button>
          </div>
        </div>
      )}

      {/* ---------------- 모달 2. 재난 발생 컷씬 ---------------- */}
      {phase === 'disaster' && (
        <div className="fixed inset-0 bg-red-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-red-500 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl animate-bounce">
            <AlertTriangle className="w-16 h-16 text-rose-500 mx-auto" />
            <h2 className="text-2xl font-black text-rose-400 mt-3">{currentStage.disaster.title}</h2>
            <p className="text-sm text-slate-300 mt-3 leading-relaxed">
              {currentStage.disaster.description}
            </p>
            <div className="mt-5 p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs font-bold">
              {currentStage.disaster.message}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 모달 3. 시뮬레이션 결과 판정 ---------------- */}
      {phase === 'result' && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
            {isSuccess ? (
              <>
                <Trophy className="w-20 h-20 text-yellow-400 mx-auto animate-bounce" />
                <h2 className="text-2xl font-black text-emerald-400 mt-3">생태계 방어 대성공!</h2>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                  일부 생물이 멸종했지만, 당신이 연결해 둔 <b>대체 먹이(다양한 먹이사슬)</b> 덕분에 최고 포식자가 굶지 않고 생태계의 균형이 유지되었습니다!
                </p>
                <button
                  onClick={returnToMap}
                  className="mt-6 w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 font-black rounded-2xl text-white shadow-lg transition"
                >
                  월드맵으로 돌아가기
                </button>
              </>
            ) : (
              <>
                <AlertTriangle className="w-20 h-20 text-rose-500 mx-auto animate-pulse" />
                <h2 className="text-2xl font-black text-rose-400 mt-3">생태계 붕괴.. 미션 실패!</h2>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                  재난으로 인해 먹이가 끊긴 포식자들이 연쇄적으로 굶어 죽어, 결국 최종 포식자까지 멸종하고 말았습니다.
                </p>

                {/* 1회 부활 찬스 */}
                {!miracleUsed ? (
                  <button
                    onClick={useMiracle}
                    className="mt-5 w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-600 hover:brightness-110 font-black rounded-2xl text-slate-950 flex items-center justify-center gap-2 shadow-lg transition"
                  >
                    <Sparkles className="w-4 h-4" /> 창조주의 기적 (부활 + 45초 찬스)
                  </button>
                ) : (
                  <button
                    onClick={() => enterStage(currentStage.id)}
                    className="mt-5 w-full py-3.5 bg-slate-700 hover:bg-slate-600 font-black rounded-2xl text-white transition"
                  >
                    처음부터 다시 도전하기
                  </button>
                )}

                <button
                  onClick={returnToMap}
                  className="mt-2 w-full py-2.5 text-xs text-slate-400 hover:text-white transition"
                >
                  월드맵으로 나가기
                </button>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );

  // 생물 카드 렌더러
  function renderOrganismCard(org) {
    const isSelected = selectedPrey?.id === org.id;
    const isExtinct = extinctList.includes(org.id);
    const isStarved = starvingList.includes(org.id);

    // 현재 이 동물에게 연결된 먹이 개수 계산
    const foodCount = connections.filter(c => c.to === org.id).length;

    return (
      <div
        key={org.id}
        id={`org-${org.id}`}
        onClick={() => handleOrganismClick(org)}
        className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-300 cursor-pointer shadow-md min-w-[76px] md:min-w-[96px] ${
          isExtinct 
            ? 'bg-rose-950/90 border-rose-600 opacity-60 scale-90 grayscale' :
          isStarved 
            ? 'bg-amber-950/90 border-amber-600 opacity-70 animate-pulse' :
          isSelected 
            ? 'bg-cyan-900 border-cyan-400 ring-4 ring-cyan-400/40 scale-105' :
          'bg-slate-900/90 hover:bg-slate-800 border-slate-700'
        }`}
      >
        {/* 먹이 개수 뱃지 (소비자만 표시) */}
        {org.role !== 'producer' && phase === 'building' && (
          <span className={`absolute -top-2 -right-2 text-[10px] font-black px-1.5 py-0.5 rounded-full border ${
            foodCount === 0 ? 'bg-rose-950 text-rose-300 border-rose-500' :
            foodCount === 1 ? 'bg-amber-950 text-amber-300 border-amber-500' :
            'bg-emerald-950 text-emerald-300 border-emerald-500'
          }`}>
            먹이 {foodCount}
          </span>
        )}

        {/* 이모지 */}
        <span className="text-3xl md:text-4xl">{org.emoji}</span>

        {/* 이름 */}
        <span className="text-xs md:text-sm font-bold text-white mt-1 text-center whitespace-nowrap">
          {org.name}
        </span>

        {/* 상태 표시 */}
        {isExtinct && (
          <span className="text-[10px] font-black text-rose-400 mt-0.5">🚨 멸종</span>
        )}
        {isStarved && (
          <span className="text-[10px] font-black text-amber-400 mt-0.5">⚠️ 아사</span>
        )}
      </div>
    );
  }
}
