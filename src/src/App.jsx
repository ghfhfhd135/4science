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
