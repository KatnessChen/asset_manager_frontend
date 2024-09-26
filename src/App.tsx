import { useState, useEffect } from "react";
import { Link, BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Layout, Menu } from "antd";
import "./index.css";
import PersonalDashboard from "./page/PersonalDashboard";
import Portfolio from "./page/Portfolio/index";
import useUserStore from "./store/user_store";
import useAssetStore from "./store/asset_store";

const { Header, Content } = Layout;

function App() {
  const [selectedKey, setSelectedKey] = useState("1");

  const { user, isLoading: isLoadingUser, fetchUser } = useUserStore();
  const { fetchAssets, fetchAssetTypes } = useAssetStore();

  useEffect(() => {
    fetchUser();
    fetchAssetTypes();
  }, [fetchUser, fetchAssetTypes]);

  useEffect(() => {
    if (!isLoadingUser && user) fetchAssets();
  }, [isLoadingUser, user, fetchAssets]);

  const handleMenuClick = (e: { key: string }) => {
    setSelectedKey(e.key);
  };

  return (
    <Router>
      <Layout>
        <Header>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[selectedKey]}
            onClick={handleMenuClick}
          >
            <Menu.Item key="1">
              <Link to="/">Overview</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/portfolio">Portfolio</Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: 24, backgroundColor: "#f5f5f5" }}>
          <Routes>
            <Route path="/" element={<PersonalDashboard />} />
            <Route path="/portfolio" element={<Portfolio />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
}

export default App;
