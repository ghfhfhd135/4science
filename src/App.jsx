import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, Shield, AlertTriangle, RefreshCw, Trophy, 
  Sparkles, BookOpen, Lock, User, Award, CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ECOSYSTEMS } from './ecosystems';

export default function FoodWebGame() {
  const [studentInfo, setStudentInfo] = useState({ grade: '4', classNum: '', studentNum: '', name: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [unlockedStages, setUnlockedStages] = useState(['forest']);
  const [clearedStages, setClearedStages] = useState([]);
  const [currentStageId, setCurrentStageId] = useState(null);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const [selectedPrey, setSelectedPrey] = useState(null);
  const [connections, setConnections] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [guideCount, setGuideCount] = useState(1);
  const [showGuideModal, setShowGuideModal] = useState(false);

  const [phase, setPhase] = useState('building');
  const [extinctList, setExtinctList] = useState([]);
  const [starvingList, setStarvingList] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [miracleUsed, setMiracleUsed] = useState(false);

  const timerRef = useRef(null);
  const containerRef = useRef(null);
  const currentStage = ECOSYSTEMS.find(e => e.id === currentStageId);

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

  const handleStartLogin = (e) => {
    e.preventDefault();
    if (!studentInfo.name.trim()) {
      alert('이름을 입력해 주세요!');
      return;
    }
    setIsLoggedIn(true);
  };

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

  const startDisaster = () => {
    clearInterval(timerRef.current);
    setIsTimerRunning(false);
    setSelectedPrey(null);
    setPhase('disaster');

    setTimeout(() => {
      runSimulation();
    }, 2800);
  };

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

  if (!currentStageId) {
    const isGameClear = ECOSYSTEMS.every(e => clearedStages.includes(e.id));

    return (
      <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 flex flex-col items-center select-none">
        <header className="max-w-4xl w-full flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
