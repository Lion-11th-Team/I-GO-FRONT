import Spinner from "../components/Spinner";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { loginSuccess } from "@store/actions";
import axios from "axios";
import { userSuccess } from "../store/user/actions";

export default function LoginCallbackPage() {
  const CODE = new URL(window.location.href).searchParams.get("code");
  const [registerState, setRegisterState] = useState(null);
  const [provider, setProvider] = useState(
    localStorage.getItem("login-provider")
  );
  // const [userInfo, setUserInfo] = useState({});
  // const userInfo = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const selectProvider = () => {
    if (provider === "kakao") {
      sendCode("kakao");
    } else if (provider === "google") {
      sendCode("google");
    } else {
      sendCode("github");
    }
    console.log("login about:", provider);
    localStorage.removeItem("login-provider");
  };

  const sendCode = async (provider) => {
    if (registerState === true) {
      return;
    }
    try {
      const response = await axios.post(
        `http://api.igoofficial.com/auth/${provider}/token`,
        { code: CODE }
      );
      localStorage.setItem("access-token", response.data.access);
      localStorage.setItem("refresh-token", response.data.refresh);
      setRegisterState(response.data.is_register);
    } catch (error) {
      console.log("Code sending error!");
    }
  };

  const getProfile = async () => {
    try {
      const response = await axios.get("http://api.igoofficial.com/accounts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access-token")}`,
        },
      });
      localStorage.setItem("user-id", response.data.id);
      //이걸 리덕스에 dispatch하기
      const user = response.data;
      const newUser = {
        is_student: response.data.is_student,
        is_carer: response.data.is_carer,
        is_register: response.data.is_register,
        point: response.data.point,
        id: response.data.id,
        name: user.profile.name,
        adminName: user.profile.admin_name,
        img: user.profile.image,
      };
      dispatch(userSuccess(newUser));
    } catch (error) {
      console.log("Fetch User Info Error!");
    }
  };

  const movePage = useNavigate();
  const moveToPage = () => {
    if (registerState === true) {
      // 로그인 여부 리덕스 스토어 저장
      getProfile();
      movePage("/");
    } else if (registerState === false) {
      movePage("/addInfo");
    } else {
      return;
    }
  };

  useEffect(() => {
    selectProvider();
  }, []);
  useEffect(() => {
    moveToPage();
  }, [registerState]);

  return (
    <div>
      <Spinner />
    </div>
  );
}
