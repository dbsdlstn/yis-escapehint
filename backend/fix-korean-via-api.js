const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function main() {
  try {
    // 1. 기존 테마 목록 가져오기
    const themesResponse = await axios.get(`${API_BASE}/admin/themes`);
    const themes = themesResponse.data.data;

    console.log('기존 테마:', themes.length, '개');

    // 2. 각 테마 삭제
    for (const theme of themes) {
      await axios.delete(`${API_BASE}/admin/themes/${theme.id}`);
      console.log('삭제:', theme.id);
    }

    // 3. 새로운 테마 생성
    const newThemes = [
      {
        name: '좀비 연구소',
        description: '사라진 연구원의 흔적을 찾아 좀비가 난무하는 연구소를 탈출하라',
        playTime: 90,
        difficulty: '상',
        isActive: true,
      },
      {
        name: '시간 여행자의 방',
        description: '과거와 미래를 넘나드는 시간 여행자의 방에서 탈출하라',
        playTime: 120,
        difficulty: '중',
        isActive: true,
      },
      {
        name: '도둑의 금고',
        description: '도둑의 금고에서 보물을 훔치고 탈출하라',
        playTime: 60,
        difficulty: '하',
        isActive: true,
      },
    ];

    for (const theme of newThemes) {
      const response = await axios.post(`${API_BASE}/admin/themes`, theme);
      console.log('생성:', response.data.data.name);
    }

    console.log('✅ 한글 데이터 수정 완료!');
  } catch (error) {
    console.error('에러:', error.response?.data || error.message);
  }
}

main();
