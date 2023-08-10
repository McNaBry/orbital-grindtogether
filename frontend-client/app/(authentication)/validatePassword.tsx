import * as pc from "./sign-up/passwordChecks.js";

type ValidatePasswordParams = {
  pw: FormDataEntryValue | null,
  confirmPw: FormDataEntryValue | null,
  setMsg: (msg: string) => void,
  setSuccess: (success: boolean) => void
}

function ValidatePassword(details: ValidatePasswordParams) {
  const {pw, confirmPw, setMsg, setSuccess} = details
  if(!pw || !confirmPw) return false

  if (!pc.checkPassword(pw, confirmPw)) {
    setMsg("Passwords entered do not match.")
  } else if (!pc.atLeast8Char(pw)) {
    setMsg("Password should be at least 8 characters long.")
  } else if (!pc.atLeastOneCap(pw)) {
    setMsg("Password should at least have one capital letter.")
  } else if (!pc.atLeastOneLower(pw)) {
    setMsg("Password should at least have one lowercase letter.")
  } else if (!pc.atLeastOneNumber(pw)) {
    setMsg("Password should at least have one number.")
  } else if (!pc.atLeastOneSpecial(pw)) {
    setMsg("Password should at least have one special character.")
  } else {
    return true
  }
  setSuccess(false)
  return false
}

export default ValidatePassword;