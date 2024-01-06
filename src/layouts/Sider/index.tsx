import React, { useEffect } from 'react';
import { Layout } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import Menu from './Menu';
import { setCollapsed } from '@/redux/actions/appActions';
import useScreenType from '@/hooks/useScreenType';

const CustomSider = styled(Layout.Sider)`
  overflow: auto;
  margin: 10px;
  border-radius: 10px;
  background-color: ${props => props.theme === 'light' ? '#fff' : '000'} !important;
  @media (max-width: 768px) {
    position: fixed !important;
    z-index: 100;
    height: 100vh;
    background-color: rgba(0,0,0,0.5) !important;
    ${props => !props.collapsed ? 'width: 100% !important; max-width: 100% !important;' : ''}

    .ant-layout-sider-children {
      width: 200px;
      background-color: ${props => props.theme === 'light' ? '#fff' : '000'};
    }
  }
`;

const Logo = styled.div`
  width: 100%;
  height: 64px;
  line-height: 64px;
  text-align: center;
  font-size: 24px;
  overflow: hidden;
  text-shadow: 1px -1px #fff, -1px 1px #999, -4px 4px 2px #80808080;
`;

const Sider: React.FC = () => {
  const dispatch = useDispatch();
  const screenType = useScreenType();

  const collapsed = useSelector((state: any) => state.app.collapsed);

  const collapsedWidthMap: Record<string, 0 | 80> = {
    small: 0,
    middle: 80,
    large: 80,
    '': 80,
  };

  const siderClick = (e: React.MouseEvent<HTMLElement>) => {
    const targetElement = e.target as HTMLElement;
    if (targetElement.tagName !== 'ASIDE') return;

    dispatch(setCollapsed(true));
  };

  useEffect(() => {
    if (screenType === 'large') {
      dispatch(setCollapsed(false));
    } else {
      dispatch(setCollapsed(true));
    }
  }, [dispatch, screenType]);

  return (
    <CustomSider
      breakpoint="md"
      collapsedWidth={collapsedWidthMap[screenType]}
      onCollapse={(collapsed) => {
        collapsed && dispatch(setCollapsed(collapsed));
      }}
      collapsible
      collapsed={collapsed}
      trigger={null}
      theme="light"
      onClick={siderClick}
    >
      <Logo>{collapsed ? 'Rush' : 'Rush Kit'}</Logo>
      <Menu />
    </CustomSider>
  );
};

export default Sider;
