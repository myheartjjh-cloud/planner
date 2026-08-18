import Papa from 'papaparse';

// 사용자가 구글 시트의 "웹에 게시" 기능으로 만든 CSV 링크를 여기에 입력합니다.
// (예시: https://docs.google.com/spreadsheets/d/e/2PACX-1v.../pub?output=csv)
const SPREADSHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1QYKBnZezVEXGCFvM-pUt0Q-YykweWxDCKPoF5oKPXU0/export?format=csv&gid=0';

// 데모용 기본 데이터 (구글 시트 연동 전 표시용)
const MOCK_CSV = `id,day,start,end,title,color,type
1,1,09:00,11:00,피아노 학원,var(--accent-primary),academy
2,3,09:00,11:00,피아노 학원,var(--accent-primary),academy
3,5,09:00,11:00,피아노 학원,var(--accent-primary),academy
4,2,14:00,16:00,소마 수학,var(--accent-secondary),academy
5,4,14:00,16:00,소마 수학,var(--accent-secondary),academy
6,0,10:00,12:00,가족 외식,var(--accent-success),personal
`;

export const fetchScheduleData = () => {
  return new Promise((resolve, reject) => {
    const parseCSV = (csvString) => {
      Papa.parse(csvString, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          // 데이터를 컴포넌트에서 쓰기 좋게 변환 (시간을 숫자로 파싱)
          const parsedData = results.data.map(row => {
            const startParts = row.start.split(':');
            const endParts = row.end.split(':');
            return {
              id: parseInt(row.id || Math.random() * 10000),
              day: parseInt(row.day), // 0: Sun, 1: Mon, ...
              start: parseInt(startParts[0]) + parseInt(startParts[1])/60,
              end: parseInt(endParts[0]) + parseInt(endParts[1])/60,
              title: row.title,
              color: row.color,
              type: row.type
            };
          });
          resolve(parsedData);
        },
        error: (error) => {
          reject(error);
        }
      });
    };

    if (SPREADSHEET_CSV_URL) {
      // 실제 구글 시트 CSV 불러오기
      fetch(SPREADSHEET_CSV_URL)
        .then(res => res.text())
        .then(text => parseCSV(text))
        .catch(err => {
          console.warn('구글 시트 로드 실패, 기본 데이터 사용:', err);
          parseCSV(MOCK_CSV);
        });
    } else {
      // URL이 없을 경우 데모 데이터 사용
      parseCSV(MOCK_CSV);
    }
  });
};
