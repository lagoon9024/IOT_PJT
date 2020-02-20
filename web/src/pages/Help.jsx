import Pagination from "@material-ui/lab/Pagination";
import { Box, Card, Paper, Typography } from "@material-ui/core";
import React from "react";
import Help1 from "../assets/help/1.PNG";
import Help2 from "../assets/help/2.PNG";
import Help3 from "../assets/help/3.PNG";
import Help4 from "../assets/help/4.PNG";
import Help5 from "../assets/help/5.PNG";
import Help6 from "../assets/help/6.PNG";
import Help7 from "../assets/help/7.PNG";
import Help8 from "../assets/help/8.PNG";
import Help9 from "../assets/help/9.PNG";

const helptitle = [
  "메인 페이지",
  "기기 등록",
  "기기 목록",
  "배식 설정",
  "급식 기록",
  "사료 검색",
  "성분 확인",
  "위험 성분",
  "사료 리뷰"
];
const helpview = [
  Help1,
  Help2,
  Help3,
  Help4,
  Help5,
  Help6,
  Help7,
  Help8,
  Help9
];
const helptext = [
  "현재 사료통에 있는 사료의 양과 밥그릇에 있는 사료의 양을 확인할 수 있어요!",
  "소중한 아이들의 정보를 입력해주세요!",
  "아이들을 한 눈에 볼 수 있어요!",
  "원하는 시간에 원하는 양을 설정해서 우리 아이가 배고프지 않게 해주세요!",
  "그래프를 보면 우리 아이가 사료를 잘 먹고 있는지 파악할 수 있어요!",
  "사료를 검색해요!",
  "영양 성분을 확인해요!",
  "위험 성분을 확인해요!",
  "정보를 공유해요!"
];
const Help = props => {
  const [page, setPage] = React.useState(1);
  const handleChange = (event, value) => {
    setPage(value);
  };
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
        <Typography>{helptitle[page-1]}</Typography>
        <Box display="flex" height="400px" justifyContent="center" marginTop={2}>
        <img
          src={helpview[page - 1]}
          style={{width:"auto",height : "100%",maxHeight : "400px" }}
        />
        </Box>
        <Box height="50px" marginTop={2} marginBottom={2}>
        <Typography>{helptext[page-1]}</Typography>

        </Box>

      <Pagination
        
        count={9}
        page={page}
        onChange={handleChange}
        siblingCount={0}
      />
    </div>
  );
};
export default Help;
