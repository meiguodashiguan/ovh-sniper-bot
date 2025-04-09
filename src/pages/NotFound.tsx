
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 错误：用户尝试访问不存在的路由：",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">哎呀！页面未找到</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          返回首页
        </a>
      </div>
    </div>
  );
};

export default NotFound;
