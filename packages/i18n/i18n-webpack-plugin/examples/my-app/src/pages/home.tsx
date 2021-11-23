import React from "react";
import "./home.less";

interface HomeProps {

}

const Home: React.FC<HomeProps> = (props) => {
  return (
    <div className={"base-app-home"}>
      <div className={"title"}>
        🎉 This is Base App home page, the micro app will be rendered below! 🎉
      </div>
      <div className={"content"}>
        {/*// @ts-ignore*/ }
        {intl("Yzl_Test_Ok", {})}
      </div>
    </div>
  );
};

export default Home;
