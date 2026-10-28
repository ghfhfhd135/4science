import React, { useState, useEffect } from 'react';
import { 
  Play, Lock, ShieldAlert, AlertTriangle, ArrowRight, 
  ShieldCheck, Skull, Trophy, RefreshCw, Map, Sparkles, 
  Info, HelpCircle, CheckCircle2, XCircle, Award
} from 'lucide-react';

// 4학년 과학 교육과정에 맞춘 스테이지 및 실제 먹이 관계 데이터 (각 맵당 8~9종으로 구성)
const STAGES = {
  forest: {
    id: 'forest',
    name: '🌳 초보자의 숲',
    subtitle: '스테이지 1: 숲 생태계의 균형을 맞추세요 (생물 8종)',
    timeLimit: 180,
    next: 'river',
    bg: 'from-green-50 via-emerald-50 to-teal-50',
    nodeBg: 'border-emerald-500',
    mapColor: 'bg-emerald-500',
    disasterCount: 1,
    organisms: [
      { id: 'f1', name: '풀과 나무', emoji: '🌿', type: 'producer', role: '생산자', x: 32, y: 85, validPrey: [] },
      { id: 'f2', name: '도토리·열매', emoji: '🌰', type: 'producer', role: '생산자', x: 68, y: 85, validPrey: [] },
      { id: 'f3', name: '메뚜기', emoji: '🦗', type: 'consumer', role: '1차 소비자', x: 20, y: 60, validPrey: ['f1'] },
      { id: 'f4', name: '산토끼', emoji: '🐇', type: 'consumer', role: '1차 소비자', x: 50, y: 60, validPrey: ['f1', 'f2'] },
      { id: 'f5', name: '다람쥐', emoji: '🐿️', type: 'consumer', role: '1차 소비자', x: 80, y: 60, validPrey: ['f1', 'f2', 'f3'] },
      { id: 'f6', name: '개구리', emoji: '🐸', type: 'consumer', role: '중간 소비자', x: 32, y: 38, validPrey: ['f3'] },
      { id: 'f7', name: '뱀', emoji: '🐍', type: 'consumer', role: '중간 소비자', x: 68, y: 38, validPrey: ['f3', 'f4', 'f5', 'f6'] },
      { id: 'f8', name: '매', emoji: '🦅', type: 'top-consumer', role: '최종 소비자', x: 50, y: 15, validPrey: ['f4', 'f5', 'f6', 'f7'] },
    ],
    disasters: [
      "극심한 봄 가뭄과 산불로 인해 {이름}의 서식지가 파괴되어 멸종했습니다!",
      "인간들의 무분별한 포획과 서식지 개발로 {이름} 무리가 숲에서 사라졌습니다!",
      "외래종 바이러스가 퍼져 숲속의 {이름} 개체수가 급격히 사라졌습니다!"
    ]
  },
  river: {
    id: 'river',
    name: '🏞️ 생명의 강',
    subtitle: '스테이지 2: 강물 속 생태계를 촘촘히 연결하세요 (생물 8종)',
    timeLimit: 150,
    next: 'desert',
    bg: 'from-sky-50 via-cyan-50 to-blue-50',
    nodeBg: 'border-sky-500',
    mapColor: 'bg-sky-500',
    disasterCount: 1,
    organisms: [
      { id: 'r1', name: '검정말(물풀)', emoji: '🌱', type: 'producer', role: '생산자', x: 32, y: 85, validPrey: [] },
      { id: 'r2', name: '식물플랑크톤', emoji: '🦠', type: 'producer', role: '생산자', x: 68, y: 85, validPrey: [] },
      { id: 'r3', name: '다슬기', emoji: '🐌', type: 'consumer', role: '1차 소비자', x: 25, y: 60, validPrey: ['r1', 'r2'] },
      { id: 'r4', name: '민물새우', emoji: '🦐', type: 'consumer', role: '1차 소비자', x: 75, y: 60, validPrey: ['r1', 'r2'] },
      { id: 'r5', name: '붕어', emoji: '🐡', type: 'consumer', role: '중간 소비자', x: 25, y: 38, validPrey: ['r1', 'r2', 'r3', 'r4'] },
      { id: 'r6', name: '참개구리', emoji: '🐸', type: 'consumer', role: '중간 소비자', x: 75, y: 38, validPrey: ['r3', 'r4'] },
      { id: 'r7', name: '수달', emoji: '🦦', type: 'top-consumer', role: '최종 소비자', x: 35, y: 15, validPrey: ['r3', 'r4', 'r5', 'r6'] },
      { id: 'r8', name: '백로', emoji: '🦢', type: 'top-consumer', role: '최종 소비자', x: 65, y: 15, validPrey: ['r4', 'r5', 'r6'] },
    ],
    disasters: [
      "공장 폐수와 생활 하수 유입으로 수질이 오염되어 {이름} 무리가 사라졌습니다!",
      "하천 바닥 공사로 인해 {이름}의 산란지가 모두 파괴되었습니다!",
      "이상 고온 현상으로 강물의 산소가 부족해져 {이름}이(가) 떼죽음을 당했습니다!"
    ]
  },
  desert: {
    id: 'desert',
    name: '🏜️ 뜨거운 사막',
    subtitle: '스테이지 3: 척박한 사막에서 생명의 끈을 이어주세요 (생물 8종)',
    timeLimit: 120,
    next: 'ocean',
    bg: 'from-amber-50 via-orange-50 to-yellow-50',
    nodeBg: 'border-amber-500',
    mapColor: 'bg-amber-500',
    disasterCount: 1,
    organisms: [
      { id: 'd1', name: '선인장', emoji: '🌵', type: 'producer', role: '생산자', x: 32, y: 85, validPrey: [] },
      { id: 'd2', name: '사막떨기나무', emoji: '🌾', type: 'producer', role: '생산자', x: 68, y: 85, validPrey: [] },
      { id: 'd3', name: '사막딱정벌레', emoji: '🪲', type: 'consumer', role: '1차 소비자', x: 25, y: 60, validPrey: ['d1', 'd2'] },
      { id: 'd4', name: '캥거루쥐', emoji: '🐁', type: 'consumer', role: '1차 소비자', x: 75, y: 60, validPrey: ['d1', 'd2', 'd3'] },
      { id: 'd5', name: '사막도마뱀', emoji: '🦎', type: 'consumer', role: '중간 소비자', x: 25, y: 38, validPrey: ['d1', 'd3'] },
      { id: 'd6', name: '방울뱀', emoji: '🐍', type: 'consumer', role: '중간 소비자', x: 75, y: 38, validPrey: ['d4', 'd5'] },
      { id: 'd7', name: '사막여우', emoji: '🦊', type: 'top-consumer', role: '최종 소비자', x: 35, y: 15, validPrey: ['d1', 'd2', 'd3', 'd4', 'd5'] },
      { id: 'd8', name: '붉은꼬리매', emoji: '🦅', type: 'top-consumer', role: '최종 소비자', x: 65, y: 15, validPrey: ['d4', 'd5', 'd6'] },
    ],
    disasters: [
      "100년 만의 최악의 모래폭풍과 가뭄으로 {이름}이(가) 자취를 감추었습니다!",
      "사막 오아시스가 완전히 말라붙어 {이름} 무리가 생존하지 못했습니다!",
      "기후 변화로 인한 폭염으로 {이름}의 개체수가 급감하여 멸종했습니다!"
    ]
  },
  ocean: {
    id: 'ocean',
    name: '🌊 심연의 바다 (보스)',
    subtitle: '최종 스테이지: 2개의 동시 재난으로부터 바다를 지키세요! (생물 9종)',
    timeLimit: 110,
    next: 'end',
    bg: 'from-blue-50 via-indigo-50 to-slate-100',
    nodeBg: 'border-indigo-500',
    mapColor: 'bg-indigo-600',
    disasterCount: 2, // 보스 스테이지는 2마리 동시 멸종
    organisms: [
      { id: 'o1', name: '식물플랑크톤', emoji: '🦠', type: 'producer', role: '생산자', x: 32, y: 86, validPrey: [] },
      { id: 'o2', name: '미역·해조류', emoji: '🌿', type: 'producer', role: '생산자', x: 68, y: 86, validPrey: [] },
      { id: 'o3', name: '동물플랑크톤', emoji: '🔬', type: 'consumer', role: '1차 소비자', x: 25, y: 64, validPrey: ['o1'] },
      { id: 'o4', name: '크릴새우', emoji: '🦐', type: 'consumer', role: '1차 소비자', x: 75, y: 64, validPrey: ['o1', 'o2', 'o3'] },
      { id: 'o5', name: '멸치', emoji: '🐟', type: 'consumer', role: '중간 소비자', x: 20, y: 40, validPrey: ['o1', 'o3', 'o4'] },
      { id: 'o6', name: '오징어', emoji: '🦑', type: 'consumer', role: '중간 소비자', x: 50, y: 40, validPrey: ['o3', 'o4', 'o5'] },
      { id: 'o7', name: '바다거북', emoji: '🐢', type: 'consumer', role: '중간 소비자', x: 80, y: 40, validPrey: ['o2', 'o4', 'o5', 'o6'] },
      { id: 'o8', name: '백상아리', emoji: '🦈', type: 'top-consumer', role: '최종 소비자', x: 35, y: 15, validPrey: ['o5', 'o6', 'o7'] },
      { id: 'o9', name: '범고래', emoji: '🐋', type: 'top-consumer', role: '최종 소비자', x: 65, y: 15, validPrey: ['o5', 'o6', 'o7', 'o8'] },
    ],
    disasters: [
      "바다에 버려진 미세 플라스틱과 쓰레기로 인해 {이름}이(가) 크게 줄어들었습니다!",
      "무분별한 대형 그물 포획(남획)으로 바다에서 {이름} 무리가 사라졌습니다!",
      "지구 온난화로 바닷물 온도가 급상승하여 {이름}이(가) 서식지를 잃었습니다!"
    ]
  }
};

export default function FoodWebBuilder() {
  const [view, setView] = useState('title'); // title, map, game, ending
  const [creatorName, setCreatorName] = useState('');
  const [unlockedStages, setUnlockedStages] = useState(['forest']);
  const [currentStageId, setCurrentStageId] = useState('forest');

  // 게임 진행 상태
  const [gameState, setGameState] = useState('playing'); // playing, disaster, simulating, result
  const [timeLeft, setTimeLeft] = useState(180);
  const [links, setLinks] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [guideCountLeft, setGuideCountLeft] = useState(1); // 스테이지당 먹이 도감 힌트 1회 제한

  // 재난 및 시뮬레이션 상태
  const [disasterTargets, setDisasterTargets] = useState([]);
  const [disasterNews, setDisasterNews] = useState([]);
  const [extinctIds, setExtinctIds] = useState(new Set());
  const [simQueue, setSimQueue] = useState([]);
  const [miracleUsed, setMiracleUsed] = useState(false); // 창조주의 권능(부활 찬스)
  const [toast, setToast] = useState(null);
  const [showGuideModal, setShowGuideModal] = useState(false);

  const stage = STAGES[currentStageId];

  // 피드백 알림 메시지 표시
  const showToast = (msg, type = 'info') => {
    setToast({ msg, type });
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  // 스테이지 시작 초기화
  const startStage = (stageId) => {
    const targetStage = STAGES[stageId];
    setCurrentStageId(stageId);
    setTimeLeft(targetStage.timeLimit);
    setLinks([]);
    setSelectedNode(null);
    setGameState('playing');
    setExtinctIds(new Set());
    setSimQueue([]);
    setDisasterTargets([]);
    setMiracleUsed(false);
    setGuideCountLeft(1); // 스테이지 시작 시 도감 힌트 1회로 초기화
    setShowGuideModal(false);
    setView('game');
  };

  // 먹이 도감 열기 (최대 1회 제한)
  const handleOpenGuide = () => {
    if (guideCountLeft <= 0) {
      showToast('🔒 먹이 도감 힌트(1회)를 이미 사용했어요! 스스로 먹이 관계를 떠올려 보세요.', 'error');
      return;
    }
    setGuideCountLeft(prev => prev - 1);
    setShowGuideModal(true);
  };

  // 타이머 작동
  useEffect(() => {
    if (view !== 'game' || gameState !== 'playing') return;
    if (timeLeft <= 0) {
      triggerDisaster();
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, view, gameState]);

  // 생물 노드 클릭 (먹이사슬 연결)
  const handleNodeClick = (orgId) => {
    if (gameState !== 'playing') return;

    if (!selectedNode) {
      setSelectedNode(orgId);
      return;
    }

    if (selectedNode === orgId) {
      setSelectedNode(null);
      return;
    }

    const sourceOrg = stage.organisms.find(o => o.id === selectedNode);
    const targetOrg = stage.organisms.find(o => o.id === orgId);

    // 1. 생산자는 다른 생물을 먹을 수 없음
    if (targetOrg.type === 'producer') {
      showToast(`❌ [${targetOrg.name}]은(는) 스스로 양분을 만드는 생산자예요! 화살표 방향을 반대로 해보세요.`, 'error');
      setSelectedNode(null);
      return;
    }

    // 2. 이미 연결된 선이면 연결 해제
    const existingIdx = links.findIndex(l => l.source === selectedNode && l.target === orgId);
    if (existingIdx >= 0) {
      setLinks(links.filter((_, idx) => idx !== existingIdx));
      showToast(`✂️ [${sourceOrg.name} ➔ ${targetOrg.name}] 연결을 취소했습니다.`, 'info');
      setSelectedNode(null);
      return;
    }

    // 3. 반대 방향으로 이미 연결되어 있는지 확인
    const reverseIdx = links.findIndex(l => l.source === orgId && l.target === selectedNode);
    if (reverseIdx >= 0) {
      showToast(`❌ 이미 반대 방향으로 먹이 사슬이 연결되어 있어요!`, 'error');
      setSelectedNode(null);
      return;
    }

    // 4. 과학적 먹이 관계 검증 (오답 시 친절한 교육적 피드백 제공)
    if (!targetOrg.validPrey.includes(sourceOrg.id)) {
      if (sourceOrg.validPrey.includes(targetOrg.id)) {
        showToast(`💡 화살표 방향이 반대예요! [${targetOrg.name}]이(가) [${sourceOrg.name}]에게 먹힙니다. 먹히는 생물을 먼저 눌러보세요!`, 'error');
      } else if (targetOrg.role === '1차 소비자' && sourceOrg.type !== 'producer') {
        showToast(`🌿 [${targetOrg.name}]은(는) 주로 식물(생산자)을 먹고 사는 초식 중심 동물이에요!`, 'error');
      } else {
        showToast(`🧐 앗! 자연에서 [${targetOrg.name}]은(는) [${sourceOrg.name}]을(를) 먹이로 삼지 않아요. 다른 생물을 찾아볼까요?`, 'error');
      }
      setSelectedNode(null);
      return;
    }

    // 연결 성공!
    setLinks([...links, { source: selectedNode, target: orgId }]);
    showToast(`✅ 생태계 연결 성공! [${sourceOrg.name} ➔ ${targetOrg.name}]`, 'success');
    setSelectedNode(null);
  };

  // 연결된 화살표 선 클릭 시 삭제
  const handleLineClick = (sourceId, targetId) => {
    if (gameState !== 'playing') return;
    const sOrg = stage.organisms.find(o => o.id === sourceId);
    const tOrg = stage.organisms.find(o => o.id === targetId);
    setLinks(links.filter(l => !(l.source === sourceId && l.target === targetId)));
    showToast(`✂️ [${sOrg?.name} ➔ ${tOrg?.name}] 연결을 끊었습니다.`, 'info');
  };

  // 대자연의 시련(재난) 발생
  const triggerDisaster = () => {
    setSelectedNode(null);
    // 중간 소비자들 중에서 재난 타겟 선정
    const candidates = stage.organisms.filter(o => o.type === 'consumer');
    const shuffled = [...candidates].sort(() => 0.5 - Math.random());
    const victims = shuffled.slice(0, stage.disasterCount);

    const newsList = victims.map((v, idx) => {
      const template = stage.disasters[idx % stage.disasters.length];
      return template.replace('{이름}', `[${v.emoji} ${v.name}]`);
    });

    setDisasterTargets(victims);
    setDisasterNews(newsList);
    setGameState('disaster');
  };

  // 생존 시뮬레이션 계산 함수
  const calculateNextVictims = (currentExtinctSet) => {
    return stage.organisms
      .filter(org => {
        if (org.type === 'producer' || currentExtinctSet.has(org.id)) return false;
        const preyLinks = links.filter(l => l.target === org.id);
        // 먹이가 아예 연결되지 않았거나, 연결된 모든 먹이가 멸종했으면 연쇄 멸종!
        if (preyLinks.length === 0) return true;
        return preyLinks.every(l => currentExtinctSet.has(l.source));
      })
      .map(o => o.id);
  };

  // 시뮬레이션 시작
  const startSimulation = () => {
    setGameState('simulating');
    const initialExtinct = new Set(disasterTargets.map(t => t.id));
    setExtinctIds(initialExtinct);
    const nextQueue = calculateNextVictims(initialExtinct);
    setSimQueue(nextQueue);
  };

  // 창조주의 권능: 기적의 부활 (재난 타겟 1마리 부활 후 재시뮬레이션)
  const useMiraclePower = () => {
    if (miracleUsed || disasterTargets.length === 0) return;
    setMiracleUsed(true);
    const revivedOrg = disasterTargets[0];
    const remainingTargets = disasterTargets.slice(1);
    setDisasterTargets(remainingTargets);

    showToast(`✨ 창조주의 권능으로 [${revivedOrg.name}]을(를) 부활시키고 생태계를 다시 시뮬레이션합니다!`, 'success');
    
    setGameState('simulating');
    const initialExtinct = new Set(remainingTargets.map(t => t.id));
    setExtinctIds(initialExtinct);
    const nextQueue = calculateNextVictims(initialExtinct);
    setSimQueue(nextQueue);
  };

  // 도미노 연쇄 멸종 이펙트 처리
  useEffect(() => {
    if (gameState !== 'simulating') return;

    if (simQueue.length > 0) {
      const timer = setTimeout(() => {
        const victimId = simQueue[0];
        const nextExtinct = new Set(extinctIds);
        nextExtinct.add(victimId);
        setExtinctIds(nextExtinct);

        const newlyAffected = calculateNextVictims(nextExtinct);
        const remainingQueue = simQueue.slice(1);
        newlyAffected.forEach(id => {
          if (!remainingQueue.includes(id) && !nextExtinct.has(id)) {
            remainingQueue.push(id);
          }
        });
        setSimQueue(remainingQueue);
      }, 950);
      return () => clearTimeout(timer);
    } else {
      const endTimer = setTimeout(() => {
        setGameState('result');
      }, 900);
      return () => clearTimeout(endTimer);
    }
  }, [gameState, simQueue, extinctIds]);

  // 스테이지 클리어 자동 해금 처리
  useEffect(() => {
    if (gameState === 'result') {
      const topConsumers = stage.organisms.filter(o => o.type === 'top-consumer');
      const survivingTop = topConsumers.filter(tc => !extinctIds.has(tc.id));
      const totalSurvivors = stage.organisms.filter(o => !extinctIds.has(o.id));
      // 최종 소비자가 모두 살아남고 전체 생물의 65% 이상이 생존하면 성공
      const isSuccess = survivingTop.length === topConsumers.length && totalSurvivors.length >= Math.ceil(stage.organisms.length * 0.65);

      if (isSuccess) {
        if (!unlockedStages.includes(stage.next)) {
          setUnlockedStages(prev => [...prev, stage.next]);
        }
      }
    }
  }, [gameState]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // ==================== 1. 오프닝 타이틀 화면 ====================
  if (view === 'title') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-white relative overflow-hidden select-none">
        {/* 신비로운 별빛 배경 장식 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 left-1/3 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl"></div>
        </div>

        <div className="z-10 max-w-xl w-full bg-slate-800/80 backdrop-blur-xl border-2 border-slate-700 rounded-3xl p-8 md:p-10 text-center shadow-2xl">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 text-amber-300 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
            <Sparkles size={16} /> 4학년 과학: 생물과 환경 (먹이그물 디펜스)
          </div>

          <h1 className="text-4xl md:text-6xl font-black mb-3 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-emerald-300 to-sky-300">
            위대한 창조주
          </h1>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-200 mb-6 tracking-wide">
            생태계 마스터 챌린지
          </h2>

          <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-5 text-left text-slate-300 text-sm md:text-base leading-relaxed mb-6 space-y-2">
            <p>🌟 <strong className="text-yellow-300">창조주님, 환영합니다!</strong> 당신은 이 별의 생태계를 설계하는 임무를 맡았습니다.</p>
            <p>⏳ 제한 시간 안에 <strong className="text-emerald-300">먹히는 생물 ➔ 먹는 생물</strong>을 촘촘하게 연결하여 먹이그물을 완성하세요.</p>
            <p>🚨 시간이 끝나면 <strong className="text-rose-400">대자연의 시련(돌발 재난)</strong>이 닥쳐옵니다! 먹이사슬이 단순하면 연쇄 멸종이 일어나지만, 그물처럼 복잡하게 얽혀 있으면 생태계가 안전하게 유지됩니다.</p>
          </div>

          <div className="mb-6">
            <label className="block text-left text-xs font-bold text-slate-400 uppercase mb-2 ml-1">
              창조주 이름 입력 (선택)
            </label>
            <input
              type="text"
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
              placeholder="예: 4학년 1반 김과학"
              maxLength={15}
              className="w-full bg-slate-900 border-2 border-slate-700 focus:border-emerald-400 rounded-xl px-4 py-3 text-white font-bold text-lg outline-none transition-colors text-center"
            />
          </div>

          <button
            onClick={() => setView('map')}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xl py-4 px-8 rounded-2xl shadow-lg shadow-emerald-600/30 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 border-b-4 border-teal-800"
          >
            <Play fill="currentColor" size={24} /> 창조의 지도 입장하기
          </button>
        </div>
      </div>
    );
  }

  // ==================== 2. 최종 엔딩 및 인증서 화면 ====================
  if (view === 'ending') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-100 via-yellow-50 to-emerald-100 flex flex-col items-center justify-center p-4 select-none">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl text-center max-w-2xl w-full border-8 border-double border-amber-400 relative">
          <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-amber-300 shadow-inner">
            <Trophy className="text-amber-500 w-14 h-14 animate-bounce" />
          </div>

          <div className="text-amber-600 font-black tracking-widest text-sm uppercase mb-1">
            ECOSYSTEM MASTER CERTIFICATE
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-800 mb-6">
            마스터 창조주 인증서
          </h1>

          <div className="bg-amber-50/80 border-2 border-amber-200 rounded-2xl p-6 mb-6 text-slate-700 space-y-3">
            <p className="text-xl font-black text-indigo-900">
              위대한 창조주: <span className="underline decoration-amber-400 decoration-4">{creatorName.trim() || '생태계 수호자'}</span>
            </p>
            <p className="text-base md:text-lg leading-relaxed font-medium">
              당신은 <strong>숲, 강, 사막, 바다</strong>의 4대 생태계를 모두 촘촘한 먹이그물로 연결하여, 어떠한 자연재해와 시련 속에서도 생명이 끊어지지 않는 완벽한 생태계 평화를 이룩하였습니다!
            </p>
            <div className="flex justify-center gap-3 pt-2 text-2xl">
              <span title="초보자의 숲 클리어">🌳</span>
              <span title="생명의 강 클리어">🏞️</span>
              <span title="뜨거운 사막 클리어">🏜️</span>
              <span title="심연의 바다 클리어">🌊</span>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-8 text-sm md:text-base text-emerald-900 font-bold">
            💡 핵심 배움: 생물들의 먹고 먹히는 관계가 단순한 '먹이사슬'보다 복잡한 '먹이그물'로 얽혀 있을 때, 한 생물이 사라져도 대체 먹이가 있어 생태계가 안정적으로 유지됩니다!
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setView('map')}
              className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-3.5 px-8 rounded-xl transition-transform active:scale-95"
            >
              월드맵으로 돌아가기
            </button>
            <button
              onClick={() => {
                setUnlockedStages(['forest']);
                setView('title');
              }}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 px-8 rounded-xl transition-transform active:scale-95"
            >
              처음부터 다시 도전하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==================== 3. 월드맵(스테이지 선택) 화면 ====================
  if (view === 'map') {
    const clearedCount = unlockedStages.length - 1;

    return (
      <div className="min-h-screen bg-slate-100 p-4 md:p-8 flex flex-col select-none">
        <header className="max-w-5xl w-full mx-auto flex flex-wrap justify-between items-center gap-4 mb-8 bg-white p-4 md:px-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white p-2.5 rounded-xl">
              <Map size={24} />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-800">창조의 월드맵</h2>
              <p className="text-xs md:text-sm text-slate-500 font-bold">
                창조주: {creatorName.trim() || '생태계 수호자'} 님 | 스테이지를 순서대로 방어하세요!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-indigo-50 text-indigo-700 font-black px-4 py-2 rounded-xl border border-indigo-200 text-sm">
              정화 완료: {Math.min(4, clearedCount)} / 4
            </div>
          </div>
        </header>

        <div className="flex-1 max-w-5xl mx-auto w-full flex flex-col justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {Object.values(STAGES).map((st, idx) => {
              const isUnlocked = unlockedStages.includes(st.id);
              const isCleared = unlockedStages.includes(st.next);

              return (
                <div
                  key={st.id}
                  onClick={() => isUnlocked && startStage(st.id)}
                  className={`relative p-6 md:p-8 rounded-3xl border-4 transition-all duration-300 flex flex-col justify-between ${
                    isUnlocked
                      ? 'bg-white border-white hover:border-indigo-400 shadow-lg hover:shadow-xl hover:-translate-y-1 cursor-pointer'
                      : 'bg-slate-200/70 border-slate-300 opacity-70 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg shadow ${isUnlocked ? st.mapColor : 'bg-slate-400'}`}>
                        {idx + 1}
                      </span>
                      <div>
                        <h3 className="text-2xl font-black text-slate-800">{st.name}</h3>
                        <p className="text-sm font-bold text-slate-500">{st.subtitle}</p>
                      </div>
                    </div>

                    {isCleared ? (
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shrink-0">
                        <ShieldCheck size={16} /> 방어 완료
                      </span>
                    ) : isUnlocked ? (
                      <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-black shrink-0 animate-pulse">
                        도전 가능
                      </span>
                    ) : (
                      <span className="bg-slate-400 text-white px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shrink-0">
                        <Lock size={14} /> 잠김
                      </span>
                    )}
                  </div>

                  {/* 등장 생물 미리보기 */}
                  <div className="bg-slate-50 rounded-2xl p-3.5 mb-4 border border-slate-100">
                    <div className="text-xs font-bold text-slate-400 mb-1.5">
                      서식 생물 ({st.organisms.length}종) · 제한 시간 {st.timeLimit}초 · 재난 {st.disasterCount}회
                    </div>
                    <div className="flex flex-wrap gap-1.5 text-xl">
                      {st.organisms.map(o => (
                        <span key={o.id} title={`${o.name}(${o.role})`} className="bg-white p-1.5 rounded-lg shadow-sm border border-slate-100">
                          {o.emoji}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <span className={`inline-flex items-center gap-1.5 font-black text-sm px-5 py-2.5 rounded-xl ${
                      isUnlocked ? 'bg-indigo-600 text-white' : 'bg-slate-300 text-slate-500'
                    }`}>
                      {isCleared ? '다시 플레이하기' : isUnlocked ? '생태계 창조 시작' : '이전 스테이지를 클리어하세요'}
                      {isUnlocked && <ArrowRight size={16} />}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {unlockedStages.includes('end') && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setView('ending')}
                className="bg-gradient-to-r from-amber-400 to-orange-500 text-white font-black text-lg px-8 py-4 rounded-2xl shadow-lg hover:scale-105 transition-transform inline-flex items-center gap-2"
              >
                <Award size={24} /> 마스터 창조주 인증서 다시 보기
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==================== 4. 본 게임 플레이 화면 ====================
  // 생태계 방어력(안정도) 계산: 소비자들이 최소 2개 이상의 먹이 사슬을 가질수록 방어력이 높아짐
  const consumers = stage.organisms.filter(o => o.type !== 'producer');
  const wellConnectedCount = consumers.filter(c => {
    const incoming = links.filter(l => l.target === c.id).length;
    return incoming >= 2;
  }).length;
  const connectedAnyCount = consumers.filter(c => links.some(l => l.target === c.id)).length;
  const defensePct = Math.min(
    100,
    Math.round(((connectedAnyCount * 0.5 + wellConnectedCount * 0.5) / consumers.length) * 100)
  );

  // 시뮬레이션 최종 결과 판정
  const topConsumers = stage.organisms.filter(o => o.type === 'top-consumer');
  const survivingTop = topConsumers.filter(tc => !extinctIds.has(tc.id));
  const totalSurvivors = stage.organisms.filter(o => !extinctIds.has(o.id));
  const isStageSuccess =
    survivingTop.length === topConsumers.length &&
    totalSurvivors.length >= Math.ceil(stage.organisms.length * 0.65);

  return (
    <div className={`min-h-screen flex flex-col relative select-none overflow-hidden transition-colors duration-700 ${
      gameState !== 'playing' ? 'bg-slate-900' : `bg-gradient-to-b ${stage.bg}`
    }`}>
      {/* 상단 상태바 (HUD) */}
      <header className={`px-4 py-3 md:px-6 flex flex-wrap justify-between items-center gap-3 z-30 border-b ${
        gameState !== 'playing'
          ? 'bg-slate-800/90 text-white border-slate-700'
          : 'bg-white/90 backdrop-blur-md text-slate-800 border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setView('map')}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm flex items-center gap-1.5 transition-colors"
          >
            <Map size={16} /> 월드맵
          </button>
          <div>
            <h1 className="text-lg md:text-xl font-black leading-tight">{stage.name}</h1>
            <p className="text-xs font-bold text-slate-500 hidden sm:block">
              먹히는 생물(아래)을 먼저 누르고, 먹는 생물(위)을 눌러 화살표를 연결하세요!
            </p>
          </div>
        </div>

        {gameState === 'playing' && (
          <div className="flex items-center gap-3 flex-1 max-w-xl justify-end">
            {/* 방어력 게이지 */}
            <div className="flex-1 max-w-xs hidden sm:block">
              <div className="flex justify-between text-xs font-extrabold mb-1">
                <span>🛡️ 먹이그물 안정도(방어력)</span>
                <span className={defensePct >= 75 ? 'text-emerald-600' : defensePct >= 40 ? 'text-amber-600' : 'text-rose-600'}>
                  {defensePct}% (연결 {links.length}개)
                </span>
              </div>
              <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden border border-slate-300">
                <div
                  className={`h-full transition-all duration-300 ${
                    defensePct >= 75 ? 'bg-emerald-500' : defensePct >= 40 ? 'bg-amber-400' : 'bg-rose-500'
                  }`}
                  style={{ width: `${defensePct}%` }}
                />
              </div>
            </div>

            {/* 먹이 힌트 모달 버튼 (스테이지당 1회 제한) */}
            <button
              onClick={handleOpenGuide}
              className={`p-2.5 rounded-xl font-bold text-xs md:text-sm flex items-center gap-1.5 border transition-colors ${
                guideCountLeft > 0
                  ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300'
                  : 'bg-slate-200 text-slate-500 border-slate-300 cursor-not-allowed'
              }`}
              title={guideCountLeft > 0 ? '생물들의 먹이 도감 보기 (스테이지당 딱 1번만 볼 수 있어요)' : '먹이 도감 열람 횟수를 모두 사용했습니다'}
            >
              {guideCountLeft > 0 ? <HelpCircle size={18} /> : <Lock size={16} />}
              <span className="hidden md:inline">먹이 도감</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[11px] font-black ${
                guideCountLeft > 0 ? 'bg-amber-500 text-white' : 'bg-slate-400 text-white'
              }`}>
                {guideCountLeft > 0 ? `${guideCountLeft}/1` : '잠김'}
              </span>
            </button>

            {/* 타이머 */}
            <div className={`font-black text-xl md:text-2xl px-3.5 py-1.5 rounded-xl border-2 tabular-nums ${
              timeLeft <= 15
                ? 'bg-rose-100 text-rose-600 border-rose-400 animate-pulse'
                : 'bg-slate-50 text-slate-800 border-slate-300'
            }`}>
              ⏱️ {formatTime(timeLeft)}
            </div>

            {/* 시련 시작(창조 완료) 버튼 */}
            <button
              onClick={triggerDisaster}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-2.5 px-4 md:px-5 rounded-xl shadow-md active:scale-95 text-sm md:text-base border-b-4 border-indigo-800 shrink-0"
            >
              창조 완료 (시련 시작)
            </button>
          </div>
        )}
      </header>

      {/* 토스트 알림창 */}
      {toast && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl font-extrabold text-sm md:text-base shadow-xl border-2 flex items-center gap-2 transition-all ${
          toast.type === 'error'
            ? 'bg-rose-600 text-white border-rose-400'
            : toast.type === 'success'
            ? 'bg-emerald-600 text-white border-emerald-400'
            : 'bg-slate-800 text-white border-slate-600'
        }`}>
          {toast.msg}
        </div>
      )}

      {/* 메인 생태계 캔버스 영역 */}
      <main className="flex-1 relative w-full max-w-6xl mx-auto my-2 md:my-4 bg-white/60 backdrop-blur-sm md:rounded-3xl shadow-inner border-y-2 md:border-2 border-white/80 overflow-hidden">
        {/* 영양 단계 배경 가이드 라인 */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none p-3 opacity-60">
          <div className="border-b border-dashed border-rose-300 pb-1 flex justify-between items-center">
            <span className="text-xs font-black text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
              🔺 최종 소비자 (맨 위)
            </span>
            <span className="text-[11px] font-bold text-slate-500">다른 동물들을 잡아먹는 최상위 포식자</span>
          </div>
          <div className="border-b border-dashed border-amber-300 pb-1 flex justify-between items-center">
            <span className="text-xs font-black text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              🔸 중간·1차 소비자 (가운데)
            </span>
            <span className="text-[11px] font-bold text-slate-500">여러 갈래로 먹이그물을 연결할수록 생태계가 튼튼해져요!</span>
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              🌱 생산자 (맨 아래)
            </span>
            <span className="text-[11px] font-bold text-slate-500">햇빛과 물로 스스로 양분을 만드는 식물</span>
          </div>
        </div>

        {/* SVG 화살표 연결선 */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
          <defs>
            <marker id="arrowActive" viewBox="0 0 10 10" refX="26" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#4F46E5" />
            </marker>
            <marker id="arrowDead" viewBox="0 0 10 10" refX="26" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#94A3B8" />
            </marker>
          </defs>

          {links.map((link, idx) => {
            const sourceOrg = stage.organisms.find(o => o.id === link.source);
            const targetOrg = stage.organisms.find(o => o.id === link.target);
            if (!sourceOrg || !targetOrg) return null;

            const isDeadLink = extinctIds.has(link.source) || extinctIds.has(link.target);

            return (
              <g key={`${link.source}-${link.target}-${idx}`} className="group">
                {/* 터치/클릭으로 선을 쉽게 지울 수 있는 투명 히트박스 */}
                {gameState === 'playing' && (
                  <line
                    x1={`${sourceOrg.x}%`}
                    y1={`${sourceOrg.y}%`}
                    x2={`${targetOrg.x}%`}
                    y2={`${targetOrg.y}%`}
                    stroke="transparent"
                    strokeWidth="28"
                    className="pointer-events-auto cursor-pointer"
                    onClick={() => handleLineClick(link.source, link.target)}
                  />
                )}
                {/* 눈에 보이는 화살표 선 */}
                <line
                  x1={`${sourceOrg.x}%`}
                  y1={`${sourceOrg.y}%`}
                  x2={`${targetOrg.x}%`}
                  y2={`${targetOrg.y}%`}
                  stroke={isDeadLink ? '#94A3B8' : '#4F46E5'}
                  strokeWidth={isDeadLink ? '2.5' : '3.5'}
                  strokeDasharray={isDeadLink ? '6,6' : 'none'}
                  markerEnd={isDeadLink ? 'url(#arrowDead)' : 'url(#arrowActive)'}
                  className={
                    gameState === 'playing'
                      ? 'group-hover:stroke-rose-500 transition-colors pointer-events-none'
                      : 'pointer-events-none opacity-60'
                  }
                />
              </g>
            );
          })}
        </svg>

        {/* 생물 노드 버튼들 */}
        {stage.organisms.map(org => {
          const isExtinct = extinctIds.has(org.id);
          const isSelected = selectedNode === org.id;
          const isDyingNow = simQueue.length > 0 && simQueue[0] === org.id;

          let borderStyle = 'border-amber-400';
          if (org.type === 'producer') {
            borderStyle = 'border-emerald-500';
          } else if (org.type === 'top-consumer') {
            borderStyle = 'border-rose-500';
          }

          // 현재 생물에게 연결된 먹이 개수 표시 (생산자 제외)
          const preyCount = links.filter(l => l.target === org.id).length;

          return (
            <button
              key={org.id}
              onClick={() => handleNodeClick(org.id)}
              disabled={gameState !== 'playing'}
              style={{ left: `${org.x}%`, top: `${org.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-20 transition-all duration-300 group ${
                isExtinct
                  ? 'opacity-35 grayscale scale-75'
                  : isSelected
                  ? 'scale-115 z-30'
                  : 'hover:scale-105'
              }`}
            >
              {/* 연쇄 멸종 중일 때 붉은 파동 효과 */}
              {isDyingNow && (
                <div className="absolute inset-0 bg-rose-500 rounded-full animate-ping opacity-60 scale-150 pointer-events-none" />
              )}

              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white rounded-full shadow-lg border-4 flex items-center justify-center text-2xl sm:text-3xl md:text-4xl relative transition-all ${
                  isSelected
                    ? 'ring-4 ring-indigo-500 border-indigo-600 bg-indigo-50'
                    : borderStyle
                }`}
              >
                <span>{org.emoji}</span>

                {/* 소비자의 확보된 먹이 수 뱃지 */}
                {org.type !== 'producer' && !isExtinct && (
                  <span
                    className={`absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full text-[11px] font-black flex items-center justify-center border-2 border-white shadow ${
                      preyCount === 0
                        ? 'bg-rose-500 text-white'
                        : preyCount === 1
                        ? 'bg-amber-400 text-slate-900'
                        : 'bg-emerald-500 text-white'
                    }`}
                    title={`연결된 먹이: ${preyCount}종류`}
                  >
                    {preyCount}
                  </span>
                )}

                {/* 멸종 X 표시 */}
                {isExtinct && (
                  <span className="absolute inset-0 flex items-center justify-center bg-slate-900/50 rounded-full text-rose-500 font-black text-4xl">
                    ✖
                  </span>
                )}
              </div>

              <div className={`mt-1 px-2.5 py-0.5 rounded-full text-xs md:text-sm font-black shadow-sm border whitespace-nowrap ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-700'
                  : isExtinct
                  ? 'bg-slate-700 text-slate-300 border-slate-600 line-through'
                  : 'bg-white/95 text-slate-800 border-slate-200'
              }`}>
                {org.name}
              </div>
            </button>
          );
        })}

        {/* 하단 조작 안내 배너 */}
        {gameState === 'playing' && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none w-[95%] max-w-xl text-center">
            {selectedNode ? (
              <div className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-xs md:text-sm shadow-lg inline-block animate-bounce">
                👆 [{stage.organisms.find(o => o.id === selectedNode)?.name}]을(를) 잡아먹는 생물을 터치해 화살표를 연결하세요! (취소하려면 다시 터치)
              </div>
            ) : links.length === 0 ? (
              <div className="bg-white/95 text-slate-700 border border-slate-300 px-4 py-2 rounded-xl font-bold text-xs md:text-sm shadow inline-block">
                💡 팁: 생물 원 오른쪽 위의 숫자는 <strong>연결된 먹이 개수</strong>입니다. 숫자가 <strong className="text-emerald-600">2 이상(초록색)</strong>이 되도록 먹이그물을 짜세요!
              </div>
            ) : (
              <div className="bg-white/80 text-slate-600 px-3 py-1 rounded-full font-bold text-xs inline-block">
                ✂️ 잘못 연결한 화살표 선은 선을 직접 터치하면 삭제됩니다.
              </div>
            )}
          </div>
        )}
      </main>

      {/* ==================== 모달 1: 먹이 도감 (힌트) ==================== */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border-2 border-slate-200 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                📖 {stage.name} 먹이 도감
              </h3>
              <button
                onClick={() => setShowGuideModal(false)}
                className="text-slate-400 hover:text-slate-600 font-black text-xl px-2"
              >
                ✕
              </button>
            </div>
            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs font-extrabold px-3 py-2 rounded-xl mb-4 flex items-center justify-between">
              <span>💡 단 1번의 도감 찬스를 사용 중입니다! 창을 닫으면 다시 열 수 없으니 잘 기억해 두세요.</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {stage.organisms.map(org => {
                const preys = org.validPrey.map(pid => stage.organisms.find(o => o.id === pid)).filter(Boolean);
                return (
                  <div key={org.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="text-2xl">{org.emoji}</span>
                      <div>
                        <div className="font-black text-slate-800 text-sm">{org.name}</div>
                        <div className="text-[11px] font-bold text-slate-500">{org.role}</div>
                      </div>
                    </div>
                    <div className="text-right text-xs font-bold text-slate-700">
                      {org.type === 'producer' ? (
                        <span className="text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          ☀️ 햇빛·물 (스스로 양분 생성)
                        </span>
                      ) : (
                        <div className="flex flex-wrap justify-end gap-1">
                          <span className="text-slate-400 mr-1">먹이:</span>
                          {preys.map(p => (
                            <span key={p.id} className="bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                              {p.emoji} {p.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => setShowGuideModal(false)}
              className="mt-5 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-xl"
            >
              도감 닫기
            </button>
          </div>
        </div>
      )}

      {/* ==================== 모달 2: 대자연의 시련(재난 뉴스) ==================== */}
      {gameState === 'disaster' && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-4 border-rose-500 p-6 md:p-8 rounded-3xl max-w-lg w-full text-center shadow-2xl">
            <AlertTriangle className="mx-auto text-rose-500 w-16 h-16 mb-3 animate-bounce" />
            <div className="text-xs font-black tracking-widest text-rose-400 uppercase mb-1">
              BREAKING NEWS · 긴급 재난 속보
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-5">
              🚨 대자연의 시련 발생!
            </h2>

            <div className="space-y-3 mb-6">
              {disasterNews.map((news, i) => (
                <div key={i} className="bg-rose-950/70 border border-rose-500/50 p-4 rounded-2xl text-rose-100 font-bold text-base md:text-lg leading-snug">
                  {news}
                </div>
              ))}
            </div>

            <p className="text-slate-300 text-sm font-medium mb-6">
              과연 당신이 설계한 먹이그물은 이 위기를 견뎌내고<br />
              최종 소비자까지 안전하게 지켜낼 수 있을까요?
            </p>

            <button
              onClick={startSimulation}
              className="bg-rose-600 hover:bg-rose-500 text-white font-black py-4 px-8 rounded-2xl text-lg shadow-lg w-full transition-transform active:scale-95 border-b-4 border-rose-800"
            >
              생태계 생존 시뮬레이션 시작 ▶
            </button>
          </div>
        </div>
      )}

      {/* ==================== 모달 3: 시뮬레이션 결과 및 창조주의 권능 ==================== */}
      {gameState === 'result' && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-slate-700 p-6 md:p-8 rounded-3xl max-w-md w-full text-center shadow-2xl text-white">
            {isStageSuccess ? (
              <>
                <div className="w-20 h-20 bg-emerald-500/20 border-2 border-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="text-emerald-400 w-12 h-12" />
                </div>
                <h2 className="text-3xl font-black text-emerald-400 mb-2">
                  🎉 생태계 방어 성공!
                </h2>
                <p className="text-slate-300 font-bold text-sm md:text-base mb-5 leading-relaxed">
                  재난으로 <span className="text-rose-400">{disasterTargets.map(t => t.name).join(', ')}</span>이(가) 사라졌지만, 미리 여러 갈래로 촘촘하게 연결해 둔 <strong>먹이그물(대체 먹이)</strong> 덕분에 연쇄 멸종을 막아냈습니다!
                </p>

                <div className="bg-slate-800 rounded-2xl p-4 mb-6 text-sm font-bold flex justify-around border border-slate-700">
                  <div>
                    <div className="text-slate-400 text-xs">생존한 생물</div>
                    <div className="text-emerald-400 text-xl font-black">{totalSurvivors.length} / {stage.organisms.length}종</div>
                  </div>
                  <div className="border-r border-slate-700" />
                  <div>
                    <div className="text-slate-400 text-xs">최종 소비자 생존</div>
                    <div className="text-amber-300 text-xl font-black">{survivingTop.length} / {topConsumers.length}종</div>
                  </div>
                </div>

                {stage.next === 'end' ? (
                  <button
                    onClick={() => setView('ending')}
                    className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black py-4 px-6 rounded-2xl text-lg shadow-lg flex items-center justify-center gap-2"
                  >
                    <Trophy size={22} /> 마스터 창조주 인증서 받기
                  </button>
                ) : (
                  <button
                    onClick={() => setView('map')}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-4 px-6 rounded-2xl text-lg shadow-lg flex items-center justify-center gap-2"
                  >
                    다음 스테이지로 이동 <ArrowRight size={20} />
                  </button>
                )}
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-rose-500/20 border-2 border-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Skull className="text-rose-500 w-12 h-12 animate-pulse" />
                </div>
                <h2 className="text-3xl font-black text-rose-400 mb-2">
                  생태계 균형 붕괴...
                </h2>
                <p className="text-slate-300 font-bold text-sm md:text-base mb-5 leading-relaxed">
                  먹이사슬이 단순하게 연결되어 있거나 끊어진 곳이 있어서, 먹이가 사라지자 포식자들이 도미노처럼 연쇄 멸종하고 말았습니다.
                </p>

                <div className="bg-slate-800/90 rounded-2xl p-3.5 mb-5 text-xs md:text-sm text-amber-200 font-bold border border-slate-700">
                  💡 힌트: 한 동물이 <strong>2가지 이상의 먹이</strong>를 먹을 수 있도록 화살표를 여러 개 연결해 보세요!
                </div>

                {/* 창조주의 권능: 기적의 부활 찬스 (스테이지당 1회) */}
                {!miracleUsed && disasterTargets.length > 0 && links.length >= 5 && (
                  <button
                    onClick={useMiraclePower}
                    className="w-full mb-3 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black py-3.5 px-4 rounded-2xl text-sm md:text-base shadow-lg flex items-center justify-center gap-2 animate-pulse"
                  >
                    <Sparkles size={18} /> 창조주의 권능: [{disasterTargets[0].name}] 기적의 부활 (1회 찬스)
                  </button>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setView('map')}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3.5 rounded-xl"
                  >
                    월드맵
                  </button>
                  <button
                    onClick={() => startStage(currentStageId)}
                    className="flex-2 bg-rose-600 hover:bg-rose-500 text-white font-black py-3.5 px-5 rounded-xl flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={18} /> 다시 설계하기
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
