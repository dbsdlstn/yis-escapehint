-- 힌트 코드를 4자리 형식으로 업데이트하는 SQL 스크립트

-- 좀비 연구소 힌트 코드 업데이트
UPDATE hint SET code = 'Z001' WHERE code = 'ZOMBIE01';
UPDATE hint SET code = 'Z002' WHERE code = 'ZOMBIE02';
UPDATE hint SET code = 'Z003' WHERE code = 'ZOMBIE03';

-- 도둑의 금고 힌트 코드 업데이트
UPDATE hint SET code = 'D001' WHERE code = 'THIEF01';
UPDATE hint SET code = 'D002' WHERE code = 'THIEF02';
UPDATE hint SET code = 'D003' WHERE code = 'THIEF03';

-- 시간 여행자의 방 힌트 코드 업데이트
UPDATE hint SET code = 'T001' WHERE code = 'TIME01';
UPDATE hint SET code = 'T002' WHERE code = 'TIME02';
UPDATE hint SET code = 'T003' WHERE code = 'TIME03';

-- 업데이트된 힌트 확인
SELECT * FROM hint WHERE code IN ('Z001', 'Z002', 'Z003', 'D001', 'D002', 'D003', 'T001', 'T002', 'T003');