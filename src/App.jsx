import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, Shield, AlertTriangle, RefreshCw, Trophy, 
  Sparkles, BookOpen, Lock, User, Award, CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

// 4개 생태계 데이터 정의 (4단계 계층: top -> secondary -> primary -> producer)
const ECOSYSTEMS = [
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
      // Top (1)
      { id: 'f_top', name: '매', role: 'top', emoji: '🦅', eats: ['뱀', '개구리', '산토끼', '다람쥐'], desc: '하늘의 최고 포식자' },
      // Secondary (2)
      { id: 'f_s1', name: '개구리', role: 'secondary', emoji: '🐸', eats: ['메뚜기'], desc: '작은 곤충을 날쌔게 잡아먹음' },
      { id: 'f_s2', name: '뱀', role: 'secondary', emoji: '🐍', eats: ['개구리', '산토끼', '다람쥐'], desc: '작은 동물을 통째로 삼킴' },
      // Primary (3)
      { id: 'f_p1', name: '메뚜기', role: 'primary', emoji: '🦗', eats: ['풀잎'], desc: '풀잎을 갉아먹는 곤충' },
      { id: 'f_p2', name: '산토끼', role: 'primary', emoji: '🐇', eats: ['풀잎'], desc: '풀과 어린 싹을 먹는 초식동물' },
      { id: 'f_p3', name: '다람쥐', role: 'primary', emoji: '🐿️', eats: ['도토리'], desc: '도토리와 열매를 모으는 동물' },
      // Producer (2)
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
      message: '바다의 중간 다리인 작은 물고기가 사라졌습니다! 생태계 균형을 지켜낼 수 있을까요?'
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

export default function FoodWebGame() {
  // 학생 정보
  const [studentInfo, setStudentInfo] = useState({ grade: '4', classNum: '', studentNum: '', name: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 스테이지 및 게임 상태
  const [unlockedStages, setUnlockedStages] = useState(['forest']);
  const [clearedStages, setClearedStages] = useState([]);
  const [currentStageId, setCurrentStageId] = useState(null);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // 캔버스 상태
  const [selectedPrey, setSelectedPrey] = useState(null);
  const [connections, setConnections] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [guideCount, setGuideCount] = useState(1);
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
      startDisaster();
    }
    return () => clearInterval(timerRef.current);
  }, [isTimerRunning, timeLeft]);

  // 학생 등록 완료
  const handleStartLogin = (e) => {
    e.preventDefault();
    if (!studentInfo.name.trim()) {
      alert('이름을 입력해 주세요!');
      return;
    }
    setIsLoggedIn(true);
  };

  // 스테이지 진입
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

  const triggerFeedback = (text, type = 'info') => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 3000);
  };

  // 생물 클릭 처리
  const handleOrganismClick = (org) => {
    if (phase !== 'building') return;

    if (!selectedPrey) {
      if (org.role === 'top') {
        triggerFeedback(`[${org.name}]은(는) 최종 소비자라서 다른 동물에게 먹히지 않아요! 먹히는 생물을 먼저 고르세요.`, 'warning');
        return;
      }
      setSelectedPrey(org);
      triggerFeedback(`[${org.name}]을(를) 먹을 포식자 동물을 골라주세요!`, 'info');
    } else {
      if (selectedPrey.id === org.id) {
        setSelectedPrey(null);
        triggerFeedback('선택을 취소했습니다.', 'info');
        return;
      }

      // 실제 먹이 관계 검증
      const isValid = org.eats && org.eats.includes(selectedPrey.name);

      if (!isValid) {
        const isReverse = selectedPrey.eats && selectedPrey.eats.includes(org.name);
        if (isReverse) {
          triggerFeedback(`앗! 반대로 연결했어요! [${selectedPrey.name}]이(가) [${org.name}]을(를) 먹는 관계예요!`, 'error');
        } else {
          triggerFeedback(`[${org.name}]은(는) [${selectedPrey.name}]을(를) 먹지 않아요! 다른 먹이를 찾아보세요.`, 'error');
        }
        setSelectedPrey(null);
        return;
      }

      const isAlready = connections.some(c => c.from === selectedPrey.id && c.to === org.id);
      if (isAlready) {
        triggerFeedback('이미 연결되어 있는 먹이사슬입니다!', 'warning');
        setSelectedPrey(null);
        return;
      }

      setConnections(prev => [...prev, { from: selectedPrey.id, to: org.id }]);
      triggerFeedback(`연결 성공! (${selectedPrey.name} ➔ ${org.name})`, 'success');
      setSelectedPrey(null);
    }
  };

  const handleRemoveConnection = (fromId, toId) => {
    if (phase !== 'building') return;
    setConnections(prev => prev.filter(c => !(c.from === fromId && c.to === toId)));
    triggerFeedback('먹이 관계 연결을 끊었습니다.', 'info');
  };

  const openGuide = () => {
    if (guideCount <= 0) {
      triggerFeedback('먹이 도감은 1회만 열람할 수 있어 이미 잠겼습니다!', 'error');
      return;
    }
    setGuideCount(0);
    setShowGuideModal(true);
  };

  // 재난 시작
  const startDisaster = () => {
    clearInterval(timerRef.current);
    setIsTimerRunning(false);
    setSelectedPrey(null);
    setPhase('disaster');

    setTimeout(() => {
      runSimulation();
    }, 2800);
  };

  // 연쇄 멸종 시뮬레이션
  const runSimulation = () => {
    setPhase('simulating');
    const targetName = currentStage.disaster.target;
    const targetOrg = currentStage.organisms.find(o => o.name === targetName);

    let deadList = [targetOrg.id];
    setExtinctList(deadList);

    let currentDead = new Set(deadList);
    let starved = [];
    let changed = true;

    while (changed) {
      changed = false;
      for (const org of currentStage.organisms) {
        if (org.role === 'producer') continue;
        if (currentDead.has(org.id)) continue;

        const activeFeedLines = connections.filter(c => {
          if (c.to !== org.id) return false;
          return !currentDead.has(c.from);
        });

        if (activeFeedLines.length === 0) {
          currentDead.add(org.id);
          starved.push(org.id);
          changed = true;
        }
      }
    }

    setStarvingList(starved);

    setTimeout(() => {
      const topOrg = currentStage.organisms.find(o => o.role === 'top');
      const isTopAlive = !currentDead.has(topOrg.id);

      setIsSuccess(isTopAlive);
      setPhase('result');

      if (isTopAlive) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        if (!clearedStages.includes(currentStage.id)) {
          setClearedStages(prev => [...prev, currentStage.id]);
        }
        const currentIndex = ECOSYSTEMS.findIndex(e => e.id === currentStage.id);
        if (currentIndex < ECOSYSTEMS.length - 1) {
          const nextStageId = ECOSYSTEMS[currentIndex + 1].id;
          if (!unlockedStages.includes(nextStageId)) {
            setUnlockedStages(prev => [...prev, nextStageId]);
          }
        }
      }
    }, 2400);
  };

  const useMiracle = () => {
    if (miracleUsed) return;
    setMiracleUsed(true);
    setExtinctList([]);
    setStarvingList([]);
    setPhase('building');
    setTimeLeft(45);
    setIsTimerRunning(true);
    triggerFeedback('✨ 창조주의 기적으로 생태계가 복원되었습니다! 45초 동안 먹이그물을 더 촘촘히 보강하세요!', 'success');
  };

  const returnToMap = () => {
    clearInterval(timerRef.current);
    setCurrentStageId(null);
    setPhase('building');
  };

  // ---------------- 1. 로그인 화면 ----------------
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center">
          <div className="inline-flex p-3 rounded-2xl bg-indigo-950 border border-indigo-500/30 text-indigo-400 mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            위대한 창조주
          </h1>
          <p className="text-xs text-slate-400 mt-2 mb-6">초등학교 4학년 과학 • 생태계 먹이그물 챌린지</p>

          <form onSubmit={handleStartLogin} className="space-y-4 text-left">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">학년</label>
                <input
                  type="text"
                  value={studentInfo.grade}
                  onChange={(e) => setStudentInfo({ ...studentInfo, grade: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-center text-sm font-bold text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">반</label>
                <input
                  type="text"
                  placeholder="예: 2"
                  value={studentInfo.classNum}
                  onChange={(e) => setStudentInfo({ ...studentInfo, classNum: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-center text-sm font-bold text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">번호</label>
                <input
                  type="text"
                  placeholder="예: 15"
                  value={studentInfo.studentNum}
                  onChange={(e) => setStudentInfo({ ...studentInfo, studentNum: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-center text-sm font-bold text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">창조주(학생) 이름</label>
              <input
                type="text"
                placeholder="이름을 입력하세요"
                value={studentInfo.name}
                onChange={(e) => setStudentInfo({ ...studentInfo, name: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:brightness-110 text-slate-950 font-black rounded-xl text-base shadow-lg transition"
            >
              생태계 창조 시작하기 ➔
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ---------------- 2. 월드맵 화면 ----------------
  if (!currentStageId) {
    const isGameClear = ECOSYSTEMS.every(e => clearedStages.includes(e.id));

    return (
      <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 flex flex-col items-center select-none">
        <header className="max-w-4xl w-full flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-cyan-400" />
            <span className="font-bold text-sm text-slate-200">
              {studentInfo.grade}학년 {studentInfo.classNum}반 {studentInfo.studentNum}번 <b>{studentInfo.name}</b> 창조주
            </span>
          </div>
          <div className="text-xs text-slate-400 font-semibold">
            정복한 생태계: <b className="text-emerald-400">{clearedStages.length} / 4</b>
          </div>
        </header>

        <div className="text-center my-4">
          <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-300">
            생태계 월드맵
          </h1>
          <p className="mt-2 text-slate-400 text-xs md:text-sm">
            순서대로 생태계에 들어가 먹이사슬을 연결하고 시련을 버텨내세요!
          </p>
        </div>

        {/* 올클리어 인증서 */}
        {isGameClear && (
          <div className="max-w-lg w-full bg-gradient-to-b from-amber-500/20 to-slate-900 border-2 border-amber-400/50 rounded-3xl p-6 text-center my-4 shadow-2xl">
            <Trophy className="w-14 h-14 text-yellow-400 mx-auto animate-bounce" />
            <h2 className="text-xl font-bold text-amber-300 mt-2">🌟 위대한 마스터 창조주 인증</h2>
            <p className="text-slate-300 text-xs mt-1">
              축하합니다! <b>{studentInfo.name}</b> 학생은 숲, 강, 사막, 바다의 모든 생태계를 완벽한 먹이그물로 안정화시켰습니다.
            </p>
          </div>
        )}

        {/* 스테이지 카드 */}
        <div className="grid grid-cols-1 md:grid-cols
