const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function main() {
  try {
    // 기존 테마 ID 사용해서 업데이트
    const updates = [
      {
        id: '7343e80b-c164-4b63-a175-6a68037635aa',
        name: '좀비 연구소',
        description: '사라진 연구원의 흔적을 찾아 좀비가 난무하는 연구소를 탈출하라',
        playTime: 90,
        difficulty: '상',
        isActive: true,
      },
      {
        id: 'b1523dd8-8847-4094-a233-acaef24f4795',
        name: '시간 여행자의 방',
        description: '과거와 미래를 넘나드는 시간 여행자의 방에서 탈출하라',
        playTime: 90,
        difficulty: '중',
        isActive: true,
      },
    ];

    for (const theme of updates) {
      const { id, ...data } = theme;
      const response = await axios.put(`${API_BASE}/admin/themes/${id}`, data);
      console.log('업데이트:', response.data.data.name);
    }

    console.log('✅ 한글 수정 완료!');
  } catch (error) {
    console.error('에러:', error.response?.data || error.message);
  }
}

main();
