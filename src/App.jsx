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

        {isGameClear && (
          <div className="max-w-lg w-full bg-gradient-to-b from-amber-500/20 to-slate-900 border-2 border-amber-400/50 rounded-3xl p-6 text-center my-4 shadow-2xl">
            <Trophy className="w-14 h-14 text-yellow-400 mx-auto animate-bounce" />
            <h2 className="text-xl font-bold text-amber-300 mt-2">🌟 위대한 마스터 창조주 인증</h2>
            <p className="text-slate-300 text-xs mt-1">
              축하합니다! <b>{studentInfo.name}</b> 학생은 숲, 강, 사막, 바다의 모든 생태계를 완벽한 먹이그물로 안정화시켰습니다.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl w-full my-auto py-2">
          {ECOSYSTEMS.map((stage, idx) => {
            const isUnlocked = unlockedStages.includes(stage.id);
            const isCleared = clearedStages.includes(stage.id);

            return (
              <div 
                key={stage.id}
                onClick={() => isUnlocked && enterStage(stage.id)}
                className={`relative rounded-3xl p-6 border-2 transition-all flex flex-col justify-between overflow-hidden shadow-lg ${
                  isUnlocked 
                    ? 'cursor-pointer hover:scale-[1.02] border-slate-700 bg-slate-900/90 hover:border-cyan-400' 
                    : 'opacity-40 border-slate-800 bg-slate-950/40 cursor-not-allowed'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
                      STAGE {idx + 1}
                    </span>
                    {isCleared ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-500/30 px-3 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 정복 완료
                      </span>
                    ) : !isUnlocked ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-900 px-3 py-1 rounded-full">
                        <Lock className="w-3.5 h-3.5" /> 잠김
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
                        도전 가능
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-black mt-3 text-white">{stage.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{stage.description}</p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800 flex justify-between text-xs text-slate-400">
                  <span>생물 8종</span>
                  <span>제한시간 {Math.floor(stage.timeLimit / 60)}분 {stage.timeLimit % 60 ? stage.timeLimit % 60 + '초' : ''}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const topOrganisms = currentStage.organisms.filter(o => o.role === 'top');
  const secondaryOrganisms = currentStage.organisms.filter(o => o.role === 'secondary');
  const primaryOrganisms = currentStage.organisms.filter(o => o.role === 'primary');
  const producerOrganisms = currentStage.organisms.filter(o => o.role === 'producer');

  return (
    <div className={`min-h-screen bg-gradient-to-b ${currentStage.bgGradient} text-white flex flex-col select-none overflow-hidden relative`}>
      
      <header className="bg-slate-950/80 backdrop-blur border-b border-white/10 px-4 py-3 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <button 
            onClick={returnToMap}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-xl font-bold transition"
          >
            ← 월드맵
          </button>
          <div>
            <h2 className="text-base font-black text-white">{currentStage.name}</h2>
            <div className="text-[11px] text-slate-400">
              {studentInfo.name} 창조주 • 연결된 먹이사슬: <b className="text-cyan-400">{connections.length}개</b>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className={`px-3 py-1.5 rounded-xl border font-mono font-bold text-sm ${
            timeLeft <= 30 ? 'bg-rose-950/70 border-rose-500 text-rose-400 animate-pulse' : 'bg-slate-900 border-slate-700 text-slate-200'
          }`}>
            ⏰ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>

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
                <BookOpen className="w-3.5 h-3.5" /> 먹이 도감 (1/1)
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" /> 도감 잠김
              </>
            )}
          </button>

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

      <main className="flex-1 relative overflow-hidden flex flex-col justify-between py-6 px-4 max-w-4xl mx-auto w-full">
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

            const x1 = fromRect.left + fromRect.width / 2;
            const y1 = fromRect.top + fromRect.height / 2;
            const x2 = toRect.left + toRect.width / 2;
            const y2 = toRect.top + toRect.height / 2;

            const isBroken = extinctList.includes(c.from) || extinctList.includes(c.to);

            return (
              <g key={i} className="pointer-events-auto cursor-pointer" onClick={() => handleRemoveConnection(c.from, c.to)}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="transparent" strokeWidth="24" />
                <line 
                  x1={x1} y1={y1} x2={x2} y2={y2} 
                  stroke={isBroken ? '#f43f5e' : '#38bdf8'} 
                  strokeWidth="3.5" 
                  strokeDasharray={isBroken ? '6 6' : 'none'}
                  markerEnd={isBroken ? 'url(#arrow-broken)' : 'url(#arrow)'}
                  className="transition-all hover:stroke-rose-400"
                />
              </g>
            );
          })}
        </svg>

        <div className="relative z-10 flex flex-col justify-between h-full py-2">
          <div className="flex justify-center items-center">
            {topOrganisms.map(org => renderCircleCard(org, 'top'))}
          </div>

          <div className="flex justify-around items-center px-12 md:px-28">
            {secondaryOrganisms.map(org => renderCircleCard(org, 'secondary'))}
          </div>

          <div className="flex justify-between items-center px-4 md:px-12">
            {primaryOrganisms.map(org => renderCircleCard(org, 'primary'))}
          </div>

          <div className="flex justify-around items-center px-16 md:px-36">
            {producerOrganisms.map(org => renderCircleCard(org, 'producer'))}
          </div>
        </div>
      </main>

      <footer className="bg-slate-950/70 border-t border-white/10 py-2.5 px-4 text-center text-xs text-slate-300 z-10">
        💡 <b>팁:</b> 먹히는 생물을 먼저 누르고 ➔ 먹는 동물을 차례로 누르세요. 오른쪽 위 숫자가 <b>2 이상(초록색)</b>이 되도록 촘촘히 연결하세요!
      </footer>

      {showGuideModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-amber-300 flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> {currentStage.name} 먹이 도감
              </h3>
              <span className="text-xs text-rose-400 font-bold">⚠️ 닫으면 다시 열 수 없습니다!</span>
            </div>

            <div className="overflow-y-auto my-4 space-y-2 pr-1">
              {currentStage.organisms.map(org => (
                <div key={org.id} className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center gap-3">
                  <span className="text-3xl p-1 bg-slate-900 rounded-xl">{org.emoji}</span>
                  <div className="flex-1">
                    <span className="font-bold text-sm text-white">{org.name}</span>
                    <p className="text-xs text-slate-400">{org.desc}</p>
                    {org.eats && org.eats.length > 0 && (
                      <p className="text-xs text-cyan-300 font-semibold mt-0.5">
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

      {phase === 'result' && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
            {isSuccess ? (
              <>
                <Trophy className="w-20 h-20 text-yellow-400 mx-auto animate-bounce" />
                <h2 className="text-2xl font-black text-emerald-400 mt-3">생태계 방어 성공!</h2>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                  재난으로 일부 생물이 사라졌지만, {studentInfo.name} 창조주님이 짠 <b>복잡한 먹이그물</b> 덕분에 최상위 포식자까지 안정적으로 생존했습니다!
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
                  먹이가 끊긴 동물들이 연쇄적으로 굶어 죽어 결국 최상위 포식자까지 멸종했습니다.
                </p>

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

  function renderCircleCard(org, roleType) {
    const isSelected = selectedPrey?.id === org.id;
    const isExtinct = extinctList.includes(org.id);
    const isStarved = starvingList.includes(org.id);
    const foodCount = connections.filter(c => c.to === org.id).length;

    const ringBorder = 
      roleType === 'top' ? 'border-rose-400' :
      roleType === 'secondary' || roleType === 'primary' ? 'border-amber-400' :
      'border-emerald-400';

    return (
      <div
        key={org.id}
        id={`org-${org.id}`}
        onClick={() => handleOrganismClick(org)}
        className="flex flex-col items-center cursor-pointer transition-all duration-300"
      >
        <div className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center border-4 bg-white shadow-xl transition-all ${ringBorder} ${
          isExtinct ? 'grayscale opacity-50 scale-90 border-slate-600 bg-slate-800' :
          isStarved ? 'opacity-70 animate-pulse border-amber-600 bg-amber-950' :
          isSelected ? 'ring-4 ring-cyan-400 scale-110' :
          'hover:scale-105'
        }`}>
          {org.role !== 'producer' && phase === 'building' && (
            <span className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white shadow-md ${
              foodCount === 0 ? 'bg-rose-500' :
              foodCount === 1 ? 'bg-amber-500' :
              'bg-emerald-500'
            }`}>
              {foodCount}
            </span>
          )}

          <span className="text-3xl md:text-4xl">{org.emoji}</span>
        </div>

        <div className="mt-1.5 px-3 py-0.5 rounded-full bg-slate-900/90 border border-slate-700 text-white font-bold text-xs md:text-sm shadow-md whitespace-nowrap">
          {org.name}
        </div>

        {isExtinct && <span className="text-[10px] font-black text-rose-400">🚨 멸종</span>}
        {isStarved && <span className="text-[10px] font-black text-amber-400">⚠️ 아사</span>}
      </div>
    );
  }
}
