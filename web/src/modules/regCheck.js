const u_IdReg = /^[a-z][a-z0-9]{2,14}$/;
const u_PwReg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{3,15}$/;
const u_NameReg = /^[가-힣]{2,4}$|^[a-zA-Z]{2,15}$/;
const u_EmailReg = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
const s_AmountReg = /^[1-9][0-9]{0,2}$/;

export const u_IdCheck = u_Id => {
  return u_IdReg.test(u_Id);
} 

export const u_PwCheck = u_Pw => {
  return u_PwReg.test(u_Pw);
} 

export const u_NameCheck = u_Name => {
  return u_NameReg.test(u_Name);
} 

export const u_EmailCheck = u_Email => {
  return u_EmailReg.test(u_Email);
} 

export const s_AmountCheck = s_Amount => {
  return s_AmountReg.test(s_Amount);
}