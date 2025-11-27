import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

interface Hint {
  id: string;
  code: string;
  content: string;
  answer: string | null;
  progressRate: number;
  order: number;
  isActive: boolean;
}

async function updateHintCodes() {
  try {
    // 관리자 로그인
    console.log('관리자 로그인 시도...');
    const loginResponse = await axios.post('http://localhost:3000/api/admin/auth/login', {
      password: 'admin123'
    });

    const token = loginResponse.data.data.accessToken;
    console.log('로그인 성공');

    // 힌트 업데이트를 위한 데이터
    const hintUpdates = [
      // 좀비 연구소 힌트 업데이트 (themeId: 821e3ac8-15e6-4ec7-9703-91f522260c2b)
      { oldCode: 'ZOMBIE01', newCode: 'Z001' },
      { oldCode: 'ZOMBIE02', newCode: 'Z002' },
      { oldCode: 'ZOMBIE03', newCode: 'Z003' },

      // 도둑의 금고 힌트 업데이트 (themeId: 4042b9aa-dd43-4573-8108-b1abb1400e12)
      { oldCode: 'THIEF01', newCode: 'D001' },
      { oldCode: 'THIEF02', newCode: 'D002' },
      { oldCode: 'THIEF03', newCode: 'D003' },

      // 시간 여행자의 방 힌트 업데이트 (themeId: 95b9ead7-615d-4374-a0dc-8cf73300b21b)
      { oldCode: 'TIME01', newCode: 'T001' },
      { oldCode: 'TIME02', newCode: 'T002' },
      { oldCode: 'TIME03', newCode: 'T003' }
    ];

    // 각 힌트에 대해 현재 ID를 조회하고 업데이트
    for (const update of hintUpdates) {
      // 힌트 ID를 가져오기 위해 전체 힌트 목록 조회
      console.log(`힌트 ${update.oldCode} 검색 중...`);

      // 힌트 목록을 가져오기 위해 각 테마별로 요청
      const themeIds = [
        '821e3ac8-15e6-4ec7-9703-91f522260c2b', // 좀비 연구소
        '4042b9aa-dd43-4573-8108-b1abb1400e12', // 도둑의 금고
        '95b9ead7-615d-4374-a0dc-8cf73300b21b'  // 시간 여행자의 방
      ];

      let hintToUpdate: Hint | null = null;
      let targetThemeId: string | null = null;

      // 각 테마에서 힌트를 검색
      for (const themeId of themeIds) {
        try {
          const hintsResponse = await axios.get(`http://localhost:3000/api/admin/hints/themes/${themeId}/hints`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          const foundHint = hintsResponse.data.data.find((hint: Hint) => hint.code === update.oldCode);
          if (foundHint) {
            hintToUpdate = foundHint;
            targetThemeId = themeId;
            break;
          }
        } catch (error: any) {
          console.log(`테마 ${themeId}에서 힌트 검색 실패:`, error.message);
        }
      }

      if (hintToUpdate) {
        console.log(`${update.oldCode} 힌트 ID: ${hintToUpdate.id} 찾음`);

        // 힌트 업데이트
        try {
          await axios.put(`http://localhost:3000/api/admin/hints/${hintToUpdate.id}`, {
            code: update.newCode,
            content: hintToUpdate.content,
            answer: hintToUpdate.answer || null,
            progressRate: hintToUpdate.progressRate,
            order: hintToUpdate.order,
            isActive: hintToUpdate.isActive
          }, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          console.log(`힌트 코드 ${update.oldCode} -> ${update.newCode} 업데이트 성공`);
        } catch (error: any) {
          console.error(`힌트 업데이트 실패 ${update.oldCode}:`, error.message);
        }
      } else {
        console.log(`히트 코드 ${update.oldCode}를 찾지 못했습니다.`);
      }
    }

    console.log('히트 코드 업데이트 완료!');
  } catch (error: any) {
    console.error('히트 코드 업데이트 중 오류 발생:', error.message);
  }
}

// 스크립트 실행
if (require.main === module) {
  updateHintCodes();
}

export {};