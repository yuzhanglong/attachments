import React from "react";
import "./home.less";

const data = import("../i18n/zh-cn");

interface HomeProps {

}

const Home: React.FC<HomeProps> = (props) => {
  console.log(data);
  return (
    <div className={"base-app-home"}>
      <div className={"title"}>
        🎉 This is Base App home page, the micro app will be rendered below! 🎉
      </div>
      <div className={"content"}>
        {/*// @ts-ignore*/}
        {intl("Yzl_Test_Ok!!", {
          a: 11,
          b: 2
        })}
      </div>
    </div>
  );
};

export default Home;
